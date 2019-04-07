import { useEffect, useState, useRef } from "react";
import useOwnContext from "./useOwnContext";
import { STATUS, fileList } from "./../utils/formUtils";
import useValidationFunction from "./commons/useValidationFunction";
import useValidationFunctionAsync from "./commons/useValidationFunctionAsync";
import chainReducers from "./../utils/chainReducers";
import isValidValue from "./../utils/isValidValue";

const noop = () => undefined;

export default function useField(props) {
  const context = useOwnContext();

  if (process.env.NODE_ENV !== "production") {
    const errMsg = validateProps(props, context.type);
    if (errMsg) {
      throw new Error(errMsg);
    }
  }

  const {
    name,
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

  const { state } = context;

  const formState = useRef(null);
  formState.current = context.formState;

  const nameProp = useRef(name);
  const { current: setNameProp } = useRef(index => {
    nameProp.current = index;
  });

  const valueField = useRef(initialValue);
  const checkedField = useRef(initialChecked);
  const fileField = useRef("");

  const { current: applyReducers } = useRef(chainReducers(reducers));

  const { current: reset } = useRef(formState => {
    const val = type === "number" ? Number(initialValue) : initialValue;
    let value = applyReducers(val, val, formState);
    value = value === "" ? undefined : value;
    return value;
  });

  if (type === "checkbox" || type === "radio") {
    valueField.current = initialValue;
    checkedField.current =
      type === "checkbox"
        ? state[nameProp.current] !== undefined
        : state[nameProp.current] === initialValue;
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
  } else {
    valueField.current =
      state[nameProp.current] !== undefined ? state[nameProp.current] : "";
  }

  const onChange = event => {
    event.persist();
    customChange(event);
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
        state[nameProp.current] !== undefined ? "" : target.value || true;
    } else {
      nextValue = type === "number" ? Number(target.value) : target.value;
    }
    const newValue = applyReducers(
      nextValue,
      valueField.current,
      formState.current
    );
    context.changeProp(nameProp.current, newValue, false);
  };

  /* it runs once and set the inital `value` if passed
    and registers the validators functions if there is any
  */
  useEffect(() => {
    if (context.type === "array" && nameProp.current === undefined) {
      nameProp.current = context.getIndex(setNameProp);
    }

    if (type !== "checkbox" && type !== "radio" && validators.length > 0) {
      context.addValidators(nameProp.current, validationFN.current);
    }

    // Adding asyncValidator function and mapping its value as false
    if (typeof asyncValidator === "function") {
      context.addValidatorsAsync(
        nameProp.current,
        validationFNAsync.current,
        false
      );
    }

    context.registerReset(nameProp.current, reset);

    if (
      (type !== "checkbox" && type !== "radio" && initialValue !== "") ||
      ((type === "checkbox" || type === "radio") && initialChecked)
    ) {
      // a checkbox might have a value otherwise its value will be true
      let val = initialValue;
      if (type === "checkbox") {
        val = type === "checkbox" ? initialValue || true : initialValue;
      } else if (type === "number") {
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
          context.removeIndex(nameProp.current);
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
  const [onAsyncBlurState, setAyncOnBlur] = useState(() => false);

  useEffect(() => {
    if (context.formStatus === STATUS.ON_RESET) {
      setSyncOnBlur(false);
      setAyncOnBlur(false);
      resetSyncErr();
      resetAsyncErr();
    } else {
      if (
        validationObj.current !== null &&
        (initialValue !== "" ||
          context.formStatus === STATUS.ON_SUBMIT ||
          ((touched && onSyncBlurState) || !touched))
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
        typeof asyncValidator === "function"
      ) {
        validationFNAsync
          .current(valueField.current)
          .then(val => val)
          .catch(err => err);
      }
    }
  }, [
    validationMsg.current,
    onSyncBlurState,
    onAsyncBlurState,
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
    case "checkbox":
    case "radio": {
      const { multiple, fileValue, ...props } = allProps;
      return props;
    }
    case "file": {
      const { checked, value, fileValue, ...props } = allProps;
      return { ...props, value: fileValue };
    }
    case "select": {
      const { type, fileValue, checked, ...props } = allProps;
      return props;
    }
    case "password":
    case "number":
    case "text": {
      const { multiple, fileValue, checked, ...props } = allProps;
      return props;
    }
    default:
      const { fileValue, ...props } = allProps;
      return props;
  }
}

function validateProps(
  { name, value, checked, type, asyncValidator },
  contextType
) {
  if (type === undefined) {
    return `The prop "type" -> "${type}"" passed to "useField" is not allowed. It must be a string.`;
  }

  if (type === "file" && value && value !== "") {
    return `The prop "value" -> "${value}" passed to "useField": ${name} of type: ${type} is not allowed. Input of type "file" does not support any default value`;
  }

  if (
    typeof asyncValidator !== "undefined" &&
    typeof asyncValidator !== "function"
  ) {
    return `The prop "asyncValidator" -> "${asyncValidator}" passed to "useField": ${name} of type: ${type} is not allowed. It must be a funcgtion`;
  }

  if (type !== "checkbox" && type !== "radio" && checked) {
    return `The prop "checked" -> "${checked}" passed to "useField": ${name} of type: ${type} is not allowed. You can use "value" prop instead to set an initial value`;
  }

  if (!isValidValue(name, contextType)) {
    return `The prop "name": ${name} of type "${typeof name}" passed to "${type}" it is not allowed within context a of type "${contextType}".`;
  }
}
