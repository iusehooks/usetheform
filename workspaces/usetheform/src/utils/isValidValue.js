export function isValidValue(value, contextType) {
  if (contextType === "array") {
    return typeof value === "undefined";
  } else {
    return !(
      typeof value === "undefined" ||
      (typeof value === "number" && isNaN(value)) ||
      typeof value === "object" ||
      value === null ||
      typeof value === "boolean"
    );
  }
}
