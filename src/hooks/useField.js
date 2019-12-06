import { useEffect, useState, useRef } from "react";
import useOwnContext from "./useOwnContext";
import { useGetRefName } from "./useGetRefName";

import useValidationFunction from "./commons/useValidationFunction";
import useValidationFunctionAsync from "./commons/useValidationFunctionAsync";
import { STATUS, fileList } from "./../utils/formUtils";
import { chainReducers } from "./../utils/chainReducers";
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

  let {
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

  // const nameProp = useRef(name);
  // const { current: setNameProp } = useRef(index => {
  //   nameProp.current = index;
  // });

  const isMounted = useRef(false);
  const nameProp = useGetRefName(context, name);

  const valueField = useRef(initialValue);
  const checkedField = useRef(initialChecked);
  const initialCheckedFieldRef = useRef(initialChecked);
  const fileField = useRef("");

  const initialValueRef = useRef(initialValue);

  if (type === "checkbox" || type === "radio") {
    valueField.current =
      state[nameProp.current] !== undefined && !isMounted.current
        ? state[nameProp.current]
        : initialValue;
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
  } else if (type === "custom") {
    valueField.current = state[nameProp.current];
  } else {
    valueField.current =
      state[nameProp.current] !== undefined ? state[nameProp.current] : "";
  }

  const { current: applyReducers } = useRef(chainReducers(reducers));

  const { current: reset } = useRef(formState => {
    let val = initialValueRef.current;

    if (type === "number" || type === "range") {
      val =
        initialValueRef.current !== ""
          ? Number(initialValueRef.current)
          : initialValueRef.current;
    } else if (type === "checkbox" || type === "radio") {
      checkedField.current = initialCheckedFieldRef.current;
    }

    let value = applyReducers(val, valueField.current, formState);
    value = value === "" ? undefined : value;
    return value;
  });

  const onChange = event => {
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
        state[nameProp.current] !== undefined ? "" : target.value || true;
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
  };

  /* it runs once and set the inital `value` if passed
    and registers the validators functions if there is any
  */

  useEffect(() => {
    // if (context.type === "array" && nameProp.current === undefined) {
    //   nameProp.current = context.getIndex(setNameProp);
    // }

    isMounted.current = true;

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
      } else if (type === "number" || type === "range") {
        val = Number(val);
      }

      const newValue = applyReducers(val, initialValue, formState.current);
      context.initProp(nameProp.current, newValue, val);
    }

    // TO-DO it must be improved
    // if initialValue has been set from <Form initialState={} />
    if (
      initialValue === "" &&
      valueField.current !== undefined &&
      valueField.current !== ""
    ) {
      initialValue = valueField.current;
      initialValueRef.current = valueField.current;
      initialCheckedFieldRef.current = checkedField.current;
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
  const [onSyncFocusState, setSyncOnFocus] = useState(() => false);
  const [onAsyncBlurState, setAyncOnBlur] = useState(() => false);

  useEffect(() => {
    if (context.formStatus === STATUS.ON_RESET) {
      setSyncOnBlur(false);
      setAyncOnBlur(false);
      setSyncOnFocus(false);
      resetSyncErr();
      resetAsyncErr();
    } else {
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
      const { type: omitType, fileValue, ...props } = allProps;
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
    return `The prop "value" -> "${value}" passed to "useField": ${name} of type: ${type} is not allowed. Input of type "file" does not support any default value.`;
  }

  if (
    type === "radio" &&
    (value === undefined ||
      (typeof value === "string" && value.replace(/ /g, "") === ""))
  ) {
    return `Input of type => ${type}, must have a valid prop "value".`;
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
