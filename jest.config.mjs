// jest.config.mjs
import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom", // needed for Konva/text nodes
  transform: createDefaultPreset().transform,
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^konva$": "<rootDir>/__mocks__/konva.js", // use your mock
  },
};
