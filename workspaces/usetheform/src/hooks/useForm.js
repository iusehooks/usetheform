import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useValidators } from "./useValidators";
import { useMapFields } from "./useMapFields";
import { useValidationFunction } from "./commons/useValidationFunction";
import { useValidationFunctionAsync } from "./commons/useValidationFunctionAsync";
import { updateState } from "./../utils/updateState";
import { chainReducers } from "./../utils/chainReducers";
import { noop } from "./../utils/noop";
import {
  STATUS,
  FORM_VALIDATION_LABEL,
  DISPATCHER_LABEL
} from "./../utils/constants";
import {
  createForm,
  isFormValid,
  isFormValidAsync,
  generateAsynFuncs,
  shouldRunAsyncValidator,
  flatAsyncValidationMap
} from "./../utils/formUtils";

const emptyStateValue = {};
const validatorsDefault = [];
const emptyFormStore = { getState: noop, update: noop, mountForm: noop };

export function useForm({
  initialState,
  touched,
  onChange = noop,
  onReset = noop,
  onInit = noop,
  onSubmit = noop,
  onValidation = noop,
  resetSyncErr = noop,
  validators: validatorsFuncs = validatorsDefault,
  resetAsyncErr = noop,
  asyncValidator,
  onAsyncValidation = noop,
  reducers,
  _getInitialStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  action,
  formStore = emptyFormStore
}) {
  const refInitialState = useRef(initialState);
  refInitialState.current = {
    ...initialState,
    ...(formStore.getState() || {})
  };

  const [formState, dispatch] = useState(() =>
    createForm(refInitialState.current, formStore)
  );

  const stateRef = useRef(formState);
  const memoStateRef = useRef(formState);

  const { current: isMultipleForm } = useRef(
    isUsingMultipleForm(_getInitialStateForm_, _onMultipleForm_, name)
  );

  const dispatchFormState = useCallback(({ state, status, ...rest }) => {
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
    formStore.update({ ...stateRef.current, mapFields: mapFields.current });
  }, []);

  const memoInitialState = useRef({ ...formState });
  const isMounted = useRef(false);
  const stillMounted = useCallback(() => isMounted.current, []);

  const [validators, addValidators, removeValidators] = useValidators(
    undefined,
    undefined,
    isMounted
  );

  const { validationMsg, validationObj, validationFN } =
    useValidationFunction(validatorsFuncs);

  const [validationFNAsync] = useValidationFunctionAsync(
    asyncValidator,
    onAsyncValidation
  );

  const [
    validatorsAsync,
    addValidatorsAsync,
    removeValidatorsAsync,
    validatorsMapsAsync,
    updateValidatorsMap,
    resetValidatorsMap
  ] = useValidators(undefined, undefined, isMounted, true);

  const applyReducers = useMemo(() => chainReducers(reducers), []);

  const { unRegisterField, mapFields, updateRegisteredField } = useMapFields();

  const changeProp = useCallback((nameProp, value, removeMe = false) => {
    const newState = updateState(stateRef.current.state, {
      value,
      nameProp,
      removeMe
    });
    propagateState(newState, false);
  }, []);

  const initProp = useCallback((nameProp, value, initialValue) => {
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
  }, []);

  const removeProp = useCallback(
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
    },
    []
  );

  const propagateState = useCallback(
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
    },
    []
  );

  const resetObj = useRef({});
  const registerReset = useCallback((nameProp, fnReset) => {
    resetObj.current = { ...resetObj.current, [nameProp]: fnReset };
  }, []);

  const unRegisterReset = useCallback(nameProp => {
    delete resetObj.current[nameProp];
  }, []);

  const reset = useCallback(() => {
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

    dispatchFormState({ ...memoInitialState.current, state, status, isValid });
  }, []);

  const onSubmitForm = useCallback(e => {
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
          if (typeof action === "string") {
            target.submit();
          } else {
            dispatchFormState({ ...stateRef.current, status, isValid: true });
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
  }, []);

  // used only to replace the entire Form State
  const dispatchNewState = useCallback(nextState => {
    let newState = nextState;
    if (typeof nextState === "function") {
      const { state: currentState } = stateRef.current;
      newState = nextState(currentState);
    }
    propagateState(newState, false);
  }, []);

  const isFormTouchedOnce = useRef(false);
  const lastStateSyncCheck = useRef(null);
  const triggerSyncValidation = useCallback(
    (omitArg1, omitArg2, touchedEventField = true) => {
      if (
        lastStateSyncCheck.current !== stateRef.current.state &&
        validationObj.current !== null &&
        (isFormTouchedOnce.current ||
          (touched && touchedEventField) ||
          !touched)
      ) {
        isFormTouchedOnce.current = true;
        lastStateSyncCheck.current = stateRef.current.state;
        const { isValid, checks } = validationObj.current;
        onValidation(checks, isValid);
      }
    },
    []
  );

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
          dispatchFormState({ ...stateRef.current, status, isValid });
        })
        .catch(() => {
          const status = STATUS.READY;
          const isValid = false;
          dispatchFormState({ ...stateRef.current, status, isValid });
        });
    }
  }, []);

  const runSyncValidation = useCallback(() => {
    const isValid = isFormValid(validators.current, stateRef.current.state);

    stateRef.current.isValid !== isValid &&
      dispatchFormState({ ...stateRef.current, isValid });
  }, []);

  const runAsyncValidation = useCallback(({ start, end }) => {
    if (start) {
      const status = STATUS.ON_RUN_ASYNC;
      dispatchFormState({ ...stateRef.current, isValid: false, status });
    } else if (end) {
      const status = STATUS.ON_ASYNC_END;
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
      onReset(state, isValid);
      dispatchFormState({ ...stateRef.current, status: STATUS.RESETTED });
    } else if (status === STATUS.ON_CHANGE) {
      onChange(state, isValid);
    } else if (status === STATUS.ON_INIT) {
      runInitialAsyncValidators();
      onInit(state, isValid);
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
    formStore.mountForm(isMounted.current);

    memoStateRef.current = stateRef.current;

    // Add its own validators
    if (validatorsFuncs.length > 0) {
      addValidators(FORM_VALIDATION_LABEL, validationFN.current);
    }

    // Add its own async validator func
    if (typeof asyncValidator === "function") {
      addValidatorsAsync(
        FORM_VALIDATION_LABEL,
        validationFNAsync.current,
        null
      );
    }

    const pristine =
      (isMultipleForm &&
        (_getInitialStateForm_(name) == undefined ||
          Object.keys(_getInitialStateForm_(name)).length === 0)) ||
      !isMultipleForm;

    const state = isMultipleForm
      ? _getInitialStateForm_(name) || stateRef.current.state
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

    mapFields.current[DISPATCHER_LABEL] = dispatchNewState;

    dispatchFormState(stateRef.current);

    return () => {
      isMounted.current = false;
      formStore.mountForm(isMounted.current);
      stateRef.current = memoStateRef.current;
    };
  }, []);

  useEffect(() => {
    const formStatus = formState.status;
    if (formStatus === STATUS.ON_RESET) {
      isFormTouchedOnce.current = false;
      lastStateSyncCheck.current = false;
      resetSyncErr();
      resetAsyncErr();
    } else if (
      formStatus !== STATUS.READY &&
      formStatus !== STATUS.ON_INIT_ASYNC
    ) {
      if (validationObj.current !== null) {
        triggerSyncValidation(false, true, false);
      }

      if (validationObj.current !== null && !validationObj.current.isValid) {
        resetAsyncErr();
      }
    }
  }, [validationMsg.current, formState.status]);

  return {
    ...formState, // { isValid, state, status, pristine, isSubmitting }
    formState: formState.state, // pass the global form state down
    formStatus: formState.status, // pass the global form status down
    mapFields: mapFields.current,
    triggerSyncValidation,
    unRegisterField,
    updateRegisteredField,
    registerAsyncInitValidation,
    runAsyncValidation,
    runSyncValidation,
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

function isUsingMultipleForm(_getInitialStateForm_, _onMultipleForm_, name) {
  return (
    typeof _getInitialStateForm_ === "function" &&
    typeof _onMultipleForm_ === "function" &&
    typeof name === "string"
  );
}
