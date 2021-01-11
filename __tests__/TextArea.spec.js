import React from "react";
import { fireEvent, cleanup, act } from "@testing-library/react";
import { mountForm } from "./helpers/utils/mountForm";
import { TextArea } from "./../src";

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
    expect(onChange).toHaveBeenCalledWith({ [name]: value }, true);
    expect(textArea.value).toBe(value);
  });

  it("should accept an innerRef prop to access to DOM", () => {
    const type = "textarea";
    const name = "foo";
    const ref = React.createRef();
    const children = [
      <TextArea key="1" innerRef={ref} name={name} value="1" />
    ];

    act(() => {
      mountForm({ children });
    });

    expect(ref.current).toBeDefined();
    expect(ref.current.type).toBe(type);
    expect(ref.current.value).toBe("1");
    expect(ref.current.name).toBe(name);
  });
});
