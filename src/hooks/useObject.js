import { useRef, useEffect } from "react";
import useOwnContext from "./useOwnContext";
import useValidators from "./useValidators";
import isValidValue from "./../utils/isValidValue";
import updateState from "./../utils/updateState";
import { chainReducers } from "./../utils/chainReducers";
import useValidationFunction from "./commons/useValidationFunction";
import useValidationFunctionAsync from "./commons/useValidationFunctionAsync";
import { STATUS } from "./../utils/formUtils";

const noop = _ => undefined;

export default function useObject(props) {
  const context = useOwnContext();

  if (process.env.NODE_ENV !== "production") {
    const errMsg = validateProps(props, context.type);
    if (errMsg) {
      throw new Error(errMsg);
    }
  }

  const {
    name,
    type,
    reducers = [],
    validators: validatorsFuncs = [],
    onValidation = noop,
    resetSyncErr = noop,
    resetAsyncErr = noop,
    asyncValidator,
    onAsyncValidation = noop
  } = props;
  const nameProp = useRef(name);

  const { current: applyReducers } = useRef(chainReducers(reducers));

  const isMounted = useRef(false);
  const { current: stillMounted } = useRef(() => isMounted.current);

  // if it is an array collection it keeps the children and update their indexes
  const children = useRef([]);
  const { current: setNameProp } = useRef(index => {
    nameProp.current = index;
  });
  const { current: getIndex } = useRef(childFn => {
    if (children.current.indexOf(childFn) === -1) {
      children.current.push(childFn);
    }
    return children.current.length - 1;
  });

  const { current: removeIndex } = useRef(targeIndex => {
    children.current.splice(targeIndex, 1);
    // update children index
    children.current.forEach((fnChild, index) => fnChild(index));
  });

  const init = type && type === "array" ? [] : {};
  const state = useRef(init);
  const memoInitialState = useRef(init);

  const resetObj = useRef(init);
  const { current: registerReset } = useRef((namePropExt, fnReset) => {
    resetObj.current =
      resetObj.current.constructor === Array
        ? [...resetObj.current]
        : { ...resetObj.current };
    resetObj.current[namePropExt] = fnReset;
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

  state.current =
    context.state[nameProp.current] !== undefined
      ? context.state[nameProp.current]
      : init;

  const formState = useRef(null);
  formState.current = context.formState;

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

  const { current: initProp } = useRef((namePropExt, value, intialValue) => {
    const newState = updateState(state.current, {
      value,
      nameProp: namePropExt
    });
    if (isMounted.current) {
      memoInitialState.current = updateState(memoInitialState.current, {
        value: intialValue,
        nameProp: namePropExt
      });

      const reducedState = applyReducers(
        newState,
        state.current,
        formState.current
      );
      context.initProp(
        nameProp.current,
        reducedState,
        memoInitialState.current
      );
    } else {
      const newInitialState = updateState(memoInitialState.current, {
        value: intialValue,
        nameProp: namePropExt
      });

      memoInitialState.current = newInitialState;
      state.current = newState;
    }
  });

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
    validatorsMapsAsync
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
    } else {
      if (
        validationObj.current !== null &&
        context.formStatus === STATUS.ON_SUBMIT
      ) {
        const { isValid, checks } = validationObj.current;
        onValidation(checks, isValid);
      }

      if (
        ((validationObj.current !== null && validationObj.current.isValid) ||
          validatorsFuncs.length === 0) &&
        context.formStatus === STATUS.ON_SUBMIT &&
        typeof asyncValidator === "function"
      ) {
        validationFNAsync
          .current(state.current)
          .then(val => val)
          .catch(err => err);
      } else if (
        validationObj.current !== null &&
        !validationObj.current.isValid
      ) {
        resetAsyncErr();
      }
    }
  }, [validationMsg.current, context.formStatus]);

  useEffect(() => {
    isMounted.current = true;

    // if I am children of a context of type "array" I must get my index
    if (context.type === "array" && nameProp.current === undefined) {
      nameProp.current = context.getIndex(setNameProp);
    }

    // Add the its own validators
    if (validatorsFuncs.length > 0) {
      context.addValidators(nameProp.current, validationFN.current);
    }

    if (typeof asyncValidator === "function") {
      context.addValidatorsAsync(
        nameProp.current,
        validationFNAsync.current,
        false
      );
    }
    // --- Add the its own validators --- //

    // Add the its children validators
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
      state.current,
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
        if (context.type === "array") {
          context.removeIndex(nameProp.current);
        }
      }
    };
  }, []);

  return {
    state: state.current, // pass the state of the current context down
    formState: context.formState, // pass the global form state down
    formStatus: context.formStatus, // pass the global form status down
    changeProp,
    initProp,
    removeProp,
    stillMounted,
    type,
    getIndex,
    removeIndex,
    addValidators,
    removeValidators,
    addValidatorsAsync,
    removeValidatorsAsync,
    registerReset,
    unRegisterReset
  };
}

function validateProps({ name, type, asyncValidator }, contextType) {
  if (
    typeof asyncValidator !== "undefined" &&
    typeof asyncValidator !== "function"
  ) {
    return `The prop "asyncValidator" -> "${asyncValidator}" passed to "useField": ${name} of type: ${type} is not allowed. It must be a funcgtion`;
  }

  if (!isValidValue(name, contextType)) {
    return `The prop "name": ${name} of type "${typeof name}" passed to "${type}" it is not allowed within context a of type "${contextType}".`;
  }
}
