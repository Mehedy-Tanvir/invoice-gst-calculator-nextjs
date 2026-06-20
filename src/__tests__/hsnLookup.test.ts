import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HSN_OPTIONS } from "@/components/HSNLookup";

describe("HSN lookup options", () => {
  it("contains the required service HSN codes", () => {
    const codes = HSN_OPTIONS.map((option) => option.code);

    assert.deepEqual(codes, [
      "998314",
      "998313",
      "998312",
      "998361",
      "997331",
      "998222",
      "9982",
      "9983",
      "9989",
      "998311",
    ]);
  });

  it("maps software development to 998314", () => {
    assert.equal(
      HSN_OPTIONS.find((option) => option.code === "998314")?.label,
      "Software development",
    );
  });
});
