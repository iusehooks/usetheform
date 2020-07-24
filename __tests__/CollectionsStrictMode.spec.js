import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "./../src";
import {
  CollectionDynamicField,
  CollectionNestedDynamicField,
  CollectionNestedRadioCheckbox,
  CollectionNestedRandomPosition,
  CollectionNestedRandomPositionCollection
} from "./helpers/components/CollectionDynamicField";

import Reset from "./helpers/components/Reset";

const mountForm = ({ props = {}, children } = {}) =>
  render(
    <React.StrictMode>
      <Form {...props}>{children}</Form>
    </React.StrictMode>
  );

const onInit = jest.fn(state => state);
const onChange = jest.fn(state => state);
const onReset = jest.fn(state => state);
const onSubmit = jest.fn(state => state);

afterEach(cleanup);

describe("Collections Nested StrictMode => Collections", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should add/remove input fields dynamically", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionDynamicField key="1" name="dynamic" />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    const addInputs = getByTestId("addInput");
    const removeInputs = getByTestId("removeInput");

    expect(onInit).toHaveReturnedWith({});

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamic: [1] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamic: [1, 2] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamic: [1, 2, 3, 4] });

    for (let i = 1; i <= 4; i++) {
      const input = getByTestId(`input_${i}`);
      expect(input.value).toBe(`${i}`);
      fireEvent.change(input, { target: { value: `input_${i}` } });
    }

    onSubmit.mockClear();
    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({
      dynamic: ["input_1", "input_2", "input_3", "input_4"]
    });

    for (let i = 1; i <= 4; i++) {
      const input = getByTestId(`input_${i}`);
      expect(input.value).toBe(`input_${i}`);
    }

    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith({
      dynamic: [1, 2, 3, 4]
    });

    for (let i = 1; i <= 4; i++) {
      fireEvent.click(removeInputs);
    }

    onSubmit.mockClear();
    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({});
  });

  it("should add/remove array collections", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionNestedDynamicField key="1" />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    const addInputs = getByTestId("addInput");
    const removeInputs = getByTestId("removeInput");
    const addCollection = getByTestId("addCollection");
    const removeCollection = getByTestId("removeCollection");

    expect(onInit).toHaveReturnedWith({});

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamicNested: [[1]] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamicNested: [[1, 2]] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamicNested: [[1, 2, 3, 4]] });

    for (let i = 1; i <= 4; i++) {
      const input = getByTestId(`input_${i}`);
      fireEvent.change(input, { target: { value: `input_${i}` } });
    }

    onSubmit.mockClear();
    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({
      dynamicNested: [["input_1", "input_2", "input_3", "input_4"]]
    });

    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith({
      dynamicNested: [[1, 2, 3, 4]]
    });

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({ dynamicNested: [[1, 2, 3, 4, [1]]] });

    for (let i = 1; i <= 4; i++) {
      fireEvent.click(removeInputs);
    }

    onSubmit.mockClear();
    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({ dynamicNested: [[[1]]] });

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicNested: [[[1], [2]]]
    });

    onChange.mockClear();
    fireEvent.click(removeCollection);
    fireEvent.click(removeCollection);
    expect(onChange).toHaveReturnedWith({});
  });

  it("should add/remove array collections of radio and checkboxes", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionNestedRadioCheckbox key="1" />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    const addInputs = getByTestId("addInput");
    const removeInputs = getByTestId("removeInput");
    const addCollection = getByTestId("addCollection");
    const removeCollection = getByTestId("removeCollection");

    expect(onInit).toHaveReturnedWith({});

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamicRadioCheckbox: [[1]] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamicRadioCheckbox: [[1, 2]] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({
      dynamicRadioCheckbox: [[1, 2, 3, 4]]
    });

    for (let i = 1; i <= 4; i++) {
      const checkbox = getByTestId(`checkbox_${i}`);
      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
    }

    onSubmit.mockClear();
    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({});

    for (let i = 1; i <= 4; i++) {
      const checkbox = getByTestId(`checkbox_${i}`);
      expect(checkbox.checked).toBe(false);
    }

    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith({
      dynamicRadioCheckbox: [[1, 2, 3, 4]]
    });

    for (let i = 1; i <= 4; i++) {
      const checkbox = getByTestId(`checkbox_${i}`);
      expect(checkbox.checked).toBe(true);
    }

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRadioCheckbox: [[1, 2, 3, 4, [1]]]
    });

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRadioCheckbox: [[1, 2, 3, 4, [1], [2]]]
    });

    for (let i = 1; i <= 4; i++) {
      fireEvent.click(removeInputs);
    }

    onSubmit.mockClear();
    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({ dynamicRadioCheckbox: [[[1], [2]]] });

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRadioCheckbox: [[[1], [2], [3]]]
    });

    onChange.mockClear();
    for (let i = 1; i <= 3; i++) {
      fireEvent.click(removeCollection);
    }
    expect(onChange).toHaveReturnedWith({});

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRadioCheckbox: [[[4]]]
    });

    onChange.mockClear();
    fireEvent.click(removeCollection);
    expect(onChange).toHaveReturnedWith({});
  });

  it("should add/remove array inputs at random positions", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const myself = { current: null };
    const children = [
      <CollectionNestedRandomPosition key="1" ref={myself} />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    const addInputs = getByTestId("addInput");
    const removeInputs = getByTestId("removeInput");

    expect(onInit).toHaveReturnedWith({});
    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({ dynamicRandomPosition: [1] });

    onChange.mockClear();
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: myself.current.getInnerState()
    });

    onChange.mockClear();
    fireEvent.click(addInputs);
    fireEvent.click(addInputs);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: myself.current.getInnerState()
    });

    const currentState = [...myself.current.getInnerState()];
    myself.current.getInnerState().forEach((val, index) => {
      const input = getByTestId(`input_${val}`);
      myself.current.setValue(index, `input_${val}`);

      fireEvent.change(input, { target: { value: `input_${val}` } });
    });

    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({
      dynamicRandomPosition: myself.current.getInnerState()
    });

    onChange.mockClear();
    fireEvent.click(reset);
    myself.current.setInnerState(currentState);
    expect(onReset).toHaveReturnedWith({
      dynamicRandomPosition: myself.current.getInnerState()
    });

    onChange.mockClear();
    fireEvent.click(removeInputs);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: myself.current.getInnerState()
    });

    onChange.mockClear();
    fireEvent.click(removeInputs);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: myself.current.getInnerState()
    });

    onChange.mockClear();
    [...myself.current.getInnerState()].forEach(() => {
      fireEvent.click(removeInputs);
    });

    expect(onChange).toHaveReturnedWith({});
  });

  it("should add/remove array collections of inputs at random positions", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const myself = { current: null };
    const children = [
      <CollectionNestedRandomPositionCollection key="1" ref={myself} />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    const addCollection = getByTestId("addCollection");
    const removeCollection = getByTestId("removeCollection");

    expect(onInit).toHaveReturnedWith({});

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    onChange.mockClear();
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    onChange.mockClear();
    fireEvent.click(addCollection);
    fireEvent.click(addCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    const currentState = [...myself.current.getInnerState()];
    myself.current.getInnerState().forEach((val, index) => {
      const input = getByTestId(`input_${val}`);
      myself.current.setValue(index, [`input_${val}`]);

      fireEvent.change(input, { target: { value: `input_${val}` } });
    });

    fireEvent.click(submit);
    expect(onSubmit).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    fireEvent.click(reset);
    myself.current.setInnerState(currentState);
    expect(onReset).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    onChange.mockClear();
    fireEvent.click(removeCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    onChange.mockClear();
    fireEvent.click(removeCollection);
    expect(onChange).toHaveReturnedWith({
      dynamicRandomPosition: [myself.current.getInnerState()]
    });

    onChange.mockClear();
    [...myself.current.getInnerState()].forEach(() => {
      fireEvent.click(removeCollection);
    });

    expect(onChange).toHaveReturnedWith({});
  });
});
