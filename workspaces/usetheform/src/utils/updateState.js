export function updateState(state, { nameProp, value, removeMe, add = false }) {
  const isArray = state.constructor === Array;
  // it uses slice over spread operator to avoid [undefined , anyvalue] and use [empty , anyvalue]
  let newState = isArray ? state.slice() : { ...state };

  if (add && isArray && typeof newState[nameProp] !== "undefined") {
    newState.splice(nameProp, 0, value);
  } else {
    newState[nameProp] = value;
  }

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
