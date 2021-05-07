import { createContext, useContext } from "react";

export const ContextObject = createContext();
export const ContextForm = createContext();
export const PersistStateOnUnmountContext = createContext();

export const usePublicContextForm = () => {
  const {
    state,
    reset,
    isValid,
    pristine,
    submitted,
    submitAttempts,
    isSubmitting,
    formStatus,
    dispatchNewState: dispatch,
    onSubmitForm
  } = useContext(ContextForm);

  return {
    state,
    reset,
    isValid,
    pristine,
    submitted,
    submitAttempts,
    isSubmitting,
    formStatus,
    dispatch,
    onSubmitForm
  };
};

export function useOwnContext() {
  const contextObject = useContext(ContextObject);
  const contextForm = useContext(ContextForm);
  const context = contextObject || contextForm;
  return context;
}
