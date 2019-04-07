import { useState } from "react";

const initialState = { error: undefined, isValid: true };
export default function useValidation(validators = []) {
  const [status, setState] = useState(() => ({ ...initialState }));
  const onValidation = (errors, isValid) =>
    setState({
      error: getValidationMsg(errors),
      isValid
    });
  const resetSyncErr = () => setState({ ...initialState });

  return [status, { onValidation, validators, resetSyncErr }];
}

function getValidationMsg(errors) {
  let errorMsg;
  for (let i = 0; i < errors.length; i++) {
    if (errors[i] !== undefined && errors[i] !== null) {
      errorMsg = errors[i];
      break;
    }
  }
  return errorMsg;
}
