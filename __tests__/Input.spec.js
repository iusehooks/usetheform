import React from "react";
import { act } from "react-dom/test-utils";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";

import Form, { Input } from "./../src";

import InputAsync from "./helpers/components/InputAsync";
import InputSyncValidation from "./helpers/components/InputSyncValidation";
import Submit from "./helpers/components/Submit";
import Reset from "./helpers/components/Reset";
import { SimpleFormDynamicField } from "./helpers/components/SimpleForm";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const onInit = jest.fn();
const onChange = jest.fn();
const onSubmit = jest.fn();
const onReset = jest.fn();
afterEach(cleanup);

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

  it("should render a Input of type checkbox", () => {
    const type = "checkbox";
    const props = { onInit };

    const children = [
      <Input key="1" data-testid={type} type={type} name={type} checked />
    ];
    const { getByTestId } = mountForm({ children, props });
    const checkbox = getByTestId(type);
    expect(onInit).toHaveBeenCalledWith({ [type]: true }, true);
    expect(checkbox.type).toBe(type);
    expect(checkbox.checked).toBe(true);
  });

  it("should render a Input of type radio", () => {
    const type = "radio";
    const props = { onInit };

    const children = [
      <Input
        key="1"
        data-testid={type}
        type={type}
        name={type}
        checked
        value="3"
      />
    ];
    const { getByTestId } = mountForm({ children, props });
    const radio = getByTestId(type);
    expect(onInit).toHaveBeenCalledWith({ [type]: "3" }, true);
    expect(radio.type).toBe(type);
    expect(radio.checked).toBe(true);
    expect(radio.value).toBe("3");
  });

  it("should render Input of type range", () => {
    const type = "range";
    const props = { onChange };
    const children = [
      <Input
        key="1"
        data-testid={type}
        type={type}
        name="range"
        min="0"
        max="11"
      />
    ];
    const { getByTestId } = mountForm({ children, props });
    const range = getByTestId(type);
    expect(range.type).toBe(type);
    expect(range.min).toBe("0");
    expect(range.max).toBe("11");

    fireEvent.change(range, { target: { value: "3" } });
    expect(onChange).toHaveBeenCalledWith({ range: 3 }, true);
    expect(range.value).toBe("3");
  });

  it("should render Input of type number", () => {
    const type = "number";
    const props = { onChange };
    const children = [
      <Input key="1" data-testid={type} type={type} name={type} />
    ];
    const { getByTestId } = mountForm({ children, props });
    const number = getByTestId(type);
    expect(number.type).toBe(type);

    fireEvent.change(number, { target: { value: "3" } });
    expect(onChange).toHaveBeenCalledWith({ [type]: 3 }, true);
    expect(number.value).toBe("3");
  });

  it("should render Input of type submit", () => {
    const type = "submit";
    const props = { onSubmit };
    const children = [
      <Input key="1" type="text" name="text" value="text" />,
      <Input key="2" data-testid={type} type={type} name={type} />
    ];
    const { getByTestId } = mountForm({ children, props });
    const submit = getByTestId(type);
    expect(submit.type).toBe(type);

    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({ text: "text" }, true);
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
    expect(input.value).toBe("micky");
  });

  it("should render a Input and changing its value", () => {
    const value = "test";
    const valueNumber = 1;

    const props = { onChange };
    const children = [
      <Input key="1" data-testid="email" type="text" name="email" />,
      <Input key="2" data-testid="number" type="number" name="number" />
    ];
    const { getByTestId } = mountForm({ props, children });

    const number = getByTestId(/number/i);
    fireEvent.change(number, { target: { value: valueNumber } });
    expect(onChange).toHaveBeenCalledWith({ number: valueNumber }, true);

    const input = getByTestId(/email/i);
    fireEvent.change(input, { target: { value } });
    expect(onChange).toHaveBeenCalledWith(
      {
        email: value,
        number: valueNumber
      },
      true
    );

    fireEvent.change(number, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith({ email: value }, true);
  });

  it("should reset a Radio inputs group to it's initial value after being changed", () => {
    const type = "radio";
    const props = { onChange, onInit, onReset };
    const children = [
      <Input key="1" data-testid="a" type={type} name="sex" value="F" />,
      <Input
        key="2"
        data-testid="b"
        type={type}
        name="sex"
        checked
        value="M"
      />,
      <Input key="3" data-testid="c" type={type} name="sex" value="Other" />,
      <Reset key="4" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const radio1 = getByTestId("a");
    const radio2 = getByTestId("b");
    const radio3 = getByTestId("c");
    const reset = getByTestId("reset");

    expect(onInit).toHaveBeenCalledWith({ sex: "M" }, true);

    fireEvent.click(radio1);
    expect(onChange).toHaveBeenCalledWith({ sex: "F" }, true);
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(false);

    fireEvent.click(radio3);
    expect(onChange).toHaveBeenCalledWith({ sex: "Other" }, true);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(true);

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({ sex: "M" }, true);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
    expect(radio3.checked).toBe(false);
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
    expect(onInit).toHaveBeenCalledWith({ [name]: reducedValue }, true);
  });

  it("should use sync validator functions to validate the Input", () => {
    const value = "33";
    const name = "test";
    const props = { onReset, onInit, onChange };
    const children = [
      <Input
        key="1"
        name={name}
        type="text"
        value={value}
        data-testid="input"
        validators={[val => (val && val.length >= 3 ? undefined : "error")]}
      />,
      <Reset key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });
    expect(onInit).toHaveBeenCalledWith({ [name]: value }, false);

    const input = getByTestId("input");
    fireEvent.change(input, { target: { value: "1234" } });
    expect(onChange).toHaveBeenCalledWith({ [name]: "1234" }, true);

    fireEvent.change(input, { target: { value: "12" } });
    expect(onChange).toHaveBeenCalledWith({ [name]: "12" }, false);

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({ [name]: value }, false);
  });

  it("should use sync validator functions to validate the Input with touched prop true", () => {
    const name = "test";
    const props = { onReset, onChange };
    const children = [
      <InputSyncValidation name={name} touched={true} key="1" />,
      <Reset key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const input = getByTestId("input");
    fireEvent.change(input, { target: { value: "1234" } });
    expect(onChange).toHaveBeenCalledWith({ [name]: "1234" }, true);

    expect(() => getByTestId("errorLabel")).toThrow();

    fireEvent.change(input, { target: { value: "" } });
    act(() => {
      input.focus();
      input.blur();
    });

    const errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({}, false);
    expect(() => getByTestId("errorLabel")).toThrow();
  });

  it("should use sync validator functions to validate the Input with touched prop false", () => {
    const name = "test";
    const props = { onReset, onChange };
    const children = [
      <InputSyncValidation name={name} touched={false} key="1" />,
      <Reset key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });
    const input = getByTestId("input");

    // touched false errorLabel must be present
    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    fireEvent.change(input, { target: { value: "1234" } });
    expect(onChange).toHaveBeenCalledWith({ [name]: "1234" }, true);

    expect(() => getByTestId("errorLabel")).toThrow();

    fireEvent.change(input, { target: { value: "" } });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({}, false);

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();
  });

  it("should use sync validator functions to validate the Input with touched prop false and initial value", () => {
    const name = "test";
    const value = "123";
    const props = { onReset, onChange };
    const children = [
      <InputSyncValidation name={name} touched={false} key="1" value={value} />,
      <Reset key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });
    const input = getByTestId("input");

    expect(() => getByTestId("errorLabel")).toThrow();

    fireEvent.change(input, { target: { value: "" } });
    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({ [name]: value }, true);

    expect(() => getByTestId("errorLabel")).toThrow();
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

    const asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    const asyncError = await waitFor(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();
    expect(asyncError.textContent).toBe("Error");

    fireEvent.change(asyncinput, { target: { value: "1234" } });
    asyncinput.focus();
    asyncinput.blur();

    expect(asyncinput.value).toBe("1234");

    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess).toBeDefined();
    expect(asyncSuccess.textContent).toBe("Success");

    fireEvent.click(submit);

    const submittedCounter = await waitFor(() =>
      getByTestId("submittedCounter")
    );
    expect(submittedCounter.textContent).toBe("1");

    expect(onSubmit).toHaveBeenCalledWith({ [name]: "1234" }, true);

    fireEvent.click(reset);
    const asyncNotStartedYet = await waitFor(() =>
      getByTestId("asyncNotStartedYet")
    );
    expect(asyncNotStartedYet.textContent).toBe("asyncNotStartedYet");
    expect(onReset).toHaveBeenCalledWith({ [name]: value }, false);
  });

  it("should override the inital form state given a initial 'value' prop to the input", () => {
    const name = "test";

    const initialState = { [name]: 3 };
    const props = { onInit, initialState };

    let children = [<Input key="1" type="number" name={name} value={1} />];
    mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: 1 }, true);

    onInit.mockClear();
    children = [<Input key="1" type="text" name={name} value="foo" />];
    mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: "foo" }, true);

    onInit.mockClear();
    children = [
      <Input
        key="1"
        type="radio"
        data-testid="radio"
        name={name}
        value="foo_radio"
        checked
      />
    ];
    const { getByTestId } = mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: "foo_radio" }, true);
    const radio = getByTestId("radio");
    expect(radio.checked).toBe(true);

    onInit.mockClear();
    children = [
      <Input
        key="1"
        type="checkbox"
        data-testid="checkbox"
        name={name}
        value="foo_checkbox"
        checked
      />
    ];

    const { getByTestId: getByTestIdForm2 } = mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: "foo_checkbox" }, true);
    const checkbox = getByTestIdForm2("checkbox");
    expect(checkbox.checked).toBe(true);

    onInit.mockClear();
    children = [<Input key="1" type="custom" name={name} value={{ a: 1 }} />];
    mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: { a: 1 } }, true);

    onInit.mockClear();
    children = [
      <Input
        key="1"
        type="range"
        data-testid="range"
        min="0"
        max="100"
        name={name}
        value={10}
      />
    ];
    const { getByTestId: getByTestIdForm3 } = mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: 10 }, true);
    const range = getByTestIdForm3("range");
    expect(range.value).toBe("10");
  });

  it("should use a multiple reducers to reduce the Input value", () => {
    const props = { onInit };

    const reducers = [value => value + 2, value => value + 1];
    const reducedValue = 4;
    const name = "test";
    const children = [
      <Input
        key="1"
        type="number"
        data-testid="number"
        name={name}
        value={1}
        reducers={reducers}
      />
    ];
    const { getByTestId } = mountForm({ props, children });
    expect(onInit).toHaveBeenCalledWith({ [name]: reducedValue }, true);
    const number = getByTestId("number");
    expect(number.value).toBe(`${reducedValue}`);
  });

  it("should reset the form state to initial fields value dynamically added", () => {
    const props = { onInit, onChange, onReset };

    const { getByTestId } = render(<SimpleFormDynamicField {...props} />);
    const buttonAdd = getByTestId("add");
    expect(onInit).toHaveBeenCalledWith({}, true);

    fireEvent.click(buttonAdd);
    expect(onChange).toHaveBeenCalledWith(
      {
        radio: "2",
        checkbox2: "2",
        text2: "2"
      },
      true
    );

    const radio = getByTestId("radio");
    fireEvent.click(radio);
    expect(onChange).toHaveBeenCalledWith(
      {
        radio: "4",
        checkbox2: "2",
        text2: "2"
      },
      true
    );
    expect(radio.checked).toBe(true);

    const checkbox1 = getByTestId("checkbox1");
    const checkbox2 = getByTestId("checkbox2");

    fireEvent.click(checkbox1);
    expect(onChange).toHaveBeenCalledWith(
      {
        radio: "4",
        checkbox1: "1",
        checkbox2: "2",
        text2: "2"
      },
      true
    );
    expect(checkbox1.checked).toBe(true);
    expect(checkbox2.checked).toBe(true);

    const text1 = getByTestId("text1");
    fireEvent.change(text1, { target: { value: "micky" } });
    expect(onChange).toHaveBeenCalledWith(
      {
        radio: "4",
        checkbox1: "1",
        checkbox2: "2",
        text2: "2",
        text1: "micky"
      },
      true
    );
    expect(text1.value).toBe("micky");

    const reset = getByTestId("reset");
    const text2 = getByTestId("text2");
    const radio2 = getByTestId("radio2");

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        radio: "2",
        checkbox2: "2",
        text2: "2"
      },
      true
    );
    expect(radio2.checked).toBe(true);
    expect(checkbox2.checked).toBe(true);
    expect(text2.value).toBe("2");
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
