export default function isValidReducers(reducers) {
  return (
    (typeof reducers === "object" &&
      reducers !== null &&
      reducers.constructor.name === "Array") ||
    typeof reducers === "function"
  );
}
