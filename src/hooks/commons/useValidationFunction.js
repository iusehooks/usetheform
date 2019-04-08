import { useRef } from "react";
import passValidation from "./../../utils/passValidation";

export default function useValidationFunction(validators) {
  const validationMsg = useRef(undefined);
  const validationObj = useRef(null);
  const validationFN = useRef((value, stateForm) => {
    const { isValid, checks } = passValidation(value, validators, stateForm);
    validationMsg.current = getValidationMsg(checks);
    validationObj.current = { isValid, checks };
    return isValid;
  });

  return { validationMsg, validationObj, validationFN };
}

function getValidationMsg(errors) {
  return errors.find(e => e !== undefined && e !== null);
}
