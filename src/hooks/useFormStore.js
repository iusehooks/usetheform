import { createContext, useContext } from "react";

export const FormStoreContext = createContext({});

export const useFormStore = () => {
  const context = useContext(FormStoreContext);
  return context;
};

export const useFormStorePublicAPI = () => {
  const { dispatch, state } = useContext(FormStoreContext);
  return { state, dispatch };
};
