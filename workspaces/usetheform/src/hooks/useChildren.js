import { useState, useEffect } from "react";
import { usePublicContextForm } from "./useOwnContext";
import { STATUS } from "./../utils/constants";
import { noop } from "./../utils/noop";

export function useChildren(initialState = [], onReset = noop) {
  const [children, setChilren] = useState(() => initialState);
  const { formStatus } = usePublicContextForm();
  useEffect(() => {
    if (formStatus === STATUS.ON_RESET) {
      setChilren([]);
      onReset();
    }
  }, [formStatus]);

  return [children, setChilren];
}
