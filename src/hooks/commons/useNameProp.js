import { useRef, useContext, useCallback, useEffect } from "react";
import { IndexContext } from "./../../hoc/withIndex";

export const useNameProp = (context, name, index) => {
  const nameProp = useRef(name);
  const namePropSave = useRef(name);

  const uniqueIDFromContext = useContext(IndexContext);
  let uniqueIDarrayContext =
    uniqueIDFromContext !== undefined ? uniqueIDFromContext.id : 1;
  const setNameProp = useCallback(index => {
    nameProp.current = index;
  }, []);

  if (context.type === "array") {
    if (index !== undefined) {
      uniqueIDarrayContext = uniqueIDFromContext.getID();
      nameProp.current = index;
    } else if (nameProp.current === undefined) {
      nameProp.current = context.getIndex(uniqueIDarrayContext);
    }
  }

  useEffect(() => {
    namePropSave.current = nameProp.current;
    return () => {
      nameProp.current = namePropSave.current;
    };
  }, []);

  return { nameProp, uniqueIDarrayContext, setNameProp };
};
