import { useRef, useState, useEffect } from "react";
import useValidators from "./useValidators";

import updateState from "./../utils/updateState";
import chainReducers from "./../utils/chainReducers";
import {
  STATUS,
  createForm,
  isFormValid,
  isFormValidAsync
} from "./../utils/formUtils";

const noop = _ => undefined;
export default function useForm({
  initialState,
  onChange = noop,
  onReset = noop,
  onInit = noop,
  onSubmit = noop,
  reducers = []
}) {
  const [formState, dispatch] = useState(() => createForm(initialState));
  const stateRef = useRef(formState);
  const { current: dispatchFormState } = useRef(
    ({ state, status, ...rest }) => {
      const prevState =
        status === STATUS.ON_RESET
          ? memoInitialState.current.state
          : stateRef.current.state;

      const newState =
        status === STATUS.READY || status === STATUS.ON_SUBMIT
          ? state
          : applyReducers(state, prevState, prevState);

      stateRef.current = { ...rest, status, state: newState };
      dispatch(stateRef.current);
    }
  );

  const memoInitialState = useRef({ ...formState });
  const isMounted = useRef(false);

  const { current: stillMounted } = useRef(() => isMounted.current);

  const [validators, addValidators, removeValidators] = useValidators(
    undefined,
    undefined,
    isMounted
  );

  const [
    validatorsAsync,
    addValidatorsAsync,
    removeValidatorsAsync
  ] = useValidators(undefined, undefined, isMounted, true);

  const { current: applyReducers } = useRef(chainReducers(reducers));

  const { current: changeProp } = useRef(
    (nameProp, value, removeMe = false) => {
      const newState = updateState(stateRef.current.state, {
        value,
        nameProp,
        removeMe
      });
      propagateState(newState, false);
    }
  );

  const { current: initProp } = useRef((nameProp, value, initialValue) => {
    if (isMounted.current) {
      // we must update the memoInitialState with the new prop if form is mounted
      memoInitialState.current.state = updateState(
        memoInitialState.current.state,
        {
          value: initialValue,
          nameProp
        }
      );

      const newState = updateState(stateRef.current.state, {
        value,
        nameProp
      });
      propagateState(newState, false);
    } else {
      const newStateInitial = updateState(memoInitialState.current.state, {
        value: initialValue,
        nameProp
      });

      const newState = updateState(stateRef.current.state, {
        value,
        nameProp
      });

      memoInitialState.current.state = newStateInitial;
      stateRef.current.state = newState;
    }
  });

  const { current: removeProp } = useRef(
    (
      namePropExt,
      { currentState, removeCurrent, initialState, removeInitial }
    ) => {
      const newState = updateState(stateRef.current.state, {
        value: currentState,
        nameProp: namePropExt,
        removeMe: removeCurrent
      });

      // if a prop removed was also a prop already initialized we must update the memoInitialState
      memoInitialState.current.state = updateState(
        memoInitialState.current.state,
        {
          value: initialState,
          nameProp: namePropExt,
          removeMe: removeInitial
        }
      );

      propagateState(newState);
    }
  );

  const { current: propagateState } = useRef(
    (state, changePristine, status = STATUS.ON_CHANGE) => {
      const pristine =
        changePristine !== undefined
          ? changePristine
          : stateRef.current.pristine;
      const isValid = isFormValid(validators.current, state);
      dispatchFormState({
        ...stateRef.current,
        state,
        isValid,
        pristine,
        status
      });
    }
  );

  const resetObj = useRef({});
  const { current: registerReset } = useRef((nameProp, fnReset) => {
    resetObj.current = { ...resetObj.current, [nameProp]: fnReset };
  });

  const { current: unRegisterReset } = useRef(nameProp => {
    delete resetObj.current[nameProp];
  });

  const { current: reset } = useRef(() => {
    const state = Object.keys(resetObj.current).reduce((acc, key) => {
      const value = resetObj.current[key](memoInitialState.current.state);
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {});

    const isValid = isFormValid(validators.current, state);
    const status = STATUS.ON_RESET;
    dispatchFormState({ ...memoInitialState.current, state, status, isValid });
  });

  const { current: onSubmitForm } = useRef(e => {
    e.preventDefault();

    const status = STATUS.ON_SUBMIT;
    const { isValid } = stateRef.current;
    if (isValid && Object.keys(validatorsAsync.current).length > 0) {
      const { state } = stateRef.current;

      const asyncArrayProm = isFormValidAsync(validatorsAsync.current, state);
      Promise.all(asyncArrayProm)
        .then(() => dispatchFormState({ ...stateRef.current, status }))
        .catch(() => undefined);
    } else {
      dispatchFormState({ ...stateRef.current, status });
    }
  });

  // chenge status form to READY after being reset
  useEffect(() => {
    if (stateRef.current.status === STATUS.ON_RESET) {
      onReset(stateRef.current.state);
      dispatchFormState({ ...stateRef.current, status: STATUS.READY });
    } else if (stateRef.current.status === STATUS.ON_CHANGE) {
      onChange(stateRef.current.state);
    } else if (stateRef.current.status === STATUS.ON_INIT) {
      onInit(stateRef.current.state);
    } else if (stateRef.current.status === STATUS.ON_SUBMIT) {
      stateRef.current.isValid &&
        onSubmit(stateRef.current.state, stateRef.current.isValid);
      dispatchFormState({ ...stateRef.current, status: STATUS.READY });
    }
  }, [stateRef.current]);

  // after form is mounted dispatch the initial state
  useEffect(() => {
    isMounted.current = true;

    const isValid = isFormValid(validators.current, stateRef.current.state);

    stateRef.current = {
      ...stateRef.current,
      isValid,
      status: STATUS.ON_INIT
    };

    dispatchFormState(stateRef.current);
  }, []);

  return {
    ...formState,
    changeProp,
    initProp,
    onSubmitForm,
    removeProp,
    stillMounted,
    reset,
    addValidators,
    removeValidators,
    addValidatorsAsync,
    removeValidatorsAsync,
    registerReset,
    unRegisterReset
  };
}
