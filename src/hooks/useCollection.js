import useObject from "./useObject";

export function useCollection({
  name,
  type,
  reducers,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr
}) {
  const { changeProp, state: value, formState: state } = useObject({
    name,
    type,
    reducers,
    onValidation,
    validators,
    resetSyncErr,
    asyncValidator,
    onAsyncValidation,
    resetAsyncErr
  });

  const updateCollection = (propName, value) => changeProp(propName, value);

  return { updateCollection, value, state };
}
