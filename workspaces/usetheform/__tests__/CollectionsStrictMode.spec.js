import React from "react";
import { cleanup, fireEvent } from "@testing-library/react";

import {
  CollectionDynamicField,
  CollectionNestedDynamicField,
  CollectionNestedRadioCheckbox,
  CollectionNestedRandomPosition,
  CollectionNestedRandomPositionCollection
} from "./helpers/components/CollectionDynamicField";

import { CollectionObjectNestedRadios } from "./helpers/components/CollectionObjectNested";

import Reset from "./helpers/components/Reset";
import { mountForm } from "./helpers/utils/mountForm";

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

  it("should reset a nested collection of radio buttons to its initial state - 1", () => {
    const initialState = {
      lv1: {
        1: "2",
        lv2: { 2: "3", lv3: { 3: "6", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    };
    const props = { onInit, onChange, onReset, initialState };
    const children = [
      <CollectionObjectNestedRadios key="1" />,
      <Reset key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });
    const reset = getByTestId("reset");

    const radio1lv1 = getByTestId("1");
    const radio2lv1 = getByTestId("2");

    const radio1lv2 = getByTestId("3");
    const radio2lv2 = getByTestId("4");

    const radio1lv3 = getByTestId("5");
    const radio2lv3 = getByTestId("6");

    const radio1lv4 = getByTestId("7");
    const radio2lv4 = getByTestId("8");

    const radio1lv5 = getByTestId("9");
    const radio2lv5 = getByTestId("10");

    expect(onInit).toHaveReturnedWith(initialState);
    expect(radio2lv1.checked).toBe(true);
    expect(radio1lv2.checked).toBe(true);
    expect(radio2lv3.checked).toBe(true);
    expect(radio1lv4.checked).toBe(true);
    expect(radio1lv5.checked).toBe(true);

    fireEvent.click(radio1lv1);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "3", lv3: { 3: "6", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv1.checked).toBe(true);
    expect(radio2lv1.checked).toBe(false);

    fireEvent.click(radio2lv2);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "6", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv2.checked).toBe(false);
    expect(radio2lv2.checked).toBe(true);

    fireEvent.click(radio1lv3);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "5", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv3.checked).toBe(true);
    expect(radio2lv3.checked).toBe(false);

    fireEvent.click(radio2lv4);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "5", lv4: { 4: "8", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv4.checked).toBe(false);
    expect(radio2lv4.checked).toBe(true);

    fireEvent.click(radio2lv5);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "5", lv4: { 4: "8", lv5: { 5: "10" } } } }
      }
    });
    expect(radio1lv5.checked).toBe(false);
    expect(radio2lv5.checked).toBe(true);

    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith(initialState);
    expect(radio1lv1.checked).toBe(false);
    expect(radio2lv1.checked).toBe(true);

    expect(radio1lv2.checked).toBe(true);
    expect(radio2lv2.checked).toBe(false);

    expect(radio1lv3.checked).toBe(false);
    expect(radio2lv3.checked).toBe(true);

    expect(radio1lv4.checked).toBe(true);
    expect(radio2lv4.checked).toBe(false);

    expect(radio1lv5.checked).toBe(true);
    expect(radio2lv5.checked).toBe(false);
  });

  it("should reset a nested collection of radio buttons to its initial state - 2", () => {
    const initialState = {
      lv1: {
        1: "2",
        lv2: { 2: "3", lv3: { 3: "6", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    };
    const props = { onInit, onChange, onReset };
    const children = [
      <CollectionObjectNestedRadios key="1" checked />,
      <Reset key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });
    const reset = getByTestId("reset");

    const radio1lv1 = getByTestId("1");
    const radio2lv1 = getByTestId("2");

    const radio1lv2 = getByTestId("3");
    const radio2lv2 = getByTestId("4");

    const radio1lv3 = getByTestId("5");
    const radio2lv3 = getByTestId("6");

    const radio1lv4 = getByTestId("7");
    const radio2lv4 = getByTestId("8");

    const radio1lv5 = getByTestId("9");
    const radio2lv5 = getByTestId("10");

    expect(onInit).toHaveReturnedWith(initialState);
    expect(radio2lv1.checked).toBe(true);
    expect(radio1lv2.checked).toBe(true);
    expect(radio2lv3.checked).toBe(true);
    expect(radio1lv4.checked).toBe(true);
    expect(radio1lv5.checked).toBe(true);

    fireEvent.click(radio1lv1);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "3", lv3: { 3: "6", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv1.checked).toBe(true);
    expect(radio2lv1.checked).toBe(false);

    fireEvent.click(radio2lv2);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "6", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv2.checked).toBe(false);
    expect(radio2lv2.checked).toBe(true);

    fireEvent.click(radio1lv3);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "5", lv4: { 4: "7", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv3.checked).toBe(true);
    expect(radio2lv3.checked).toBe(false);

    fireEvent.click(radio2lv4);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "5", lv4: { 4: "8", lv5: { 5: "9" } } } }
      }
    });
    expect(radio1lv4.checked).toBe(false);
    expect(radio2lv4.checked).toBe(true);

    fireEvent.click(radio2lv5);
    expect(onChange).toHaveReturnedWith({
      lv1: {
        1: "1",
        lv2: { 2: "4", lv3: { 3: "5", lv4: { 4: "8", lv5: { 5: "10" } } } }
      }
    });
    expect(radio1lv5.checked).toBe(false);
    expect(radio2lv5.checked).toBe(true);

    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith(initialState);
    expect(radio1lv1.checked).toBe(false);
    expect(radio2lv1.checked).toBe(true);

    expect(radio1lv2.checked).toBe(true);
    expect(radio2lv2.checked).toBe(false);

    expect(radio1lv3.checked).toBe(false);
    expect(radio2lv3.checked).toBe(true);

    expect(radio1lv4.checked).toBe(true);
    expect(radio2lv4.checked).toBe(false);

    expect(radio1lv5.checked).toBe(true);
    expect(radio2lv5.checked).toBe(false);
  });
});
