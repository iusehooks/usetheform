import React, { useState } from "react";
import { fireEvent, cleanup, act, render } from "@testing-library/react";

import { Form, Input, Collection, createFormStore } from "../../src";
import Reset from "../helpers/components/Reset";

afterEach(cleanup);

describe("API => createFormStoreStrictMode", () => {
  it("should update the counter, reset it, and preserve state across unmount/mount", () => {
    const [formStore, useSelectorForm] = createFormStore({
      counter: "10",
      array: [[[10]]]
    });

    const Counter = ({
      selector,
      initialFormState,
      testIdBtn = "counterSetterBtn",
      testIdValue = "counterValue"
    }) => {
      const [counter, setCounter] = useSelectorForm(selector, initialFormState);
      return (
        <div>
          <span data-testid={testIdValue}>{counter}</span>
          <button
            data-testid={testIdBtn}
            type="button"
            onClick={() => setCounter(0)}
          >
            Setter
          </button>
        </div>
      );
    };

    const FormCreateFormStore = () => {
      const [show, setShow] = useState(() => true);
      return (
        <React.StrictMode>
          {show && (
            <Form formStore={formStore}>
              <Input type="text" name="counter" data-testid="counterInput" />
              <Collection array name="array">
                <Collection array>
                  <Collection array>
                    <Input type="number" data-testid="counterNested" />
                  </Collection>
                </Collection>
              </Collection>
              <Reset />
            </Form>
          )}
          <Counter selector={state => state.counter} />
          <Counter
            testIdValue="counterValueNested"
            testIdBtn="counterSetterBtnNested"
            selector={state => state.array[0][0][0]}
          />
          <button
            data-testid="counterShowHideBtn"
            type="button"
            onClick={() => setShow(prev => !prev)}
          >
            Show/Hide
          </button>
        </React.StrictMode>
      );
    };

    const { getByTestId, queryByTestId } = render(<FormCreateFormStore />);

    const counterValueNested = getByTestId("counterValueNested");
    const counterSetterBtnNested = getByTestId("counterSetterBtnNested");

    const counterValue = getByTestId("counterValue");
    const counterInput = getByTestId("counterInput");
    const counterNested = getByTestId("counterNested");

    expect(counterValue.textContent).toBe("10");
    expect(counterInput.value).toBe("10");
    expect(counterNested.value).toBe("10");
    expect(counterValueNested.textContent).toBe("10");

    const newCounterValue = "50";
    act(() => {
      fireEvent.change(counterInput, { target: { value: newCounterValue } });
    });

    expect(counterValue.textContent).toBe(newCounterValue);
    expect(counterInput.value).toBe(newCounterValue);

    const counterSetterBtn = getByTestId("counterSetterBtn");
    act(() => {
      fireEvent.click(counterSetterBtn);
      fireEvent.click(counterSetterBtnNested);
    });

    expect(counterValue.textContent).toBe("0");
    expect(counterInput.value).toBe("0");
    expect(counterValueNested.textContent).toBe("0");

    const reset = getByTestId("reset");
    act(() => {
      fireEvent.click(reset);
    });

    expect(counterValue.textContent).toBe("10");
    expect(counterValueNested.textContent).toBe("10");
    expect(counterInput.value).toBe("10");

    const counterShowHideBtn = getByTestId("counterShowHideBtn");
    act(() => {
      fireEvent.click(counterShowHideBtn);
    });
    expect(counterValue.textContent).toBe("10");
    expect(counterValueNested.textContent).toBe("10");
    expect(queryByTestId("counterNested")).toBeNull();
    expect(queryByTestId("counterInput")).toBeNull();

    // Form is unmounted setter should not change the value
    act(() => {
      fireEvent.click(counterSetterBtn);
    });
    expect(counterValue.textContent).toBe("10");
    expect(counterValueNested.textContent).toBe("10");

    act(() => {
      fireEvent.click(counterShowHideBtn);
    });

    expect(counterValueNested.textContent).toBe("10");
    expect(counterValue.textContent).toBe("10");
    expect(counterInput.value).toBe("10");
  });
});
