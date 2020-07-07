import { useRef, useEffect, useCallback } from "react";
import { useOwnContext } from "./useOwnContext";
import { useValidators } from "./useValidators";
import { isValidValue } from "./../utils/isValidValue";
import { updateState } from "./../utils/updateState";
import { chainReducers } from "./../utils/chainReducers";
import { useValidationFunction } from "./commons/useValidationFunction";
import { useValidationFunctionAsync } from "./commons/useValidationFunctionAsync";
import { STATUS } from "./../utils/formUtils";

const noop = _ => undefined;
const initArray = [];
const initObject = {};

export function useObject(props) {
  const context = useOwnContext();

  if (process.env.NODE_ENV !== "production") {
    const errMsg = validateProps(props, context.type);
    if (errMsg) {
      throw new Error(errMsg);
    }
  }

  const {
    name,
    index,
    type,
    value: initValue,
    reducers = [],
    validators: validatorsFuncs = [],
    onValidation = noop,
    resetSyncErr = noop,
    resetAsyncErr = noop,
    asyncValidator,
    onAsyncValidation = noop
  } = props;
  const nameProp = useRef(name || index);
  nameProp.current = name || index;

  const { current: applyReducers } = useRef(chainReducers(reducers));

  const isMounted = useRef(false);
  const { current: stillMounted } = useRef(() => isMounted.current);

  const init = initValue || (type && type === "array" ? initArray : initObject);
  const state = useRef(init);
  const memoInitialState = useRef(init);
  const prevState = useRef(type && type === "array" ? initArray : initObject);

  // getValue from parent context
  if (!isMounted.current) {
    state.current =
      context.state[nameProp.current] !== undefined
        ? context.state[nameProp.current]
        : init;
  } else {
    state.current =
      context.state[nameProp.current] ||
      (type === "array" ? initArray : initObject);
  }

  const formState = useRef(null);
  formState.current = context.formState;

  const resetObj = useRef(type === "array" ? [] : {});
  const { current: registerReset } = useRef((namePropExt, fnReset) => {
    const isArray = type === "array";

    resetObj.current = isArray
      ? [...resetObj.current]
      : { ...resetObj.current };

    if (isArray && typeof resetObj.current[namePropExt] !== "undefined") {
      resetObj.current.splice(Number(namePropExt), 0, fnReset);
    } else {
      resetObj.current[namePropExt] = fnReset;
    }
  });

  const { current: unRegisterReset } = useRef(namePropExt => {
    if (resetObj.current.constructor === Array) {
      resetObj.current.splice(namePropExt, 1);
    } else {
      delete resetObj.current[namePropExt];
    }
  });

  const { current: reset } = useRef(formState => {
    const initAcc = type === "array" ? [] : {};
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
  });

  const { current: changeProp } = useRef((namePropExt, value, removeMe) => {
    const nexState = updateState(state.current, {
      value,
      nameProp: namePropExt,
      removeMe
    });

    const newState = applyReducers(nexState, state.current, formState.current);

    const removeProp = Object.keys(newState).length === 0;

    context.changeProp(nameProp.current, newState, removeProp);
  });

  const { current: initProp } = useRef(
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
    }
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

      if (willUnmount && type === "array") {
        newStateCurrent = newStateCurrent.filter(
          (elm, index) => index !== namePropExt
        );
        newStateInitial = newStateInitial.filter(
          (elm, index) => index !== namePropExt
        );
      }

      state.current = newStateCurrent;
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
        const { isValid, checks } = validationObj.current;
        onValidation(checks, isValid);
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

    // Add the its own validators
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
      isMounted.current = false;
      if (context.stillMounted()) {
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
      }
    };
  }, []);

  return {
    state: state.current, // pass the state of the current context down
    formState: context.formState, // pass the global form state down
    formStatus: context.formStatus, // pass the global form status down
    runAsyncValidation: context.runAsyncValidation,
    registerAsyncInitValidation,
    changeProp,
    initProp,
    removeProp,
    stillMounted,
    type,
    addValidators,
    removeValidators,
    addValidatorsAsync,
    removeValidatorsAsync,
    updateValidatorsMap,
    registerReset,
    unRegisterReset
  };
}

function validateProps({ name, type, value, asyncValidator }, contextType) {
  if (
    typeof asyncValidator !== "undefined" &&
    typeof asyncValidator !== "function"
  ) {
    return `The prop "asyncValidator" -> "${asyncValidator}" passed to "useField": ${name} of type: ${type} is not allowed. It must be a funcgtion`;
  }

  if (
    typeof value !== "undefined" &&
    ((type === "array" && value.constructor !== Array) ||
      (type === "object" && typeof value !== "object"))
  ) {
    return `The prop "value": ${value} of type "${type}" passed to "${name} Collection" it is not allowed as initial value.`;
  }

  if (!isValidValue(name, contextType)) {
    return `The prop "name": ${name} of type "${typeof name}" passed to "${name} Collection" it is not allowed within context a of type "${contextType}".`;
  }
}
