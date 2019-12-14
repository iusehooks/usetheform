export function passValidation(value, validators = [], formState) {
  const checks = validators.map(fn => fn(value, formState));
  const isValid = checks.every(val => val === undefined || val === null);
  return { checks, isValid };
}
