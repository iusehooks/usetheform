import { useRef, useContext, useCallback } from "react";
import { IndexContext } from "./../../hoc/withIndex";

export const useNameProp = (context, name, index) => {
  const nameProp = useRef(name || index);
  const uniqueIDFromContext = useContext(IndexContext);
  const uniqueIDarrayContext = uniqueIDFromContext || index;
  const setNameProp = useCallback(index => {
    nameProp.current = index;
  }, []);

  // if index is missed in a array context
  if (context.type === "array" && nameProp.current === undefined) {
    nameProp.current = context.getIndex(uniqueIDarrayContext);
  }

  return { nameProp, uniqueIDarrayContext, setNameProp };
};
