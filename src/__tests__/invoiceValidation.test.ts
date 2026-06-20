import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateGSTIN } from "@/utils/gstCalculations";

describe("invoice validation", () => {
  it("accepts 15-character alphanumeric GSTINs", () => {
    assert.equal(validateGSTIN("27ABCDE1234F1Z5"), true);
  });

  it("rejects GSTINs with invalid length", () => {
    assert.equal(validateGSTIN("27ABCDE1234F1Z"), false);
  });

  it("rejects GSTINs with symbols", () => {
    assert.equal(validateGSTIN("27ABCDE1234F1@5"), false);
  });
});
