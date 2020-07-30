import { useEffect, useState, useRef, useCallback } from "react";
import { useOwnContext } from "./useOwnContext";
import { useNameProp } from "./commons/useNameProp";
import { useValidationFunction } from "./commons/useValidationFunction";
import { useValidationFunctionAsync } from "./commons/useValidationFunctionAsync";
import { STATUS, fileList } from "./../utils/formUtils";
import { chainReducers } from "./../utils/chainReducers";
import { isValidValue } from "./../utils/isValidValue";
import { isValidIndex } from "./../utils/isValidIndex";

const noop = () => undefined;

export function useField(props) {
  const context = useOwnContext();

  let {
    name,
    index,
    validators = [],
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
    reducers = []
  } = props;

  const { nameProp, uniqueIDarrayContext, setNameProp } = useNameProp(
    context,
    name,
    index
  );

  if (process.env.NODE_ENV !== "production") {
    const errMsg = validateProps(
      { ...props, index: nameProp.current },
      context.type
    );
    if (errMsg) {
      throw new Error(errMsg);
    }
  }

  const { state } = context;

  const formState = useRef(null);
  formState.current = context.formState;

  const isMounted = useRef(false);

  const valueField = useRef(initialValue);
  const checkedField = useRef(initialChecked);
  const fileField = useRef("");
  const valueFieldLastAsyncCheck = useRef(null);

  const [initialValueRef, initialCheckedRef] = getInitialValue(
    type,
    state,
    nameProp,
    initialValue,
    initialChecked,
    isMounted,
    context
  );

  if (type === "checkbox" || type === "radio") {
    valueField.current = initialValueRef.current;
    checkedField.current =
      type === "checkbox"
        ? state[nameProp.current] !== undefined
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

  const { current: applyReducers } = useRef(chainReducers(reducers));

  const { current: reset } = useRef(formState => {
    valueFieldLastAsyncCheck.current = null;
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
  });

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
    } else {
      nextValue =
        type === "number" || type === "range"
          ? Number(target.value)
          : target.value;
    }

    const newValue = applyReducers(
      nextValue,
      valueField.current,
      formState.current
    );

    customChange(newValue, event);
    context.changeProp(nameProp.current, newValue, false);
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
        val = type === "checkbox" ? initialValue || true : initialValue;
      } else if (type === "number" || type === "range") {
        val = Number(val);
      }

      const newValue = applyReducers(val, initialValue, formState.current);
      context.initProp(nameProp.current, newValue, val);
    }

    return () => {
      if (context.stillMounted()) {
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
  const [onAsyncBlurState, setAyncOnBlur] = useState(() => false);

  useEffect(() => {
    if (context.formStatus === STATUS.ON_RESET) {
      setSyncOnBlur(false);
      setAyncOnBlur(false);
      setSyncOnFocus(false);
      resetSyncErr();
      resetAsyncErr();
    } else if (
      context.formStatus !== STATUS.READY &&
      context.formStatus !== STATUS.ON_INIT_ASYNC
    ) {
      const onlyShowOnSubmit = type === "radio" || type === "checkbox";
      const isCustomCmp = type === "custom";
      if (
        validationObj.current !== null &&
        ((!onlyShowOnSubmit && initialValue !== "") ||
          (isCustomCmp && touched && onSyncBlurState) ||
          context.formStatus === STATUS.ON_SUBMIT ||
          (!onlyShowOnSubmit && ((touched && onSyncBlurState) || !touched)) ||
          (onlyShowOnSubmit && onSyncFocusState))
      ) {
        onValidation(
          validationObj.current.checks,
          validationObj.current.isValid
        );
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
              context.runAsyncValidation({ end: true, value: true });
            })
            .catch(err => {
              if (err !== "cancelled") {
                context.updateValidatorsMap(nameProp.current, false, 1);
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

  const { current: onBlur } = useRef(e => {
    e.persist();
    setAyncOnBlur(true);
    setSyncOnBlur(true);
    customBlur(e);
  });

  const { current: onFocus } = useRef(e => {
    e.persist();
    setAyncOnBlur(false);
    setSyncOnFocus(true);
    customFocus(e);
  });

  const attributes = filterProps({
    onChange,
    onBlur,
    onFocus,
    checked: checkedField.current,
    value: valueField.current,
    fileValue: fileField.current,
    type,
    name,
    multiple
  });

  return attributes;
}

function filterProps(allProps) {
  switch (allProps.type) {
    case "file": {
      const { value: omitValue, fileValue, ...props } = allProps;
      return { ...props, value: fileValue };
    }
    case "select": {
      const { type: omitType, fileValue: omitfileValue, ...props } = allProps;
      return props;
    }
    default:
      const { fileValue: omitfileValue, ...props } = allProps;
      return props;
  }
}

function validateProps(
  { name, index, value, checked, type, asyncValidator },
  contextType
) {
  if (type === undefined) {
    return `The prop "type" -> "${type}"" passed to "useField" is not allowed. It must be a string.`;
  }

  if (type === "file" && value && value !== "") {
    return `The prop "value" -> "${value}" passed to "useField": ${name} of type: ${type} is not allowed. Input of type "file" does not support any default value.`;
  }

  if (
    type === "radio" &&
    (value === undefined ||
      (typeof value === "string" && value.replace(/ /g, "") === ""))
  ) {
    return `Input of type => ${type}, must have a valid prop "value".`;
  }

  if (contextType === "array" && !isValidIndex(index)) {
    return `The prop "index": ${index} of type "${typeof index}" passed to a field "${type}" must be either a string or number represent as integers.`;
  }

  if (
    typeof asyncValidator !== "undefined" &&
    typeof asyncValidator !== "function"
  ) {
    return `The prop "asyncValidator" -> "${asyncValidator}" passed to "useField": ${name} of type: ${type} is not allowed. It must be a function.`;
  }

  if (type !== "checkbox" && type !== "radio" && checked) {
    return `The prop "checked" -> "${checked}" passed to "useField": ${name} of type: ${type} is not allowed. You can use "value" prop instead to set an initial value.`;
  }

  if (!isValidValue(name, contextType)) {
    const nameContext = contextType || "<Form />";
    return `The prop "name": ${name} of type "${typeof name}" passed to "${type}" it is not allowed within context a of type "${nameContext}".`;
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
