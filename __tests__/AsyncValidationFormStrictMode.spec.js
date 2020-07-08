import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  act
} from "@testing-library/react";

import {
  SimpleFormWithAsyncStrictMode,
  expectedInitialState
} from "./helpers/components/SimpleFormWithAsync";

const mountForm = ({ props = {} } = {}) =>
  render(
    <React.StrictMode>
      <SimpleFormWithAsyncStrictMode {...props} />
    </React.StrictMode>
  );

const onInit = jest.fn(state => state);
const onChange = jest.fn(state => state);
const onReset = jest.fn(state => state);
const onSubmit = jest.fn(state => state);

afterEach(cleanup);

describe("Async Validation Form StrictMode => Async Validation", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should run Async validators at Form initialization time", async () => {
    const props = { onInit, onSubmit, onChange, onReset };

    const { getByTestId } = mountForm({ props });

    const submit = getByTestId("submit");

    const asyncStartUsername = await waitForElement(() =>
      getByTestId("asyncStartUsername")
    );
    expect(asyncStartUsername).toBeDefined();

    const asyncStartCity = await waitForElement(() =>
      getByTestId("asyncStartCity")
    );
    expect(asyncStartCity).toBeDefined();

    const asyncErrorDetails = await waitForElement(() =>
      getByTestId("asyncErrorDetails")
    );
    expect(asyncErrorDetails).toBeDefined();

    expect(onInit).toHaveReturnedWith(expectedInitialState);
    expect(submit.disabled).toBe(true);
  });

  it("should run Async validators on fields or Collections changes", async () => {
    const props = { onInit, onSubmit, onChange, onReset };

    const { getByTestId } = mountForm({ props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    const addInputs = getByTestId("addInput");
    const removeInputs = getByTestId("removeInput");

    const asyncErrorDetails = await waitForElement(() =>
      getByTestId("asyncErrorDetails")
    );
    expect(asyncErrorDetails).toBeDefined();

    const details = getByTestId("details");

    act(() => {
      details.focus();
      fireEvent.change(details, { target: { value: "3331234567" } });
      details.blur();
    });

    expect(details.value).toBe("3331234567");

    const asyncSuccessDetails = await waitForElement(() =>
      getByTestId("asyncSuccessDetails")
    );

    expect(asyncSuccessDetails).toBeDefined();

    const email = getByTestId("email");

    act(() => {
      email.focus();
      fireEvent.change(email, { target: { value: "test@live.it" } });
      email.blur();
    });

    expect(email.value).toBe("test@live.it");
    expect(submit.disabled).toBe(false);

    fireEvent.click(submit);

    let asyncErrorCollection = await waitForElement(() =>
      getByTestId("asyncError")
    );

    expect(asyncErrorCollection).toBeDefined();

    const submittedCounter = getByTestId("submittedCounter");
    expect(submittedCounter.textContent).toBe("0");

    fireEvent.click(addInputs);
    fireEvent.click(addInputs);
    fireEvent.click(submit);

    const asyncSuccessCollection = await waitForElement(() =>
      getByTestId("asyncSuccess")
    );

    expect(asyncSuccessCollection).toBeDefined();
    expect(submittedCounter.textContent).toBe("1");

    fireEvent.click(removeInputs);
    fireEvent.click(submit);

    asyncErrorCollection = await waitForElement(() =>
      getByTestId("asyncError")
    );

    expect(asyncErrorCollection).toBeDefined();

    fireEvent.click(removeInputs);
    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith(expectedInitialState);
  });
});
