export function isValidIndex(value) {
  const x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x && x >= 0;
}
