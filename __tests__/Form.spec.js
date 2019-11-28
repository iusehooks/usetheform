import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Form, { Input } from "./../src";

import SimpleForm from "./helpers/components/SimpleForm";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "email";
const typeInput = "text";
const nameInput = "email";
const valueInput = "foo";

describe("Component => Form", () => {
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
    const onInit = jest.fn(state => state);
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
    const onChange = jest.fn();
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
    const onInit = jest.fn(state => state);
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };
    const props = { initialState, onInit };
    render(<SimpleForm {...props} />);
    expect(onInit).toHaveReturnedWith(initialState);
  });

  it("should reset the Form state", () => {
    const onReset = jest.fn();
    const onChange = jest.fn();
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

  it("should reduce the Form state with the given reducer function", () => {
    const initialState = { name: "test" };
    const onInit = jest.fn(state => state);

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

  it("should submit the Form", () => {
    const onSubmit = jest.fn();
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
    const onSubmit = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything" }
    };

    const props = { initialState, onSubmit };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
