import { useRef, useCallback } from "react";

export function useMapFields(nameProp, context, type = "object") {
  const mapFields = useRef({});

  const updateRegisteredField = useCallback((propName, map) => {
    mapFields.current[propName] = map;
  }, []);

  const unRegisterField = useCallback(propName => {
    delete mapFields.current[propName];
    if (type === "array") {
      mapFields.current = keepIndexSync(mapFields.current);
    }
    context?.updateRegisteredField?.(nameProp.current, mapFields.current);
  }, []);

  return { unRegisterField, mapFields, updateRegisteredField };
}

function keepIndexSync(map) {
  const keys = Object.keys(map);
  const mySelfKey = keys[keys.length - 1];
  const mySelfVal = map[mySelfKey];
  keys.pop();
  const newMapArray = keys.map(key => map[key]);
  return newMapArray.reduce(
    (acc, val, index) => {
      acc[index] = val;
      return acc;
    },
    { [mySelfKey]: mySelfVal }
  );
}
