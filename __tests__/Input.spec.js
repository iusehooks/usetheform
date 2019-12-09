import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import Form, { Input } from "./../src";

import InputAsync from "./helpers/components/InputAsync";
import Submit from "./helpers/components/Submit";
import Reset from "./helpers/components/Reset";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const onInit = jest.fn(state => state);
const onChange = jest.fn();
const onSubmit = jest.fn();
const onReset = jest.fn();

describe("Component => Input", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onSubmit.mockClear();
    onReset.mockClear();
  });

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

  it("should trigger onChange event when the Input value changes", () => {
    const onChangeInput = jest.fn(value => value);
    const children = [
      <Input
        key="1"
        data-testid="foo"
        type="text"
        name="foo"
        onChange={onChangeInput}
      />
    ];

    const { getByTestId } = mountForm({ children });
    const input = getByTestId(/foo/i);

    fireEvent.change(input, { target: { value: "micky" } });
    expect(onChangeInput).toHaveReturnedWith("micky");
  });

  it("should render a Input and changing its value", () => {
    const type = "text";
    const value = "test";
    const props = { onChange };
    const children = [
      <Input key="1" data-testid="email" type={type} name="email" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const input = getByTestId(/email/i);
    fireEvent.change(input, { target: { value } });
    expect(onChange).toHaveBeenCalledWith({ email: value });
  });

  it("should use a reducer function to reduce the Input value", () => {
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

  it("should use an async validator function to validate the Input", async () => {
    const value = "33";
    const name = "test";
    const props = { onSubmit, onReset };
    const children = [
      <InputAsync key="1" name={name} value={value} />,
      <Submit key="2" />,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const submit = getByTestId("submit");
    const reset = getByTestId("reset");
    const asyncinput = getByTestId("asyncinput");

    asyncinput.focus();
    asyncinput.blur();

    const asyncStart = await waitForElement(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    const asyncError = await waitForElement(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();
    expect(asyncError.textContent).toBe("Error");

    asyncinput.focus();
    fireEvent.change(asyncinput, { target: { value: "1234" } });
    fireEvent.click(submit);

    const asyncSuccess = await waitForElement(() =>
      getByTestId("asyncSuccess")
    );
    expect(asyncSuccess).toBeDefined();
    expect(asyncSuccess.textContent).toBe("Success");
    expect(onSubmit).toHaveBeenCalledWith({ [name]: "1234" }, true);

    fireEvent.click(reset);
    const asyncNotStartedYet = await waitForElement(() =>
      getByTestId("asyncNotStartedYet")
    );
    expect(asyncNotStartedYet.textContent).toBe("asyncNotStartedYet");
    expect(onReset).toHaveBeenCalledWith({ [name]: value });
  });

  it("should override the inital form state given a initial 'value' prop to the input", () => {
    const name = "test";

    const initialState = { [name]: 3 };
    const props = { onInit, initialState };

    let children = [<Input key="1" type="number" name={name} value={1} />];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: 1 });

    onInit.mockClear();
    children = [<Input key="1" type="text" name={name} value="foo" />];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: "foo" });

    onInit.mockClear();
    children = [
      <Input key="1" type="radio" name={name} value="foo_radio" checked />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: "foo_radio" });

    onInit.mockClear();
    children = [
      <Input key="1" type="checkbox" name={name} value="foo_checkbox" checked />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: "foo_checkbox" });

    onInit.mockClear();
    children = [<Input key="1" type="custom" name={name} value={{ a: 1 }} />];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: { a: 1 } });

    onInit.mockClear();
    children = [
      <Input key="1" type="range" min="0" max="100" name={name} value={10} />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: 10 });
  });

  it("should use a multiple reducers to reduce the Input value", () => {
    const props = { onInit };

    const reducers = [value => value + 2, value => value + 1];
    const reducedValue = 4;
    const name = "test";
    const children = [
      <Input key="1" type="number" name={name} value={1} reducers={reducers} />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: reducedValue });
  });

  it("should throw an error for missing 'type'", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [<Input key="1" name="test" />];
    expect(() => mountForm({ children })).toThrowError(
      /The prop "type" -> "undefined"/i
    );

    children = [<Input key="1" type="text" name="test" checked />];
    expect(() => mountForm({ children })).toThrowError();

    children = [<Input key="1" type="file" name="test" value="test" />];
    expect(() => mountForm({ children })).toThrowError(
      /Input of type "file" does not support any default value/i
    );

    console.error = originalError;
  });

  it("should throw an error for an invalid 'asyncValidator' prop", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [
      <Input key="1" name="test" type="radio" value="1" asyncValidator={{}} />
    ];
    expect(() => mountForm({ children })).toThrowError(
      /It must be a function/i
    );

    console.error = originalError;
  });

  it("should throw an error for invalid 'value' prop if the input field is a file", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [<Input key="1" name="test" type="file" value="123" />];
    expect(() => mountForm({ children })).toThrowError(
      /Input of type "file" does not support any default value./i
    );

    console.error = originalError;
  });

  it("should throw an error for missing 'value' prop if the input field is a radio", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [<Input key="1" name="test" type="radio" />];
    expect(() => mountForm({ children })).toThrowError(
      /Input of type => radio, must have a valid prop "value"./i
    );

    children = [<Input key="1" name="test" type="radio" value="" />];
    expect(() => mountForm({ children })).toThrowError(
      /Input of type => radio, must have a valid prop "value"./i
    );

    children = [<Input key="1" name="test" type="radio" value="   " />];
    expect(() => mountForm({ children })).toThrowError(
      /Input of type => radio, must have a valid prop "value"./i
    );

    console.error = originalError;
  });
});
