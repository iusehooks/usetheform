export function getValidationMsg(errors) {
  // It uses filter over find for supporting IE 11
  return errors.filter(e => e !== undefined && e !== null)[0];
}
