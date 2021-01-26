import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useOwnContext } from "./useOwnContext";
import { useNameProp } from "./commons/useNameProp";
import { useValidationFunction } from "./commons/useValidationFunction";
import { useValidationFunctionAsync } from "./commons/useValidationFunctionAsync";
import { fileList } from "./../utils/formUtils";
import { STATUS } from "./../utils/constants";
import { validateProps } from "./../utils/validateProps";
import { chainReducers } from "./../utils/chainReducers";
import { noop } from "./../utils/noop";

const validatorsDefault = [];
export function useField(props) {
  const context = useOwnContext();

  let {
    name,
    index,
    validators = validatorsDefault,
    asyncValidator,
    type,
    onFocus: customFocus = noop,
    onBlur: customBlur = noop,
    onChange: customChange = noop,
    onValidation = noop,
    resetSyncErr = noop,
    resetAsyncErr = noop,
    onAsyncValidation,
    value: initialValue = "",
    checked: initialChecked = false,
    touched = false,
    multiple = false,
    reducers
  } = props;

  const { nameProp, uniqueIDarrayContext, setNameProp } = useNameProp(
    context,
    name,
    index
  );

  if (process.env.NODE_ENV !== "production") {
    validateProps(
      "<Input />",
      { ...props, index: nameProp.current },
      context.type
    );
  }

  const { state } = context;

  const formState = useRef(null);
  formState.current = context.formState;

  const isMounted = useRef(false);

  const valueField = useRef(initialValue);
  const checkedField = useRef(initialChecked);
  const fileField = useRef("");
  const valueFieldLastAsyncCheck = useRef(null);
  const valueFieldLastSyncCheck = useRef(null);

  const [initialValueRef, initialCheckedRef] = getInitialValue(
    type,
    state,
    nameProp,
    initialValue,
    initialChecked,
    isMounted,
    context
  );

  if (!isMounted.current && initialValueRef.current) {
    valueField.current = initialValueRef.current;
  } else {
    if (type === "checkbox" || type === "radio") {
      valueField.current = initialValueRef.current;
      checkedField.current =
        type === "checkbox"
          ? state[nameProp.current] !== undefined ||
            (!isMounted.current && initialChecked === true)
          : state[nameProp.current] === initialValueRef.current;
    } else if (type === "select") {
      valueField.current =
        state[nameProp.current] !== undefined
          ? state[nameProp.current]
          : !multiple
          ? ""
          : [];
    } else if (type === "file") {
      valueField.current = state[nameProp.current];
      fileField.current =
        state[nameProp.current] !== undefined ? fileField.current : "";
    } else if (type === "custom") {
      valueField.current = state[nameProp.current];
    } else {
      valueField.current =
        state[nameProp.current] !== undefined ? state[nameProp.current] : "";
    }
  }

  const applyReducers = useMemo(() => chainReducers(reducers), []);

  const reset = useCallback(formState => {
    valueFieldLastAsyncCheck.current = null;
    valueFieldLastSyncCheck.current = null;

    switch (type) {
      case "number":
      case "range": {
        let val =
          initialValueRef.current !== ""
            ? Number(initialValueRef.current)
            : initialValueRef.current;
        const value = applyReducers(val, valueField.current, formState);
        return value === "" ? undefined : value;
      }
      case "radio":
      case "checkbox": {
        checkedField.current = initialCheckedRef.current;
        let val = initialValueRef.current;
        const value = applyReducers(val, valueField.current, formState);
        return initialCheckedRef.current === false ? undefined : value;
      }
      default: {
        let val = initialValueRef.current;
        const value = applyReducers(val, valueField.current, formState);
        return value === "" ? undefined : value;
      }
    }
  }, []);

  const updateValue = useCallback((nextValue, event) => {
    const newValue = applyReducers(
      nextValue,
      valueField.current,
      formState.current
    );

    customChange(newValue, event);
    context.changeProp(nameProp.current, newValue, false);
  }, []);

  const onChange = useCallback(event => {
    if (typeof event.persist === "function") {
      event.persist();
    }
    const { target } = event;
    let nextValue;
    if (type === "select" && multiple) {
      const options = target.options;
      nextValue = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          nextValue.push(options[i].value);
        }
      }
    } else if (type === "file") {
      nextValue = multiple ? fileList(target.files) : target.files[0];
      fileField.current = target.value;
    } else if (type === "checkbox") {
      nextValue =
        checkedField.current === true
          ? ""
          : initialValueRef.current || target.value || true;
    } else if (type === "radio") {
      nextValue = initialValueRef.current || target.value || true;
    } else if (type === "number" || type === "range") {
      nextValue = target.value !== "" ? Number(target.value) : target.value;
    } else {
      nextValue = target.value;
    }
    updateValue(nextValue, event);
  }, []);

  const setValue = useCallback(resolveNextState => {
    const nextValue =
      typeof resolveNextState === "function"
        ? resolveNextState(valueField.current)
        : resolveNextState;
    updateValue(nextValue);
  }, []);

  /* it runs once and set the inital `value` if passed
    and registers the validators functions if there is any
  */
  useEffect(() => {
    isMounted.current = true;

    if (context.type === "array") {
      context.registerIndex(uniqueIDarrayContext, setNameProp);
    }

    if (validators.length > 0) {
      context.addValidators(nameProp.current, validationFN.current);
    }

    // register field for the useSelector
    context.updateRegisteredField(nameProp.current, setValue);

    // Adding asyncValidator function and mapping its value as false
    if (typeof asyncValidator === "function") {
      context.addValidatorsAsync(
        nameProp.current,
        validationFNAsync.current,
        false
      );
      if (initialValue !== "" || initialValueRef.current !== "") {
        context.registerAsyncInitValidation(nameProp.current, () => {
          valueFieldLastAsyncCheck.current = initialValueRef.current;
          return validationFNAsync
            .current(initialValueRef.current)
            .then(() => {
              context.updateValidatorsMap(nameProp.current, true, 1);
            })
            .catch(err => {
              if (err !== "cancelled") {
                context.updateValidatorsMap(nameProp.current, false, 1);
              }
              throw err;
            });
        });
      }
    }

    if (type === "radio" && initialCheckedRef.current === true) {
      context.registerReset(nameProp.current, reset);
    }

    if (type !== "radio") {
      context.registerReset(nameProp.current, reset);
    }

    /* if a initialValue or initialChecked is passed as prop */
    if (
      (type !== "checkbox" && type !== "radio" && initialValue !== "") ||
      ((type === "checkbox" || type === "radio") && initialChecked)
    ) {
      // a checkbox might have a value otherwise its value will be true
      let val = initialValue;
      if (type === "checkbox") {
        val = initialValue || true;
      } else if (type === "number" || type === "range") {
        val = Number(val);
      }

      const newValue = applyReducers(val, initialValue, formState.current);
      context.initProp(nameProp.current, newValue, val);
    }

    return () => {
      resetSyncErr();
      resetAsyncErr();
      if (context.stillMounted()) {
        context.unRegisterField(nameProp.current);

        if (typeof asyncValidator === "function") {
          context.removeValidatorsAsync(
            nameProp.current,
            validationFNAsync.current
          );
        }
        if (validators.length > 0) {
          context.removeValidators(nameProp.current, validationFN.current);
        }
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

  const { validationMsg, validationObj, validationFN } = useValidationFunction(
    validators
  );

  const [validationFNAsync] = useValidationFunctionAsync(
    asyncValidator,
    onAsyncValidation
  );

  const [onSyncBlurState, setSyncOnBlur] = useState(() => false);
  const [onSyncFocusState, setSyncOnFocus] = useState(() => false);
  const [onAsyncBlurState, setAsyncOnBlur] = useState(() => false);

  useEffect(() => {
    if (context.formStatus === STATUS.ON_RESET) {
      setSyncOnBlur(false);
      setAsyncOnBlur(false);
      setSyncOnFocus(false);
      resetSyncErr();
      resetAsyncErr();
    } else if (
      context.formStatus !== STATUS.READY &&
      context.formStatus !== STATUS.ON_INIT_ASYNC
    ) {
      const firstTimeCheck = valueFieldLastSyncCheck.current === null;
      const onlyShowOnSubmit = type === "radio" || type === "checkbox";
      const isCustomCmp = type === "custom";
      const forceOnBlur = type === "select" && multiple;

      if (
        valueFieldLastSyncCheck.current !== valueField.current &&
        validationObj.current !== null &&
        ((!onlyShowOnSubmit && initialValue !== "") ||
          (isCustomCmp && touched && onSyncBlurState) ||
          context.formStatus === STATUS.ON_SUBMIT ||
          (!onlyShowOnSubmit &&
            ((touched && onSyncBlurState) ||
              (!touched &&
                forceOnBlur &&
                (onSyncBlurState || firstTimeCheck)) ||
              (!touched && !forceOnBlur))) ||
          (onlyShowOnSubmit && onSyncFocusState))
      ) {
        valueFieldLastSyncCheck.current = valueField.current;

        onValidation(
          validationObj.current.checks,
          validationObj.current.isValid
        );
      }

      if (onSyncBlurState) {
        context?.triggerSyncValidation?.();
      }

      if (
        ((validationObj.current !== null && validationObj.current.isValid) ||
          validators.length === 0) &&
        onAsyncBlurState &&
        context.formStatus !== STATUS.ON_SUBMIT &&
        context.formStatus !== STATUS.ON_INIT_ASYNC &&
        typeof asyncValidator === "function"
      ) {
        if (valueFieldLastAsyncCheck.current !== valueField.current) {
          valueFieldLastAsyncCheck.current = valueField.current;
          context.runAsyncValidation({ start: true });
          validationFNAsync
            .current(valueField.current)
            .then(() => {
              context.updateValidatorsMap(nameProp.current, true, 1);
              context.runAsyncValidation({ end: true });
            })
            .catch(err => {
              if (err !== "cancelled") {
                context.updateValidatorsMap(nameProp.current, false, 1);
                context.runAsyncValidation({ end: true });
              }
            });
        }
      }
    }
  }, [
    validationMsg.current,
    onSyncBlurState,
    onAsyncBlurState,
    onSyncFocusState,
    context.formStatus
  ]);

  const onBlur = useCallback(e => {
    e.persist();
    setAsyncOnBlur(true);
    setSyncOnBlur(true);
    customBlur(e);
  }, []);

  const onFocus = useCallback(e => {
    e.persist();
    setSyncOnBlur(false);
    setAsyncOnBlur(false);
    setSyncOnFocus(true);
    customFocus(e);
  }, []);

  const attributes = filterProps({
    onChange,
    onBlur,
    onFocus,
    checked: checkedField.current,
    value: valueField.current,
    fileValue: fileField.current,
    type,
    name,
    multiple,
    setValue
  });

  return attributes;
}

function filterProps(allProps) {
  switch (allProps.type) {
    case "file": {
      const {
        value: omitVal,
        setValue: omitSetVal,
        fileValue,
        ...props
      } = allProps;
      return { ...props, value: fileValue };
    }
    case "select": {
      const {
        type: omitType,
        setValue: omitSetVal,
        fileValue: omitFileVal,
        ...props
      } = allProps;
      return props;
    }
    case "custom": {
      const { fileValue: omitfileVal, ...props } = allProps;
      return props;
    }
    default:
      const {
        fileValue: omitFileVal,
        setValue: omitSetVal,
        ...props
      } = allProps;
      return props;
  }
}

function getInitialValue(
  type,
  state,
  nameProp,
  initialValue,
  initialChecked,
  isMounted,
  context
) {
  let initValueRef = initialValue;
  let initCheckRef = initialChecked;

  if (
    state[nameProp.current] !== undefined &&
    !isMounted.current &&
    !context.stillMounted()
  ) {
    if (type !== "radio" && initValueRef === "") {
      initValueRef = state[nameProp.current];
    }
    if (
      initialChecked === false &&
      (type === "checkbox" ||
        (type === "radio" && state[nameProp.current] === initialValue))
    ) {
      initCheckRef = true;
    }
  }

  const initialValueRef = useRef(initValueRef);
  const initialCheckedRef = useRef(initCheckRef);

  return [initialValueRef, initialCheckedRef];
}
