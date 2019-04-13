import { useRef } from "react";
export function useMultipleForm(onChange) {
  const stateRef = useRef({});

  // private API
  const { current: _onMultipleForm_ } = useRef((formName, state) => {
    stateRef.current[formName] = state;
    if (typeof onChange === "function") {
      onChange(mergeFormStates(stateRef.current));
    }
  });

  // private API
  const { current: _getInitilaStateForm_ } = useRef(
    formName => stateRef.current[formName]
  );

  const { current: getState } = useRef(() => mergeFormStates(stateRef.current));

  return [getState, { _getInitilaStateForm_, _onMultipleForm_ }];
}

function mergeFormStates(formStates) {
  return Object.keys(formStates).reduce(
    (acc, key) => ({ ...acc, ...formStates[key] }),
    {}
  );
}
