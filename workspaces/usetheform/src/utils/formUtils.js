import { STATUS, FORM_VALIDATION_LABEL } from "./constants";

export const createForm = (state = {}) => ({
  state,
  isValid: true,
  status: STATUS.READY,
  pristine: true,
  isSubmitting: false,
  submitAttempts: 0,
  submitted: 0
});

export const getValueByPath = (path, obj, separator = "/") => {
  if (path === FORM_VALIDATION_LABEL) {
    return obj;
  }
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
};

export const isFormValid = (validators, state) =>
  Object.keys(validators).reduce((acc, key) => {
    const value = getValueByPath(key, state);
    return validators[key](value, state) && acc;
  }, true);

export const isFormValidAsync = validatorsAsync =>
  Object.keys(validatorsAsync)
    .filter(key => validatorsAsync[key].type === "field")
    .every(key => {
      const { counter, isValid } = validatorsAsync[key];
      return counter === 1 && isValid;
    });

export const generateAsynFuncs = (
  validators,
  validatorsMaps,
  state,
  updateValidatorsMap
) =>
  Object.keys(validators)
    .filter(key => {
      const { type, isValid, counter } = validatorsMaps[key];
      return (
        (counter === 0 && !isValid && type === "field") || type === "collection"
      );
    })
    .map(key => {
      const value = getValueByPath(key, state);
      return validators[key](value, state)
        .then(value => {
          updateValidatorsMap(key, true, 1);
          return value;
        })
        .catch(err => {
          updateValidatorsMap(key, false, 1);
          throw err;
        });
    });

export const shouldRunAsyncValidator = validatorsMaps =>
  Object.keys(validatorsMaps)
    .filter(key => validatorsMaps[key].type === "field")
    .every(key => {
      const { isValid, counter } = validatorsMaps[key];
      return (counter === 0 && !isValid) || (counter === 1 && isValid);
    });

export const flatAsyncValidationMap = asyncInitMap =>
  Object.keys(asyncInitMap).reduce((acc, key) => {
    const target = asyncInitMap[key];
    if (typeof target === "function") {
      acc.push(target());
    } else {
      const funcs = flatAsyncValidationMap(target);
      acc.push(...funcs);
    }
    return acc;
  }, []);

export const fileList = files => {
  let fileList = [];
  for (let i = 0, numFiles = files.length; i < numFiles; i++) {
    fileList.push(files[i]);
  }
  return fileList;
};
