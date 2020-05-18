export function mergeValidators(path, value, clean) {
  let newValidators = {};
  if (typeof value === "object" && value !== null) {
    newValidators = Object.keys(value).reduce((acc, key) => {
      if (clean) {
        acc[`${path}/${key}`] = undefined;
      } else if (value[key] !== undefined) {
        acc[`${path}/${key}`] = value[key];
      }
      return acc;
    }, {});
  } else if (typeof value === "function") {
    newValidators = clean ? { [path]: undefined } : { [path]: value };
  } else if (typeof value === "boolean" || value === null) {
    const pathValue =
      value === null
        ? { type: "collection", isValid: value, counter: 0 }
        : { type: "field", isValid: value, counter: 0 };
    newValidators = clean ? { [path]: undefined } : { [path]: pathValue };
  }
  return newValidators;
}
