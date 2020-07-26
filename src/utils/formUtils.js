export const STATUS = {
  ON_RESET: "ON_RESET",
  READY: "READY",
  RESETTED: "RESETTED",
  ON_CHANGE: "ON_CHANGE",
  ON_INIT: "ON_INIT",
  ON_SUBMIT: "ON_SUBMIT",
  ON_INIT_ASYNC: "ON_INIT_ASYNC"
};

export const createForm = (state = {}) => ({
  state,
  isValid: true,
  status: STATUS.READY,
  pristine: true,
  submitted: 0
});

export const getValueByPath = (path, obj, separator = "/") => {
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

export const fileList = files =>
  Object.keys(files).reduce((acc, key) => [...acc, files[key]], []);
