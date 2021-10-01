// /*
//  * For a detailed explanation regarding each configuration property and type check, visit:
//  * https://jestjs.io/docs/en/configuration.html
//  */

// module.exports = {
//   // Indicates which provider should be used to instrument code for coverage
//   coverageProvider: "v8",

//   // An array of directory names to be searched recursively up from the requiring module's location
//   moduleDirectories: ["node_modules", "src"],

//   // An array of file extensions your modules use
//   moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

//   // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
//   moduleNameMapper: {
//     "@/(.*)": "<rootDir>/src/$1",
//   },

//   testEnvironment: "node",

//   transform: {
//     "^.+\\.ts?$": "ts-jest",
//   },
//   preset: "ts-jest",
// };
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {},
  moduleDirectories: ["js", ".", "node_modules"],
};
