import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Form, { Collection } from "./../../src";

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
    const children = [
      <CollectionWithHooks key="1" name="test" propToChange="lastname" />
    ];
    const { getByTestId } = mountForm({ props, children });

    const changeCollection = getByTestId("changeCollection");
    fireEvent.click(changeCollection);
    expect(onChange).toHaveBeenCalledWith({ test: { lastname: "foo" } });
  });

  it("should create a Collection with an initial value", () => {
    const props = { onInit };
    const children = [
      <CollectionWithHooks key="1" name="test" value={{ name: "foo" }} />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ test: { name: "foo" } });
  });

  it("should create a nested Collection with an initial value", () => {
    const props = { onInit };
    const children = [
      <Collection
        array
        name="array"
        key="1"
        value={[{ name: "foo" }, { lastname: "foo" }]}
      >
        <CollectionWithHooks />
        <CollectionWithHooks />
      </Collection>
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({
      array: [{ name: "foo" }, { lastname: "foo" }]
    });
  });

  it("should change a nested Collection value due to an action", () => {
    const props = { onChange };
    const children = [
      <Collection array name="array" key="1">
        <CollectionWithHooks propToChange="0" dataTestid="hook1" />
        <CollectionWithHooks propToChange="1" dataTestid="hook2" />
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const changeCollectionHook1 = getByTestId("hook1");
    fireEvent.click(changeCollectionHook1);
    expect(onChange).toHaveBeenCalledWith({ array: [{ 0: "foo" }] });

    onChange.mockClear();
    const changeCollectionHook2 = getByTestId("hook2");
    fireEvent.click(changeCollectionHook2);
    expect(onChange).toHaveBeenCalledWith({
      array: [{ 0: "foo" }, { 1: "foo" }]
    });
  });

  it("should throw an error for invalids initial values", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const children = [
      <CollectionWithHooks
        name="test"
        key="1"
        type="array"
        value={{ test: "test" }}
      />
    ];
    expect(() => mountForm({ children })).toThrowError(
      /it is not allowed as initial value/i
    );
    console.error = originalError;
  });
});
