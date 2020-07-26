import { useRef, useContext, useCallback } from "react";
import { IndexContext } from "./../../hoc/withIndex";

export const useNameProp = (context, name, index) => {
  const nameProp = useRef(name);
  const uniqueIDFromContext = useContext(IndexContext);
  let uniqueIDarrayContext = uniqueIDFromContext.id;
  const setNameProp = useCallback(index => {
    nameProp.current = index;
  }, []);

  // if index is missed in a array context
  if (context.type === "array" && nameProp.current === undefined) {
    if (index !== undefined) {
      uniqueIDarrayContext = uniqueIDFromContext.getID();
      nameProp.current = index;
    } else {
      nameProp.current = context.getIndex(uniqueIDarrayContext);
    }
  }

  return { nameProp, uniqueIDarrayContext, setNameProp };
};
