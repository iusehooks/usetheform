import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { act } from "./helpers/utils/act";

import {
  PersistStateOnUnmountHelpers,
  initialState
} from "./helpers/components/PersistStateOnUnmountHelpers";

const onInit = jest.fn();
const onChange = jest.fn();
const onReset = jest.fn();
const onSubmit = jest.fn();

afterEach(cleanup);

describe("Component => PersistStateOnUnmount", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should Collection state persist on unmonuted", () => {
    const stateExpected = {
      ...initialState,
      user: { ...initialState.user, lastname: "hero" }
    };
    const props = { onInit, onChange };
    const { getByTestId } = render(<PersistStateOnUnmountHelpers {...props} />);

    const toggleCollection = getByTestId("toggleCollection");
    const lastName = getByTestId("lastname");
    expect(onInit).toHaveBeenCalledWith(initialState, true);

    act(() => {
      fireEvent.change(lastName, { target: { value: "hero" } });
    });

    act(() => {
      fireEvent.click(toggleCollection);
    });

    expect(onChange).toHaveBeenCalledWith(stateExpected, true);

    const togglekeepValue = getByTestId("togglekeepValue");

    act(() => {
      fireEvent.click(togglekeepValue);
    });

    expect(onChange).toHaveBeenCalledWith(stateExpected, true);
  });

  it("should Checkbox state persist on unmonuted", () => {
    const stateExpected = { ...initialState, other: [, "3"] };
    const props = { onInit, onChange };
    const { getByTestId } = render(<PersistStateOnUnmountHelpers {...props} />);

    const toggleNestedInput = getByTestId("toggleNestedInput");
    const other1 = getByTestId("other1");
    expect(onInit).toHaveBeenCalledWith(initialState, true);

    act(() => {
      fireEvent.click(other1);
    });

    expect(onChange).toHaveBeenCalledWith(stateExpected, true);

    act(() => {
      fireEvent.click(other1);
    });

    act(() => {
      fireEvent.click(toggleNestedInput);
    });

    expect(onChange).toHaveBeenCalledWith(initialState, true);
  });

  it("should Radio state persist on unmonuted", () => {
    const stateExpected = { ...initialState, gender: "M" };
    const props = { onInit, onChange };
    const { getByTestId } = render(<PersistStateOnUnmountHelpers {...props} />);

    const toggleNestedRadio = getByTestId("toggleNestedRadio");
    const genderm = getByTestId("genderm");
    expect(onInit).toHaveBeenCalledWith(initialState, true);

    act(() => {
      fireEvent.click(genderm);
    });

    act(() => {
      fireEvent.click(toggleNestedRadio);
    });

    expect(onChange).toHaveBeenCalledWith(stateExpected, true);
  });

  it("should Select state persist on unmonuted", () => {
    const stateExpected = { ...initialState, select: "2" };
    const props = { onInit, onChange };
    const { getByTestId } = render(<PersistStateOnUnmountHelpers {...props} />);

    const toggleSelect = getByTestId("toggleSelect");
    const select = getByTestId("select");
    expect(onInit).toHaveBeenCalledWith(initialState, true);

    act(() => {
      fireEvent.change(select, { target: { value: "2" } });
    });

    act(() => {
      fireEvent.click(toggleSelect);
    });

    expect(onChange).toHaveBeenCalledWith(stateExpected, true);
  });
});
