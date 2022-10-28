import { InvalidTypeError } from "./InvalidTypeError";

export const isJSON = (input: unknown): input is JSON => {
  if (typeof input === "string") {
    try {
      JSON.parse(input);
      return true;
    } catch (err) {
      console.log("Cannot parse string");
      return false;
    }
  }

  if (typeof input === "object" && input !== null) {
    return input.constructor.name === "Object";
  }

  return false;
};

export const combineAllArrayObjects = (arr: any[]): any => {
  let obj = {};
  arr.forEach((item) => (obj = { ...obj, ...item }));
  return obj;
};

/**
 * @param input javascript object to be converted
 * @returns string representation of graphql query
 */
export const json2Gql = (input: unknown, top = true) => {
  if (!top && typeof input === "object" && input.constructor.name !== "Object") return "";
  if (!isJSON(input)) throw new InvalidTypeError("Cannot convert non-JSON format");

  const keys: string[] = [];

  Object.keys(input).forEach((key: string) => {
    keys.push(key);

    if (!Array.isArray(input[key]) && typeof input[key] === "object" && input[key] !== null) {
      const children = json2Gql(input[key], false);
      keys.push(children);
    }

    if (Array.isArray(input[key]) && typeof input[key][0] === "object") {
      const children = json2Gql(combineAllArrayObjects(input[key]), false);
      keys.push(children);
    }
  });

  return `{ ${keys.join(" ")} }`.replace(/\s\s/g, " ");
};
