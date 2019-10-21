import { createContext, useContext } from "react";

export const FormStoreContextPublic = createContext({});
export const FormStoreContextPrivate = createContext({});

export const useFormStorePivateAPI = () => useContext(FormStoreContextPrivate);
export const useFormStorePublicAPI = () => useContext(FormStoreContextPublic);
