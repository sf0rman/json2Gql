# json2Gql
This is a simple, zero dependency, utility that takes a javascript object and turns it into a GraphQL query.

## Installation
```
npm i json-2-graphql-query
```

## Usage
```
const query = json2Gql(queryObj: object)
```

## Example
```
const query = json2Gql({
  prop1: "1",
  arr: [
    { arrProp1: 1, arrProp2: "2" },
    { arrProp1: 2, arrProp2: "2", extraProp: true },
    { arrProp1: 3, arrProp2: "2" }
  ],
  prop2: true
})

console.log(query):

// OUTPUT
"{ prop1 arr { arrProp1 arrProp2 extraProp } prop2 }"
```
