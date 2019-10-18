const noop = newValue => newValue;

export function chainReducers(reducers) {
  if (typeof reducers === "function") {
    return reducers;
  }
  return reducers.length === 0
    ? noop
    : (newValue, oldValue, state) =>
        reducers.reduce(
          (acc, elm, index) => (index > 0 ? elm(acc, oldValue, state) : acc),
          reducers[0](newValue, oldValue, state)
        );
}

export function chainActionReducers(reducers) {
  if (typeof reducers === "function") {
    return reducers;
  }
  return reducers.length === 0
    ? noop
    : (state, action) =>
        reducers.reduce(
          (acc, elm, index) => (index > 0 ? elm(acc, action) : acc),
          reducers[0](state, action)
        );
}
