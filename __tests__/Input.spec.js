import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Form, { Input } from "./../src";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

describe("Component => Input", () => {
  it("should render a Input of type text", () => {
    const type = "text";
    const children = [
      <Input key="1" data-testid="email" type={type} name="email" />
    ];
    const { getByTestId } = mountForm({ children });
    expect(getByTestId(/email/i).type).toBe(type);
  });

  it("should render Input of type range", () => {
    const type = "range";
    const children = [
      <Input key="1" data-testid="range" type={type} name="range" />
    ];
    const { getByTestId } = mountForm({ children });
    expect(getByTestId(type).type).toBe(type);
  });

  it("should render a Input and changing its value", () => {
    const type = "text";
    const value = "test";
    const onChange = jest.fn();
    const props = { onChange };
    const children = [
      <Input key="1" data-testid="email" type={type} name="email" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const input = getByTestId(/email/i);
    fireEvent.change(input, { target: { value } });
    expect(onChange).toHaveBeenCalledWith({ email: value });
  });

  it("should use a reducer to reduce the Input value", () => {
    const onInit = jest.fn(state => state);
    const reducedValue = 3;
    const reducer = value => value + 2;
    const props = { onInit };
    const value = 1;
    const name = "test";
    const children = [
      <Input
        key="1"
        type="number"
        name={name}
        value={value}
        reducers={reducer}
      />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: reducedValue });
  });
});
