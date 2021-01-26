import { isValidValue } from "./isValidValue";
import { isValidIndex } from "./isValidIndex";

const validationPropsFuncs = [
  asyncValidatorProp,
  valueProp,
  nameProp,
  contextTypeProp,
  typeProp
];

export function validateProps(target, props, contextType) {
  const errors = validationPropsFuncs
    .map(fn => fn(target, props, contextType))
    .filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors[0]);
  }
}

function asyncValidatorProp(target, { type, asyncValidator }) {
  if (
    typeof asyncValidator !== "undefined" &&
    typeof asyncValidator !== "function"
  ) {
    return `The prop "asyncValidator" -> "${asyncValidator}" passed to "${target}" of type: ${type} is not allowed. It must be a function`;
  }
}

function valueProp(target, { type, value }) {
  if (
    typeof value !== "undefined" &&
    ((type === "array" && value.constructor !== Array) ||
      (type === "object" && typeof value !== "object"))
  ) {
    return `The prop "value": ${value} of type "${type}" passed to "${target}" it is not allowed as initial value.`;
  }
}

function nameProp(target, { name }, contextType) {
  if (!isValidValue(name, contextType)) {
    return `The prop "name": ${name} of type "${typeof name}" passed to "${target}" it is not allowed within context a of type "${contextType}".`;
  }
}

function contextTypeProp(target, { type, index }, contextType) {
  if (contextType === "array" && !isValidIndex(index)) {
    return `The prop "index": ${index} of type "${typeof index}" passed to a ${target} "${type}" must be either a string or number represent as integers.`;
  }
}

function typeProp(target, { name, value, checked, type }) {
  if (typeof type === "undefined") {
    return `The prop "type" -> "${type}"" passed to "${target}" is not allowed. It must be a string.`;
  }

  if (type === "file" && value && value !== "") {
    return `The prop "value" -> "${value}" passed to "${target}": ${name} of type: ${type} is not allowed. Input of type "file" does not support any default value.`;
  }

  if (
    type === "radio" &&
    (value === undefined ||
      (typeof value === "string" && value.replace(/ /g, "") === ""))
  ) {
    return `${target} of type => ${type}, must have a valid prop "value".`;
  }

  if (type !== "checkbox" && type !== "radio" && checked) {
    return `The prop "checked" -> "${checked}" passed to "${target}": ${name} of type: ${type} is not allowed. You can use "value" prop instead to set an initial value.`;
  }
}
