export function updateState(state, { nameProp, value, removeMe }) {
  let newState = state.constructor === Array ? [...state] : { ...state };
  newState[nameProp] = value;

  if (
    removeMe ||
    value === undefined ||
    value === null ||
    (value.constructor === Array && value.every(elm => elm === undefined)) ||
    (typeof value === "object" &&
      value.constructor.name !== "File" &&
      Object.keys(value).length === 0) ||
    (typeof value === "string" && value === "")
  ) {
    delete newState[nameProp];
  }

  return newState;
}
