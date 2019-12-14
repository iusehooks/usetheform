import { useRef } from "react";

export function useValidationFunctionAsync(asyncValidator, onAsyncValidation) {
  const validationMsg = useRef(undefined);
  const validationFN = useRef(value => {
    const newValue = value === undefined ? "" : value;

    onAsyncValidation({ status: "asyncStart" });
    return new Promise((resolve, reject) => {
      asyncValidator(newValue)
        .then(value => {
          validationMsg.current = value;
          onAsyncValidation({ status: "asyncSuccess", value });
          resolve(value);
        })
        .catch(value => {
          validationMsg.current = value;
          onAsyncValidation({ status: "asyncError", value });
          reject(value);
        });
    });
  });

  return [validationFN];
}
