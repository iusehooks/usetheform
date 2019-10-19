import { createContext, useContext } from "react";

export const FormStoreContext = createContext({});
export const FormStoreContextIsolatad = createContext({});

export const useFormStore = () => useContext(FormStoreContextIsolatad);

export const useFormStorePublicAPI = () => {
  const { dispatch, state } = useContext(FormStoreContext);
  return { state, dispatch };
};
