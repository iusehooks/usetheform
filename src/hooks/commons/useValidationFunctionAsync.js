import { useRef } from "react";

export function useValidationFunctionAsync(asyncValidator, onAsyncValidation) {
  const validationMsg = useRef(undefined);
  const timestampAsyncFunc = useRef(null);

  const validationFN = useRef(value => {
    const newValue = value === undefined ? "" : value;

    const timestamp = Date.now();
    timestampAsyncFunc.current = timestamp;

    onAsyncValidation({ status: "asyncStart" });
    return new Promise((resolve, reject) => {
      asyncValidator(newValue)
        .then(value => {
          if (timestampAsyncFunc.current === timestamp) {
            validationMsg.current = value;
            onAsyncValidation({ status: "asyncSuccess", value });
            resolve(value);
          } else {
            reject("cancelled");
          }
        })
        .catch(value => {
          if (timestampAsyncFunc.current === timestamp) {
            validationMsg.current = value;
            onAsyncValidation({ status: "asyncError", value });
            reject(value);
          } else {
            reject("cancelled");
          }
        });
    });
  });

  return [validationFN];
}
