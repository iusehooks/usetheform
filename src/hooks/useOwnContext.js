import { createContext, useContext } from "react";

export const ContextObject = createContext();
export const ContextForm = createContext();

export const usePublicContextForm = () => {
  const { state, reset, isValid, pristine, formStatus } = useContext(
    ContextForm
  );
  return { state, reset, isValid, pristine, formStatus };
};

export default function useOwnContext() {
  const contextObject = useContext(ContextObject);
  const contextForm = useContext(ContextForm);
  const context = contextObject || contextForm;
  return context;
}
