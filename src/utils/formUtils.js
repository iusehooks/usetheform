export const STATUS = {
  ON_RESET: "ON_RESET",
  READY: "READY",
  ON_CHANGE: "ON_CHANGE",
  ON_INIT: "ON_INIT",
  ON_SUBMIT: "ON_SUBMIT"
};

export const createForm = (state = {}) => ({
  state,
  isValid: true,
  status: STATUS.READY,
  pristine: true
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

export const isFormValidAsync = (validators, state) =>
  Object.keys(validators).map(key => {
    const value = getValueByPath(key, state);
    return validators[key](value, state);
  });

export const fileList = files =>
  Object.keys(files).reduce((acc, key) => [...acc, files[key]], []);
