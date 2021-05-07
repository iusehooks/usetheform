import { useRef, useEffect, useCallback, useMemo } from "react";
import { useOwnContext } from "./useOwnContext";
import { useNameProp } from "./commons/useNameProp";
import { useMapFields } from "./useMapFields";
import { useValidators } from "./useValidators";
import { validateProps } from "./../utils/validateProps";
import { updateState } from "./../utils/updateState";
import { chainReducers } from "./../utils/chainReducers";
import { useValidationFunction } from "./commons/useValidationFunction";
import { useValidationFunctionAsync } from "./commons/useValidationFunctionAsync";
import { STATUS } from "./../utils/constants";
import { DISPATCHER_LABEL } from "./../utils/constants";
import { noop } from "./../utils/noop";

const initArray = [];
const initObject = {};
const validatorsDefault = [];

export function useObject(props) {
  const context = useOwnContext();

  const {
    name,
    index,
    type,
    value: initValue,
    reducers,
    validators: validatorsFuncs = validatorsDefault,
    onValidation = noop,
    resetSyncErr = noop,
    resetAsyncErr = noop,
    asyncValidator,
    onAsyncValidation = noop,
    touched = false
  } = props;

  const { nameProp, uniqueIDarrayContext, setNameProp } = useNameProp(
    context,
    name,
    index
  );

  if (process.env.NODE_ENV !== "production") {
    validateProps(
      "<Collection /> ",
      { ...props, index: nameProp.current },
      context.type
    );
  }

  const { unRegisterField, mapFields, updateRegisteredField } = useMapFields(
    nameProp,
    context,
    type
  );

  const applyReducers = useMemo(() => chainReducers(reducers), []);

  const isMounted = useRef(false);
  const stillMounted = useCallback(() => isMounted.current, []);

  const isArray = type && type === "array";
  const init = initValue || (isArray ? initArray : initObject);
  const state = useRef(init);
  const memoInitialState = useRef(init);
  const prevState = useRef(isArray ? initArray : initObject);
  const valueFieldLastSyncCheck = useRef(null);

  // getValue from parent context
  if (!isMounted.current) {
    state.current = initValue || context.state[nameProp.current] || init;
  } else {
    state.current =
      context.state[nameProp.current] || (isArray ? initArray : initObject);
  }

  const formState = useRef(null);
  formState.current = context.formState;

  const resetObj = useRef(isArray ? [] : {});
  const registerReset = useCallback((namePropExt, fnReset) => {
    resetObj.current = isArray
      ? [...resetObj.current]
      : { ...resetObj.current };

    if (isArray && typeof resetObj.current[namePropExt] !== "undefined") {
      resetObj.current.splice(Number(namePropExt), 0, fnReset);
    } else {
      resetObj.current[namePropExt] = fnReset;
    }
  }, []);

  const unRegisterReset = useCallback(namePropExt => {
    if (resetObj.current.constructor === Array) {
      resetObj.current.splice(namePropExt, 1);
    } else {
      delete resetObj.current[namePropExt];
    }
  }, []);

  const reset = useCallback(formState => {
    valueFieldLastSyncCheck.current = null;
    const initAcc = isArray ? [] : {};
    let obj = Object.keys(resetObj.current).reduce((acc, key) => {
      const value = resetObj.current[key](formState);
      if (value !== undefined) acc[key] = value;
      return acc;
    }, initAcc);
    let newValue = applyReducers(obj, memoInitialState.current, formState);
    newValue =
      newValue !== undefined && Object.keys(newValue).length > 0
        ? newValue
        : undefined;

    return newValue;
  }, []);

  const updateParentProps = useCallback(nextState => {
    const newState = applyReducers(nextState, state.current, formState.current);
    const removeProp = Object.keys(newState).length === 0;
    context.changeProp(nameProp.current, newState, removeProp);
  }, []);

  const changeProp = useCallback((namePropExt, value, removeMe) => {
    const nextState = updateState(state.current, {
      value,
      nameProp: namePropExt,
      removeMe
    });
    updateParentProps(nextState);
  }, []);

  const initProp = useCallback(
    (namePropExt, value, intialValue, add = true) => {
      const newState = updateState(state.current, {
        value,
        nameProp: namePropExt,
        add: isMounted.current && add
      });

      memoInitialState.current = updateState(memoInitialState.current, {
        value: intialValue,
        nameProp: namePropExt,
        add: isMounted.current && add
      });

      const reducedState = applyReducers(
        newState,
        state.current,
        formState.current
      );

      prevState.current = newState;

      if (isMounted.current) {
        context.initProp(
          nameProp.current,
          reducedState,
          memoInitialState.current,
          false
        );
      } else {
        state.current = reducedState;
      }
    },
    []
  );

  const { current: removeProp } = useRef(
    (
      namePropExt,
      { currentState, removeCurrent, initialState, removeInitial },
      willUnmount = false
    ) => {
      let newStateCurrent = updateState(state.current, {
        value: currentState,
        nameProp: namePropExt,
        removeMe: removeCurrent
      });

      let newStateInitial = updateState(memoInitialState.current, {
        value: initialState,
        nameProp: namePropExt,
        removeMe: removeInitial
      });

      if (willUnmount && isArray) {
        newStateCurrent = newStateCurrent.filter(
          (elm, index) => index !== namePropExt
        );
        newStateInitial = newStateInitial.filter(
          (elm, index) => index !== namePropExt
        );
      }

      const reducedState = applyReducers(
        newStateCurrent,
        state.current,
        formState.current
      );

      state.current = reducedState;
      memoInitialState.current = newStateInitial;

      const removeCurrentProp = Object.keys(state.current).length === 0;

      const removeInitialProp =
        Object.keys(memoInitialState.current).length === 0;

      context.removeProp(nameProp.current, {
        currentState: state.current,
        removeCurrent: removeCurrentProp,
        initialState: memoInitialState.current,
        removeInitial: removeInitialProp
      });
    }
  );

  const setValue = useCallback(resolveNextState => {
    const nextState =
      typeof resolveNextState === "function"
        ? resolveNextState(state.current)
        : resolveNextState;
    updateParentProps(nextState);
  }, []);

  const [validators, addValidators, removeValidators] = useValidators(
    context,
    nameProp,
    isMounted
  );

  const [
    validatorsAsync,
    addValidatorsAsync,
    removeValidatorsAsync,
    validatorsMapsAsync,
    updateValidatorsMap
  ] = useValidators(context, nameProp, isMounted, true);

  const { validationMsg, validationObj, validationFN } = useValidationFunction(
    validatorsFuncs
  );

  const [validationFNAsync] = useValidationFunctionAsync(
    asyncValidator,
    onAsyncValidation
  );

  const triggerSyncValidation = useCallback(
    (propagate = true, onSubmit = false) => {
      if (valueFieldLastSyncCheck.current !== state.current) {
        if (validationObj.current !== null && (touched || onSubmit)) {
          valueFieldLastSyncCheck.current = state.current;
          const { isValid, checks } = validationObj.current;
          onValidation(checks, isValid);
        }
        if (propagate) {
          context?.triggerSyncValidation?.();
        }
      }
    },
    []
  );

  useEffect(() => {
    if (context.formStatus === STATUS.ON_RESET) {
      resetSyncErr();
      resetAsyncErr();
    } else if (
      context.formStatus !== STATUS.READY &&
      context.formStatus !== STATUS.ON_INIT_ASYNC
    ) {
      if (
        validationObj.current !== null &&
        context.formStatus === STATUS.ON_SUBMIT
      ) {
        triggerSyncValidation(false, true);
      }

      if (validationObj.current !== null && !validationObj.current.isValid) {
        resetAsyncErr();
      }
    }
  }, [validationMsg.current, context.formStatus]);

  // used to register async validation Actions
  const asyncInitValidation = useRef({});
  const registerAsyncInitValidation = useCallback((nameProp, asyncFunc) => {
    asyncInitValidation.current[nameProp] = asyncFunc;
  }, []);

  useEffect(() => {
    isMounted.current = true;

    if (context.type === "array") {
      context.registerIndex(uniqueIDarrayContext, setNameProp);
    }

    // Add its own validators
    if (validatorsFuncs.length > 0) {
      context.addValidators(nameProp.current, validationFN.current);
    }

    if (typeof asyncValidator === "function") {
      context.addValidatorsAsync(
        nameProp.current,
        validationFNAsync.current,
        null
      );
    }

    mapFields.current[DISPATCHER_LABEL] = setValue;
    context.updateRegisteredField(nameProp.current, mapFields.current);

    // register to parent any initial async Validators to be run ON_INIT
    if (Object.keys(asyncInitValidation.current).length > 0) {
      context.registerAsyncInitValidation(
        nameProp.current,
        asyncInitValidation.current
      );
    }
    // --- Add its own validators --- //

    // Add its children validators
    if (Object.keys(validators.current).length > 0) {
      context.addValidators(nameProp.current, validators.current);
    }

    if (Object.keys(validatorsAsync.current).length > 0) {
      context.addValidatorsAsync(
        nameProp.current,
        validatorsAsync.current,
        validatorsMapsAsync.current
      );
    }
    // --- Add the its children validators --- //
    context.registerReset(nameProp.current, reset);

    const newState = applyReducers(
      state.current,
      prevState.current,
      formState.current
    );

    context.initProp(nameProp.current, newState, memoInitialState.current);

    return () => {
      resetSyncErr();
      resetAsyncErr();
      isMounted.current = false;
      if (context.stillMounted()) {
        context.unRegisterField(nameProp.current);

        // remove its own by validators
        if (typeof asyncValidator === "function") {
          context.removeValidatorsAsync(
            nameProp.current,
            validationFNAsync.current,
            false
          );
        }

        if (validatorsFuncs.length > 0) {
          context.removeValidators(nameProp.current, validationFN.current);
        }
        // ----- remove its own by validators ----- //

        // remove validators inerithed by children
        if (Object.keys(validators.current).length > 0) {
          context.removeValidators(nameProp.current, validators.current);
        }

        if (Object.keys(validatorsAsync.current).length > 0) {
          context.removeValidatorsAsync(
            nameProp.current,
            validatorsAsync.current,
            validatorsMapsAsync.current
          );
        }
        // ----- remove validators inerithed by children ----- //
        context.removeProp(
          nameProp.current,
          {
            removeCurrent: true,
            removeInitial: true
          },
          true
        );

        context.unRegisterReset(nameProp.current);
        if (context.type === "array") {
          context.removeIndex(uniqueIDarrayContext);
        }
      }
    };
  }, []);

  const childrenIndexes = useRef({});

  const getIndex = useCallback(idCpm => {
    if (childrenIndexes.current[idCpm] === undefined) {
      childrenIndexes.current[idCpm] = null;
    }
    return Object.keys(childrenIndexes.current).length - 1;
  }, []);

  const removeIndex = useCallback(idCpm => {
    delete childrenIndexes.current[idCpm];
    Object.keys(childrenIndexes.current).forEach((idField, index) =>
      childrenIndexes.current[idField](index)
    );
  }, []);

  const registerIndex = useCallback((idCpm, fn) => {
    childrenIndexes.current[idCpm] = fn;
  }, []);

  return {
    state: state.current, // pass the state of the current context down
    formState: context.formState, // pass the global form state down
    formStatus: context.formStatus, // pass the global form status down
    runAsyncValidation: context.runAsyncValidation,
    unRegisterField,
    updateRegisteredField,
    registerAsyncInitValidation,
    changeProp,
    initProp,
    removeProp,
    stillMounted,
    getIndex,
    removeIndex,
    registerIndex,
    type,
    addValidators,
    removeValidators,
    addValidatorsAsync,
    removeValidatorsAsync,
    updateValidatorsMap,
    registerReset,
    unRegisterReset,
    triggerSyncValidation
  };
}
