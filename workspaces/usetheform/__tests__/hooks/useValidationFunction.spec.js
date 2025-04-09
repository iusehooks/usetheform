import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import { useValidationFunction } from "./../../src/hooks/commons/useValidationFunction";

describe("Hooks => useValidationFunction", () => {
  it("should useValidationFunction tested with empty validators", () => {
    const callbackTest = jest.fn();
    const props = { callbackTest };

    render(<Helper {...props} />);

    expect(callbackTest).toHaveBeenCalledWith(
      undefined,
      null,
      expect.any(Function)
    );
  });
});

function Helper({ validators, callbackTest }) {
  const { validationMsg, validationObj, validationFN } = useValidationFunction(
    validators
  );
  useEffect(() => {
    callbackTest(
      validationMsg.current,
      validationObj.current,
      validationFN.current
    );
  }, []);
  return null;
}
