import React from "react";
import { fireEvent, cleanup, waitFor } from "@testing-library/react";
import { act } from "./helpers/utils/act";
import { CollectionArrayIndexHandledManually } from "./helpers/components/CollectionArrayIndexHandledManually";

import Reset from "./helpers/components/Reset";
import Submit from "./helpers/components/Submit";
import { mountForm } from "./helpers/utils/mountForm";

const onInit = jest.fn();
const onChange = jest.fn();
const onReset = jest.fn();
const onSubmit = jest.fn();

afterEach(cleanup);

describe("Component => Collection (Array with indexes handled manually)", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should correctly render an array Collection with indexes handled manually", async () => {
    const props = { onInit, onChange, onReset, onSubmit };
    const myself = { current: null };

    const children = [
      <CollectionArrayIndexHandledManually key="1" ref={myself} />,
      <Reset key="2" />,
      <Submit key="3" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const addInput = getByTestId("addInput");
    const addCollection = getByTestId("addCollection");
    const removeCollection = getByTestId("removeCollection");

    const removeInput = getByTestId("removeInput");
    const reset = getByTestId("reset");
    const submit = getByTestId("submit");

    expect(onInit).toHaveBeenCalledWith({}, true);

    for (let i = 1; i <= 10; i++) {
      act(() => {
        fireEvent.click(addInput);
      });

      await waitFor(() => {
        const input = getByTestId(`input_${i}`, {
          timeout: 500
        });
        expect(input.value).toBe(`${i}`);
      });
    }

    let stateExpected = myself.current.getInnerState();
    expect(onChange).toHaveBeenCalledWith({ indexManual: stateExpected }, true);

    for (let i = 1; i <= 5; i++) {
      act(() => {
        fireEvent.click(removeInput);
      });
    }

    stateExpected = myself.current.getInnerState();
    expect(onChange).toHaveBeenCalledWith({ indexManual: stateExpected }, true);

    const newExpected = [];
    stateExpected[0].forEach(val => {
      const input = getByTestId(`input_${val}`);
      const newValue = Math.random() * 10000;
      newExpected.push(`${newValue}`);
      act(() => {
        fireEvent.change(input, { target: { value: `${newValue}` } });
      });
    });

    expect(onChange).toHaveBeenCalledWith({ indexManual: [newExpected] }, true);

    act(() => {
      fireEvent.click(submit);
    });

    expect(onSubmit).toHaveBeenCalledWith({ indexManual: [newExpected] }, true);

    act(() => {
      fireEvent.click(reset);
    });

    expect(onReset).toHaveBeenCalledWith({ indexManual: stateExpected }, true);

    for (let i = 1; i <= 10; i++) {
      act(() => {
        fireEvent.click(addCollection);
      });
      await waitFor(() => {
        const input = getByTestId(`text_${i}`, {
          timeout: 500
        });
        expect(input.value).toBe(`${i}`);
      });
    }

    stateExpected = myself.current.getInnerState();
    expect(onChange).toHaveBeenCalledWith({ indexManual: stateExpected }, true);

    const newCollectionExpected = [];
    stateExpected[1].forEach(val => {
      const input = getByTestId(`text_${val[0]}`);
      const newValue = Math.random() * 10000;
      newCollectionExpected.push([`${newValue}`]);
      act(() => {
        fireEvent.change(input, { target: { value: `${newValue}` } });
      });
    });

    const nextStateExpected = [stateExpected[0], newCollectionExpected];
    expect(onChange).toHaveBeenCalledWith(
      { indexManual: nextStateExpected },
      true
    );

    stateExpected = myself.current.getInnerState();
    act(() => {
      fireEvent.click(reset);
    });

    expect(onReset).toHaveBeenCalledWith({ indexManual: stateExpected }, true);

    for (let i = 1; i <= 5; i++) {
      act(() => {
        fireEvent.click(removeCollection);
      });
    }

    stateExpected = myself.current.getInnerState();
    expect(onChange).toHaveBeenCalledWith({ indexManual: stateExpected }, true);
  });
});
