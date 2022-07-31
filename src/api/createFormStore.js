import { useState, useEffect } from "react";
import { DISPATCHER_LABEL } from "../utils/constants";
import { noop } from "../utils/noop";

export function createFormStore() {
  const { subscribe, notify } = createListener();
  const stateRef = { current: {} };
  const store = formState => {
    stateRef.current = { ...stateRef.current, ...formState };
    notify(stateRef);
  };
  return [store, useFieldSelector(subscribe, stateRef)];
}

const useFieldSelector = (subscribe, stateRef) => {
  return (fn, formInitialState) => {
    const [field, setState] = useState(() =>
      getValueAndSetter(stateRef, fn, formInitialState)
    );

    useEffect(() => {
      function updateState(newStateRef) {
        const valueAndSetter = getValueAndSetter(newStateRef, fn);
        setState(valueAndSetter);
      }

      const unsubscribe = subscribe(updateState);

      const valueAndSetter = getValueAndSetter(stateRef, fn, formInitialState);
      const [, setFn] = valueAndSetter;
      if (setFn !== noop) {
        setState(valueAndSetter);
      }

      return () => unsubscribe();
    }, []);

    return field;
  };
};

const createListener = () => {
  const listener = new Map();
  const subscribe = fn => {
    listener.set(fn, fn);
    return () => listener.delete(fn);
  };

  const notify = event => {
    listener.forEach(fn => fn(event));
  };
  return { subscribe, notify };
};

function getValueAndSetter(stateRef, selectorFn, formInitialState) {
  const { state = {}, mapFields = {} } = stateRef.current;

  if (process.env.NODE_ENV !== "production") {
    if (typeof selectorFn !== "function") {
      throw new Error(
        "createFormStore: the state selector argument must be a function"
      );
    }
    if (
      typeof formInitialState === "object" &&
      formInitialState.constructor === Array
    ) {
      throw new Error(
        "createFormStore: the initial form state argument must be an object"
      );
    }
  }

  const targetState =
    Object.keys(state).length === 0 && formInitialState
      ? formInitialState
      : state;

  let value;

  try {
    value = selectorFn(targetState);
  } catch {
    value = undefined;
  }

  let fieldDispatcher;
  try {
    fieldDispatcher = selectorFn(mapFields);
  } catch {
    fieldDispatcher = undefined;
  }

  const setFieldValue =
    fieldDispatcher?.[DISPATCHER_LABEL] || fieldDispatcher || noop;

  return [value, setFieldValue];
}
