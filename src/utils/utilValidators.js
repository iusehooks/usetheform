export function mergeValidators(path, validatorFN, clean) {
  let newValidators = {};
  if (typeof validatorFN === "object") {
    newValidators = Object.keys(validatorFN).reduce((acc, key) => {
      if (clean) {
        acc[`${path}/${key}`] = undefined;
      } else if (validatorFN[key] !== undefined) {
        acc[`${path}/${key}`] = validatorFN[key];
      }
      return acc;
    }, {});
  } else if (typeof validatorFN === "function") {
    newValidators = clean ? { [path]: undefined } : { [path]: validatorFN };
  }
  return newValidators;
}
