import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Reset from "./helpers/components/Reset";
import Form, { Select } from "./../src";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "select";
const name = "select";
const value = "test";

const onInit = jest.fn(state => state);
const onChange = jest.fn();
const onReset = jest.fn();

describe("Component => Select", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
  });

  it("should render a Select with an intial value", () => {
    const props = { onInit };
    const children = [
      <Select key="1" data-testid={dataTestid} name={name} value={value}>
        <option value="" />
        <option value={value}>{value}</option>
      </Select>
    ];
    const { getByTestId } = mountForm({ children, props });
    expect(getByTestId(dataTestid).name).toBe(name);
    expect(onInit).toHaveReturnedWith({ [name]: value });
  });

  it("should render a multiple Select with an intial value", () => {
    const props = { onInit };
    const children = [
      <Select
        key="1"
        multiple
        data-testid={dataTestid}
        name={name}
        value={["1", "2"]}
      >
        <option value="" />
        <option value="1">1</option>
        <option value="2">2</option>
      </Select>
    ];
    const { getByTestId } = mountForm({ children, props });
    expect(getByTestId(dataTestid).name).toBe(name);
    expect(onInit).toHaveReturnedWith({ [name]: ["1", "2"] });
  });

  it("should render a Select and changing its value", () => {
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

  it("should render a multiple Select and changing its value", () => {
    const props = { onChange };
    const children = [
      <Select key="1" multiple data-testid={dataTestid} name={name}>
        <option value="" />
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </Select>
    ];
    const { getByTestId } = mountForm({ props, children });

    const select = getByTestId(dataTestid);
    userEvent.selectOptions(select, ["1", "3"]);
    expect(onChange).toHaveBeenCalledWith({ [name]: ["1", "3"] });
  });

  it("should render a multiple Select with a inital value", () => {
    const initialState = { [name]: ["1", "2"] };
    const props = { onChange, onInit, initialState, onReset };
    const children = [
      <Select key="1" multiple data-testid={dataTestid} name={name}>
        <option value="" />
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </Select>,
      <Reset key="2" />
    ];
    const { getByTestId } = mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: ["1", "2"] });

    const select = getByTestId(dataTestid);
    userEvent.selectOptions(select, ["1", "2", "3", "4"]);
    expect(onChange).toHaveBeenCalledWith({ [name]: ["1", "2", "3", "4"] });

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({ [name]: ["1", "2"] });
  });

  it("should use a reducer to reduce the Select value", () => {
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
