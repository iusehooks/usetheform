import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";

import Form, { TextArea } from "./../src";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "TextArea";
const name = "TextArea";
const value = "test";
afterEach(cleanup);

describe("Component => TextArea", () => {
  it("should render a TextArea", () => {
    const children = [
      <TextArea key="1" data-testid={dataTestid} name={name} />
    ];
    const { getByTestId } = mountForm({ children });
    expect(getByTestId(dataTestid).name).toBe(name);
  });

  it("should render a TextArea and changing its value", () => {
    const onChange = jest.fn();
    const props = { onChange };
    const children = [
      <TextArea key="1" data-testid={dataTestid} name={name} />
    ];
    const { getByTestId } = mountForm({ props, children });
    const textArea = getByTestId(dataTestid);
    fireEvent.change(textArea, { target: { value } });
    expect(onChange).toHaveBeenCalledWith({ [name]: value });
  });
});
