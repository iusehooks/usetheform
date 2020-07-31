import { useRef, useState, useEffect, useCallback } from "react";
import { useValidators } from "./useValidators";
import { updateState } from "./../utils/updateState";
import { chainReducers } from "./../utils/chainReducers";

import {
  STATUS,
  createForm,
  isFormValid,
  isFormValidAsync,
  generateAsynFuncs,
  shouldRunAsyncValidator,
  flatAsyncValidationMap
} from "./../utils/formUtils";

const noop = _ => undefined;
const emptyStateValue = {};

export function useForm({
  initialState,
  onChange = noop,
  onReset = noop,
  onInit = noop,
  onSubmit = noop,
  reducers = [],
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  action
}) {
  const [formState, dispatch] = useState(() => createForm(initialState));
  const stateRef = useRef(formState);

  const { current: isMultipleForm } = useRef(
    isUsingMultipleForm(_getInitilaStateForm_, _onMultipleForm_, name)
  );

  const { current: dispatchFormState } = useRef(
    ({ state, status, ...rest }) => {
      const prevState =
        status === STATUS.ON_RESET
          ? memoInitialState.current.state
          : status === STATUS.ON_INIT
          ? emptyStateValue
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
    removeValidatorsAsync,
    validatorsMapsAsync,
    updateValidatorsMap,
    resetValidatorsMap
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
          isValid: initialValue,
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

      const isValid =
        isFormValid(validators.current, state) &&
        isFormValidAsync(validatorsMapsAsync.current);

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

    const validatorsMapsAsync = resetValidatorsMap();

    const isValid =
      isFormValid(validators.current, state) &&
      isFormValidAsync(validatorsMapsAsync);

    const status = STATUS.ON_RESET;

    dispatchFormState({
      ...memoInitialState.current,
      state,
      status,
      isValid,
      submitted: 0,
      submitAttempts: 0,
      isSubmitting: false
    });
  });

  const { current: onSubmitForm } = useRef(e => {
    e.persist();
    const { isValid, submitAttempts: prevAttempts } = stateRef.current;
    const status = STATUS.ON_SUBMIT;

    if (typeof action !== "string" || !isValid) {
      e.preventDefault();
    }

    const submitAttempts = prevAttempts + 1;
    if (
      isValid &&
      Object.keys(validatorsAsync.current).length > 0 &&
      shouldRunAsyncValidator(validatorsMapsAsync.current)
    ) {
      const { state } = stateRef.current;
      const asyncArrayProm = generateAsynFuncs(
        validatorsAsync.current,
        validatorsMapsAsync.current,
        state,
        updateValidatorsMap
      );
      const { target } = e;
      e.preventDefault();

      // Set isValid to false until it ends the async checks
      dispatchFormState({
        ...stateRef.current,
        isValid: false,
        isSubmitting: true,
        submitAttempts
      });

      Promise.all(asyncArrayProm)
        .then(() => {
          dispatchFormState({ ...stateRef.current, status, isValid: true });
          if (
            typeof action === "string" &&
            typeof target.submit === "function"
          ) {
            target.submit();
          }
        })
        .catch(() => {
          const isValid = shouldRunAsyncValidator(validatorsMapsAsync.current);
          const isSubmitting = false;
          dispatchFormState({ ...stateRef.current, isValid, isSubmitting });
        });
    } else {
      dispatchFormState({
        ...stateRef.current,
        status,
        isSubmitting: true,
        submitAttempts
      });
    }
  });

  // used only to replace the entire Form State
  const { current: dispatchNewState } = useRef(nextState => {
    let newState = nextState;
    if (typeof nextState === "function") {
      const { state: currentState } = stateRef.current;
      newState = nextState(currentState);
    }
    propagateState(newState, false);
  });

  // used to register async validation Actions
  const asyncInitValidation = useRef({});
  const registerAsyncInitValidation = useCallback((nameProp, asyncFunc) => {
    asyncInitValidation.current[nameProp] = asyncFunc;
  }, []);

  const runInitialAsyncValidators = useCallback(() => {
    const keyAsyncValitions = Object.keys(asyncInitValidation.current);
    if (keyAsyncValitions.length > 0) {
      const status = STATUS.ON_INIT_ASYNC;
      dispatchFormState({ ...stateRef.current, status });

      const promises = flatAsyncValidationMap(asyncInitValidation.current);
      Promise.all(promises)
        .then(() => {
          const status = STATUS.READY;
          const isValid = isFormValid(
            validators.current,
            stateRef.current.state
          );
          dispatchFormState({
            ...stateRef.current,
            status,
            isValid
          });
        })
        .catch(() => {
          const status = STATUS.READY;
          dispatchFormState({
            ...stateRef.current,
            status,
            isValid: false
          });
        });
    }
  }, []);

  const runAsyncValidation = useCallback(({ start, end }) => {
    if (start) {
      const status = STATUS.ON_RUN_ASYNC;
      dispatchFormState({ ...stateRef.current, isValid: false, status });
    } else if (end) {
      const status = STATUS.READY;
      const isValid =
        isFormValid(validators.current, stateRef.current.state) &&
        isFormValidAsync(validatorsMapsAsync.current);
      dispatchFormState({ ...stateRef.current, isValid, status });
    }
  }, []);

  // change status form to READY after being reset
  useEffect(() => {
    const { status, state, isValid } = stateRef.current;

    if (status === STATUS.ON_RESET) {
      onReset(state);
      dispatchFormState({ ...stateRef.current, status: STATUS.RESETTED });
    } else if (status === STATUS.ON_CHANGE) {
      onChange(state);
    } else if (status === STATUS.ON_INIT) {
      const updateState = newState => propagateState(newState, false);
      onInit(state, updateState);
      runInitialAsyncValidators();
    } else if (status === STATUS.ON_SUBMIT) {
      const common = { isSubmitting: false, status: STATUS.READY };
      if (isValid) {
        const result = onSubmit(state, isValid);
        if (result && typeof result.then === "function") {
          result
            .then(() => {
              const submitted = stateRef.current.submitted + 1;
              dispatchFormState({ ...stateRef.current, ...common, submitted });
            })
            .catch(() => dispatchFormState({ ...stateRef.current, ...common }));
        } else {
          const { submitted: prevSub } = stateRef.current;
          const submitted = result === false ? prevSub : prevSub + 1;
          dispatchFormState({ ...stateRef.current, ...common, submitted });
        }
      } else {
        dispatchFormState({ ...stateRef.current, ...common });
      }
    }
    if (
      isMultipleForm &&
      (status === STATUS.ON_RESET ||
        status === STATUS.ON_CHANGE ||
        status === STATUS.ON_INIT ||
        status === STATUS.ON_SUBMIT)
    ) {
      _onMultipleForm_(name, state);
    }
  }, [stateRef.current]);

  // after form is mounted dispatch the initial state
  useEffect(() => {
    isMounted.current = true;

    // It is using the useMultipleForm hook
    const pristine =
      (isMultipleForm &&
        (_getInitilaStateForm_(name) == undefined ||
          Object.keys(_getInitilaStateForm_(name)).length === 0)) ||
      !isMultipleForm;

    const state = isMultipleForm
      ? _getInitilaStateForm_(name) || stateRef.current.state
      : stateRef.current.state;

    const isValid =
      isFormValid(validators.current, state) &&
      isFormValidAsync(validatorsMapsAsync.current);

    stateRef.current = {
      ...stateRef.current,
      state,
      isValid,
      pristine,
      status: STATUS.ON_INIT
    };

    dispatchFormState(stateRef.current);
  }, []);

  return {
    ...formState, // { isValid, state, status, pristine, isSubmitting }
    formState: formState.state, // pass the global form state down
    formStatus: formState.status, // pass the global form status down
    registerAsyncInitValidation,
    runAsyncValidation,
    dispatchNewState,
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
    updateValidatorsMap,
    registerReset,
    unRegisterReset
  };
}

function isUsingMultipleForm(_getInitilaStateForm_, _onMultipleForm_, name) {
  return (
    typeof _getInitilaStateForm_ === "function" &&
    typeof _onMultipleForm_ === "function" &&
    typeof name === "string"
  );
}
