import { passValidation } from "./../../src/utils/passValidation";

const formState = { name: "BeBo " };

describe("Utils => passValidation", () => {
  it("should validate the value with the given validators", () => {
    const { checks, isValid } = passValidation("BeBo", [isValidVal], formState);
    expect(isValid).toBe(true);
    expect(checks[0]).toBe(undefined);
  });

  it("should be valid if validators functions are missing", () => {
    const { checks, isValid } = passValidation("BeBo", undefined, formState);
    expect(isValid).toBe(true);
    expect(checks).toStrictEqual([]);
  });
});

function isValidVal(value) {
  return value !== undefined ? undefined : "error";
}
