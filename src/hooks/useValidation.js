import { useState } from "react";
import { getValidationMsg } from "./../utils/getValidationMsg";

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
