import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Form, { Select } from "./../src";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "select";
const name = "select";
const value = "test";

describe("Component => Select", () => {
  it("should render a Select", () => {
    const children = [
      <Select key="1" data-testid={dataTestid} name={name}>
        <option value="" />
        <option value={value}>{value}</option>
      </Select>
    ];
    const { getByTestId } = mountForm({ children });
    expect(getByTestId(dataTestid).name).toBe(name);
  });

  it("should render a Select and changing its value", () => {
    const onChange = jest.fn();
    const props = { onChange };
    const children = [
      <Select key="1" data-testid={dataTestid} name={name}>
        <option value="" />
        <option value={value}>{value}</option>
      </Select>
    ];
    const { getByTestId } = mountForm({ props, children });
    const select = getByTestId(dataTestid);
    fireEvent.change(select, { target: { value } });
    expect(onChange).toHaveBeenCalledWith({ [name]: value });
  });

  it("should use a reducer to reduce the Select value", () => {
    const onInit = jest.fn(state => state);
    const props = { onInit };
    const reducer = value => value + 2;
    const value = 1;
    const name = "test";
    const children = [
      <Select
        key="1"
        data-testid={dataTestid}
        name={name}
        reducers={reducer}
        value={value}
      >
        <option value="" />
        <option value={value}>{value}</option>
      </Select>
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: 3 });
  });
});
