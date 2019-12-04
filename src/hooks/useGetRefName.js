import { useRef } from "react";

export function useGetRefName(context, name) {
  const nameProp = useRef(name);

  const { current: setNameProp } = useRef(index => {
    nameProp.current = index;
  });

  if (context.type === "array" && nameProp.current === undefined) {
    nameProp.current = context.getIndex(setNameProp);
  }
  return nameProp;
}
