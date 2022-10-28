import { describe, expect, it } from "vitest";
import { combineAllArrayObjects, isJSON, json2Gql } from "../src/converter";

describe(".isJson", () => {
  describe("isJSON", () => {
    it("given a valid JSON string, it returns true", () => {
      expect(isJSON('{"property":"value","property2":{"x":1,"y":2}}')).toEqual(true);
    });
    it("given a valid JSON object, it returns true", () => {
      expect(isJSON({ property: "value", property2: { x: 1, y: 2 } })).toEqual(true);
    });
    it("given a string, it returns false", () => {
      expect(isJSON("Some string")).toEqual(false);
    });
    it("given a number, it returns false", () => {
      expect(isJSON(123)).toEqual(false);
    });
    it("given a boolean, it returns false", () => {
      expect(isJSON(true)).toEqual(false);
    });
    it("given a Date object, it returns false", () => {
      expect(isJSON(new Date("2022-09-27"))).toEqual(false);
    });
  });
});

describe(".combineAllArrayObjects", () => {
  it("merges properties for all objects in array", () => {
    expect(
      combineAllArrayObjects([
        { arrProp1: 1, arrProp2: "2" },
        { arrProp1: 2, arrProp2: "2", extraProp: true },
        { arrProp1: 3, arrProp2: "2" }
      ])
    ).toEqual({ arrProp1: 3, arrProp2: "2", extraProp: true });
  });
});

describe(".json2Gql converts", () => {
  it("throws InvalidTypeError for invalid types", () => {
    expect(() => json2Gql(new Date("2022-10-27"))).toThrow("Cannot convert non-JSON format");
  });

  it("flat JSON of strings", () => {
    expect(json2Gql({ prop1: "abc", prop2: "def" })).toEqual("{ prop1 prop2 }");
  });

  it("flat JSON of numbers", () => {
    expect(json2Gql({ prop1: 1, prop2: 2.4 })).toEqual("{ prop1 prop2 }");
  });

  it("flat JSON of booleans", () => {
    expect(json2Gql({ prop1: true, prop2: false })).toEqual("{ prop1 prop2 }");
  });

  it("flat JSON of nulls", () => {
    expect(json2Gql({ prop1: null, prop2: null })).toEqual("{ prop1 prop2 }");
  });

  it("flat JSON of undefined", () => {
    expect(json2Gql({ prop1: undefined, prop2: undefined })).toEqual("{ prop1 prop2 }");
  });

  it("flat JSON of mixed types", () => {
    expect(json2Gql({ str: "somestring", number: 4, boolVal: true, nullVal: null, undefinedVal: undefined })).toEqual(
      "{ str number boolVal nullVal undefinedVal }"
    );
  });

  it("JSON with nested properties", () => {
    expect(json2Gql({ prop1: "1", parent: { child1: "abc", child2: 2 }, prop2: 2 })).toEqual(
      "{ prop1 parent { child1 child2 } prop2 }"
    );
  });

  it("JSON with arrays", () => {
    expect(json2Gql({ prop1: "1", arr: ["2", 4, true], prop2: 2 })).toEqual("{ prop1 arr prop2 }");
  });

  it("JSON with Array of objects", () => {
    expect(
      json2Gql({
        prop1: "1",
        arr: [
          { arrProp1: 1, arrProp2: "2" },
          { arrProp1: 2, arrProp2: "2" },
          { arrProp1: 3, arrProp2: "2" }
        ]
      })
    ).toEqual("{ prop1 arr { arrProp1 arrProp2 } }");
  });

  it("JSON with Array of different objects", () => {
    expect(
      json2Gql({
        prop1: "1",
        arr: [
          { arrProp1: 1, arrProp2: "2" },
          { arrProp1: 2, arrProp2: "2", extraProp: true },
          { arrProp1: 3, arrProp2: "2" }
        ]
      })
    ).toEqual("{ prop1 arr { arrProp1 arrProp2 extraProp } }");
  });

  it("JSON with Arrays and other Objects", () => {
    expect(json2Gql({
      prop1: "1",
      dateField: new Date("2022-10-28"),
      errorObj: new Error("Error"),
    })).toEqual("{ prop1 dateField errorObj }")
  })
});
