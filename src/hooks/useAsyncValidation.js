import { useState } from "react";

const initialStatus = { status: undefined, value: undefined };
export function useAsyncValidation(asyncValidator) {
  const [status, setStatus] = useState(() => ({ ...initialStatus }));
  const onAsyncValidation = newStatus => setStatus({ ...status, ...newStatus });
  const resetAsyncErr = () => setStatus({ ...initialStatus });
  return [status, { onAsyncValidation, asyncValidator, resetAsyncErr }];
}
