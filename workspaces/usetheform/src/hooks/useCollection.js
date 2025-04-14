import { useCallback } from "react";
import { useObject } from "./useObject";

export function useCollection({
  name,
  index,
  type,
  value: initialValue,
  reducers,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr
}) {
  const {
    changeProp,
    state: value,
    formState: state
  } = useObject({
    name,
    index,
    type,
    value: initialValue,
    reducers,
    onValidation,
    validators,
    resetSyncErr,
    asyncValidator,
    onAsyncValidation,
    resetAsyncErr
  });

  const updateCollection = useCallback(
    (propName, value) => changeProp(propName, value),
    []
  );

  return { updateCollection, value, state };
}
