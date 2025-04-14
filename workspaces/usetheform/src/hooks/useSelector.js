import { useContext } from "react";
import { ContextForm } from "./useOwnContext";
import { DISPATCHER_LABEL } from "./../utils/constants";

export function useSelector(fn) {
  const { state, mapFields } = useContext(ContextForm);

  let value;
  try {
    value = fn(state);
  } catch {
    value = undefined;
  }

  let setFieldValue;
  try {
    const fieldDispatcher = fn(mapFields);
    setFieldValue = fieldDispatcher?.[DISPATCHER_LABEL] || fieldDispatcher;
  } catch {
    setFieldValue = undefined;
  }

  return [value, setFieldValue];
}
