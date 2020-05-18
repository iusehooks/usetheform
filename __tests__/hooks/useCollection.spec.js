import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Form from "./../../src";

import CollectionWithHooks from "./../helpers/components/CollectionWithHooks";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const onInit = jest.fn(state => state);
const onChange = jest.fn();
afterEach(cleanup);

describe("Hooks => useCollection", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
  });
  it("should change Collection value due to an action", () => {
    const props = { onChange };
    const children = [<CollectionWithHooks key="1" />];
    const { getByTestId } = mountForm({ props, children });

    const changeCollection = getByTestId("changeCollection");
    fireEvent.click(changeCollection);
    expect(onChange).toHaveBeenCalledWith({ hook: { name: "foo" } });
  });

  it("should create a Collection with an initial value", () => {
    const props = { onInit };
    const children = [<CollectionWithHooks key="1" value={{ name: "test" }} />];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ hook: { name: "test" } });
  });

  it("should throw an error for invalids initial values", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const children = [
      <CollectionWithHooks key="1" type="array" value={{ name: "test" }} />
    ];
    expect(() => mountForm({ children })).toThrowError(
      /it is not allowed as initial value/i
    );
    console.error = originalError;
  });
});
