import {
  shouldRunAsyncValidator,
  getValueByPath,
  createForm
} from "../../src/utils/formUtils";
import { STATUS } from "../../src/utils/constants";

describe("formUtils => shouldRunAsyncValidator", () => {
  it("returns true for valid field validators", () => {
    const validators = {
      a: { type: "field", isValid: true, counter: 1 },
      b: { type: "field", isValid: false, counter: 0 }
    };
    expect(shouldRunAsyncValidator(validators)).toBe(true);
  });

  it("returns false if counter is 1 but isValid is false", () => {
    const validators = {
      a: { type: "field", isValid: false, counter: 1 }
    };
    expect(shouldRunAsyncValidator(validators)).toBe(false);
  });

  it("returns false if counter is 0 but isValid is true", () => {
    const validators = {
      a: { type: "field", isValid: true, counter: 0 }
    };
    expect(shouldRunAsyncValidator(validators)).toBe(false);
  });

  it("ignores validators with type not equal to 'field'", () => {
    const validators = {
      a: { type: "collection", isValid: false, counter: 0 },
      b: { type: "field", isValid: false, counter: 0 }
    };
    expect(shouldRunAsyncValidator(validators)).toBe(true);
  });

  it("returns true for empty validatorsMaps", () => {
    expect(shouldRunAsyncValidator({})).toBe(true);
  });
});

describe("formUtils => getValueByPath", () => {
  const obj = {
    a: {
      b: {
        c: 42
      }
    },
    x: {
      y: null
    }
  };

  it("accesses nested value using default '/' separator", () => {
    expect(getValueByPath("a/b/c", obj)).toBe(42);
  });

  it("accesses value using array path", () => {
    expect(getValueByPath(["a", "b", "c"], obj)).toBe(42);
  });

  it("returns undefined if path does not exist", () => {
    expect(getValueByPath("a/b/x", obj)).toBe(undefined);
  });

  it("returns null if final value is null", () => {
    expect(getValueByPath("x/y", obj)).toBe(null);
  });

  it("works with custom separator", () => {
    expect(getValueByPath("a.b.c", obj, ".")).toBe(42);
  });

  it("returns undefined for empty string path", () => {
    expect(getValueByPath("", obj)).toBe(undefined);
  });
});

describe("formUtils => createForm", () => {
  it("creates form state and updates formStore", () => {
    const mockStore = {
      update: jest.fn()
    };
    const initialState = { name: "John" };

    const formState = createForm(initialState, mockStore);

    expect(formState).toEqual({
      state: { name: "John" },
      isValid: true,
      status: STATUS.READY,
      pristine: true,
      isSubmitting: false,
      submitAttempts: 0,
      submitted: 0
    });

    expect(mockStore.update).toHaveBeenCalledWith(formState, false);
  });

  it("uses empty object as default state", () => {
    const mockStore = { update: jest.fn() };

    const formState = createForm(undefined, mockStore);

    expect(formState.state).toEqual({});
    expect(mockStore.update).toHaveBeenCalledWith(formState, false);
  });
});
