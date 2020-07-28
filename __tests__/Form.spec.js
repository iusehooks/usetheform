import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "@testing-library/react";

import Form, { Input } from "./../src";

import { CollectionDynamicCart } from "./helpers/components/CollectionDynamicField";
import SimpleForm from "./helpers/components/SimpleForm";
import SimpleFormWithAsync from "./helpers/components/SimpleFormWithAsync";
import {
  ComplexForm,
  ComplexFormInitValueAsProps,
  initialState as initialStateComplexForm
} from "./helpers/components/ComplexForm";
import { exec } from "child_process";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "email";
const typeInput = "text";
const nameInput = "email";
const valueInput = "foo";

const onInit = jest.fn(state => state);
const onChange = jest.fn();
const onReset = jest.fn();
const onSubmit = jest.fn();

afterEach(cleanup);

describe("Component => Form", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should render a Form with an input", () => {
    const name = "myForm";
    const props = { name };
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
      />
    ];
    const { container, getByTestId } = mountForm({ props, children });
    const form = container.firstChild;
    expect(form.name).toBe(name);
    expect(form.children.length).toBe(children.length);
    expect(getByTestId(dataTestid).type).toBe(typeInput);
  });

  it("should trigger onInit event when Form is ready", () => {
    const props = { onInit };
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
        value={valueInput}
      />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [nameInput]: valueInput });
  });

  it("should trigger onChange event when Form state changes", () => {
    const props = { onChange };
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
      />
    ];
    const { getByTestId } = mountForm({ props, children });
    const input = getByTestId(dataTestid);
    fireEvent.change(input, { target: { value: valueInput } });
    expect(onChange).toHaveBeenCalledWith({ [nameInput]: valueInput });
  });

  it("should initialized the Form state", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };
    const props = { initialState, onInit };
    render(<SimpleForm {...props} />);
    expect(onInit).toHaveReturnedWith(initialState);
  });

  it("should reset the Form state", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = { initialState, onReset, onChange };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const reset = getByTestId("reset");
    const textField = getByTestId("name");

    fireEvent.change(textField, { target: { value: "Antonio" } });
    expect(onChange).toHaveBeenCalledWith({
      user: {
        name: "Antonio",
        lastname: "anything",
        email: "anything@google.com"
      }
    });

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(initialState);
  });

  it("should render a Form with dynamic inputs and initial state passed to Form prop", () => {
    const onReset = jest.fn();
    const props = { onInit, onChange, onReset };
    const { getByTestId } = render(<ComplexForm {...props} />);
    expect(onInit).toHaveReturnedWith(initialStateComplexForm);

    const addmore = getByTestId("addinput");
    fireEvent.click(addmore);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1
    });

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1,
      2: 2
    });

    const select = getByTestId("select");
    fireEvent.change(select, { target: { value: "3" } });

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      select: "3",
      1: 1,
      2: 2
    });

    const reset = getByTestId("reset");
    fireEvent.click(reset);

    expect(onReset).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1,
      2: 2
    });

    const sexM = getByTestId("sexm");
    fireEvent.click(sexM);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "M",
      1: 1,
      2: 2
    });

    const removeinput = getByTestId("removeinput");
    fireEvent.click(removeinput);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "M",
      1: 1
    });

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "M",
      1: 1,
      3: 3
    });

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1,
      3: 3
    });

    const other1 = getByTestId("other1");
    fireEvent.click(other1);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      other: [undefined, "3"],
      1: 1,
      3: 3
    });

    fireEvent.click(other1);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      other: ["1", "3"],
      1: 1,
      3: 3
    });

    const sexF = getByTestId("sexf");
    fireEvent.click(sexF);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "F",
      1: 1,
      3: 3
    });

    const other2 = getByTestId("other2");
    onChange.mockClear();
    fireEvent.click(other2);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      other: ["1", undefined],
      1: 1,
      3: 3
    });
  });

  it("should render a Form with dynamic inputs and initial state passed to each input as 'value' prop", () => {
    const onReset = jest.fn();
    const props = { onInit, onChange, onReset };
    const { getByTestId } = render(<ComplexFormInitValueAsProps {...props} />);
    expect(onInit).toHaveReturnedWith(initialStateComplexForm);

    const addmore = getByTestId("addinput");
    fireEvent.click(addmore);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1
    });

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1,
      2: 2
    });

    const select = getByTestId("select");
    fireEvent.change(select, { target: { value: "3" } });

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      select: "3",
      1: 1,
      2: 2
    });

    const reset = getByTestId("reset");
    fireEvent.click(reset);

    expect(onReset).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1,
      2: 2
    });

    const sexM = getByTestId("sexm");
    fireEvent.click(sexM);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "M",
      1: 1,
      2: 2
    });

    const removeinput = getByTestId("removeinput");
    fireEvent.click(removeinput);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "M",
      1: 1
    });

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "M",
      1: 1,
      3: 3
    });

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      1: 1,
      3: 3
    });

    const other1 = getByTestId("other1");
    fireEvent.click(other1);

    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      other: [undefined, "3"],
      1: 1,
      3: 3
    });

    fireEvent.click(other1);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      other: ["1", "3"],
      1: 1,
      3: 3
    });

    const sexF = getByTestId("sexf");
    fireEvent.click(sexF);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      sex: "F",
      1: 1,
      3: 3
    });

    const other2 = getByTestId("other2");
    onChange.mockClear();
    fireEvent.click(other2);
    expect(onChange).toHaveBeenCalledWith({
      ...initialStateComplexForm,
      other: ["1", undefined],
      1: 1,
      3: 3
    });
  });

  it("should reduce the Form state with the given reducer function", () => {
    const initialState = { name: "test" };

    const reducer = jest.fn((state, prevState) => {
      const newState = { ...state };
      if (newState.name !== "mickey") newState.name = "foo";
      return newState;
    });

    const jestReducer = jest.fn();
    const reducerN = (state, prevState) => {
      jestReducer(state, prevState);
      return state;
    };

    const props = { onInit, initialState, reducers: [reducer, reducerN] };

    const children = [
      <Input key="1" data-testid="user" name="name" type="text" />
    ];

    const { getByTestId } = mountForm({ props, children });
    expect(jestReducer).toHaveBeenCalledWith({ name: "foo" }, {});

    expect(onInit).toHaveReturnedWith({ name: "foo" });

    jestReducer.mockReset();
    const user = getByTestId("user");
    fireEvent.change(user, { target: { value: "mickey" } });
    expect(jestReducer).toHaveBeenCalledWith(
      { name: "mickey" },
      { name: "foo" }
    );
  });

  it("should run reducer functions applied to Form on fields removal", () => {
    const reducers = jest.fn(value => {
      const { cart = {} } = value;
      const { list = {} } = cart;
      const { items = [] } = list;
      const result = items.reduce((acc, val) => {
        acc += val;
        return acc;
      }, 0);
      const newList = { ...list, result };
      const newCart = { ...cart, list: newList };

      return { ...value, cart: newCart, cartResult: result };
    });
    const props = { onInit, onSubmit, onChange, onReset, reducers };

    const children = [
      <CollectionDynamicCart key="1" />,
      <Input name="cartResult" type="number" key="2" value="0" />
    ];

    const { getByTestId } = mountForm({ children, props });
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { result: 0 } },
      cartResult: 0
    });

    const addInput = getByTestId("addInput");
    const removeInput = getByTestId("removeInput");

    fireEvent.click(addInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { items: [1], result: 1 } },
      cartResult: 1
    });

    fireEvent.click(addInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { items: [1, 2], result: 3 } },
      cartResult: 3
    });

    fireEvent.click(removeInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { items: [1], result: 1 } },
      cartResult: 1
    });

    fireEvent.click(removeInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { result: 0 } },
      cartResult: 0
    });
  });

  it("should submit the Form", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = { initialState, onSubmit };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(initialState, true);
  });

  it("should not submit an invalid Form", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything" }
    };

    const props = { initialState, onSubmit };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should not `preventDefault` Form submission if action props is present and Form is Valid", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = {
      initialState,
      action: "http://yourapiserver.com/submit"
    };

    const { getByTestId } = render(<SimpleForm {...props} />);
    const form = getByTestId("form");

    const isNotPrevented = fireEvent.submit(form);

    expect(isNotPrevented).toBe(true);
    console.error = originalError;
  });

  it("should submit a valid Form with an action and not `preventDefault` form submission", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = {
      initialState,
      onSubmit,
      action: "http://yourapiserver.com/submit",
      method: "POST"
    };

    const { getByTestId } = render(<SimpleForm {...props} />);
    const form = getByTestId("form");

    const inputName = getByTestId("name");
    const inputLastName = getByTestId("lastname");
    const inputEmail = getByTestId("email");

    expect(inputName.value).toBe("foo");
    expect(inputLastName.value).toBe("anything");
    expect(inputEmail.value).toBe("anything@google.com");

    expect(form.action).toBe(props.action);
    expect(form.method).toMatch(/POST/i);

    const isNotPrevented = fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalled();
    expect(isNotPrevented).toBe(true);

    console.error = originalError;
  });

  it("should not submit a invalid Form with an action and `preventDefault` form submission", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything_google.com" }
    };

    const props = {
      initialState,
      onSubmit,
      action: "http://yourapiserver.com/submit",
      method: "POST"
    };

    const { getByTestId } = render(<SimpleForm {...props} />);
    const form = getByTestId("form");

    expect(form.action).toBe(props.action);
    expect(form.method).toMatch(/POST/i);

    const isNotPrevented = fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(isNotPrevented).toBe(false);
    console.error = originalError;
  });

  it("should <Submit /> button being disabled for an a invalid Form with Async Fields validators functions", async () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      username: "foo"
    };

    const props = {
      initialState,
      onSubmit
    };

    const { getByTestId } = render(<SimpleFormWithAsync {...props} />);
    const form = getByTestId("form");
    const submitbutton = getByTestId("submit");

    const asyncinput = getByTestId("asyncinput");
    expect(asyncinput.value).toBe("foo");

    fireEvent.submit(form);

    const asyncStart = await waitForElement(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    const asyncError = await waitForElement(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(submitbutton.disabled).toBe(true);
    console.error = originalError;
  });
});
