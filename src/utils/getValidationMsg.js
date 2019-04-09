export function getValidationMsg(errors) {
  return errors.find(e => e !== undefined && e !== null);
}
