import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import SimpleFormContext from "./helpers/components/SimpleFormContext";

describe("Component => FormContext", () => {
  it("should change the Form state due to action", async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<SimpleFormContext onChange={onChange} />);
    const button1 = await waitForElement(() => getByTestId("button0"));
    fireEvent.click(button1);
    expect(onChange).toHaveBeenCalledWith({ tags: [undefined, "blue"] });

    const button2 = await waitForElement(() => getByTestId("button1"));
    fireEvent.click(button2);
    expect(onChange).toHaveBeenCalledWith({ tags: [undefined, undefined] });
  });

  it("should submit the Form state", async () => {
    const onSubmit = jest.fn();
    const onChange = jest.fn();
    const { getByTestId } = render(
      <SimpleFormContext onChange={onChange} onSubmit={onSubmit} />
    );
    const button1 = await waitForElement(() => getByTestId("button0"));
    fireEvent.click(button1);

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({ tags: [undefined, "blue"] }, true);
  });

  it("should reduce the Form state using reducer functions", async () => {
    const onSubmit = jest.fn();
    const onChange = jest.fn();
    const reducers = [state => ({ ...state, tags: ["blue", "red"] })];
    const { getByTestId } = render(
      <SimpleFormContext
        onChange={onChange}
        reducers={reducers}
        onSubmit={onSubmit}
      />
    );
    const button1 = await waitForElement(() => getByTestId("button0"));
    fireEvent.click(button1);

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({ tags: ["blue", "red"] }, true);
  });
});
