import { describe, it, expect } from "vitest";
import {
  parseNodeEnv,
  parsePort,
  parseLogLevel,
} from "@/config/env";

describe("parsePort", () => {
  it("should parse a valid PORT", () => {
    expect(parsePort("3000")).toBe(3000);
  });

  it("should throw for non-integer PORT", () => {
    expect(() => parsePort("abc")).toThrow("PORT must be a valid TCP port number");
  });

  it("should throw for PORT out of range", () => {
    expect(() => parsePort("99999")).toThrow("PORT must be a valid TCP port number");
  });

  it("should throw for zero PORT", () => {
    expect(() => parsePort("0")).toThrow("PORT must be a valid TCP port number");
  });

  it("should throw for negative PORT", () => {
    expect(() => parsePort("-1")).toThrow("PORT must be a valid TCP port number");
  });

  it("should accept PORT 65535", () => {
    expect(parsePort("65535")).toBe(65535);
  });
});

describe("parseNodeEnv", () => {
  it("should accept development", () => {
    expect(parseNodeEnv("development")).toBe("development");
  });

  it("should accept production", () => {
    expect(parseNodeEnv("production")).toBe("production");
  });

  it("should accept test", () => {
    expect(parseNodeEnv("test")).toBe("test");
  });

  it("should throw for invalid NODE_ENV", () => {
    expect(() => parseNodeEnv("staging")).toThrow("NODE_ENV must be one of");
  });
});

describe("parseLogLevel", () => {
  it("should accept valid log levels", () => {
    expect(parseLogLevel("debug")).toBe("debug");
  });
});
