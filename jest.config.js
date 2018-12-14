'use strict';

module.exports = {
  collectCoverage: true,
  coverageDirectory: "./coverage/",
  roots: [
    "<rootDir>/lib"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
};