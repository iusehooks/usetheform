import { useRef, useContext, useCallback, useEffect } from "react";
import { IndexContext } from "./../../hoc/withIndex";

export const useNameProp = (context, name, index) => {
  const nameProp = useRef(name);
  const namePropSaved = useRef(name);

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
  const unMountIndex = () => {
    if (context && context.type === "array") {
      nameProp.current = index !== undefined ? index : namePropSaved.current;
    } else {
      nameProp.current = name;
    }
  };
  useEffect(() => {
    namePropSaved.current = nameProp.current;
  }, []);

  return { nameProp, uniqueIDarrayContext, setNameProp, unMountIndex };
};
