import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Form, { Input } from "./../src";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "email";
const typeInput = "text";
const nameInput = "email";
const valueInput = "foo";

describe("Component => Form", () => {
  it("should render a Form with an input", () => {
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
      />
    ];
    const { container, getByTestId } = mountForm({ children });
    const form = container.firstChild;
    expect(form.tagName).toBe("FORM");
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
});
