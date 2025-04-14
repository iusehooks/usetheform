import React from "react";
import { fireEvent, cleanup } from "@testing-library/react";
import { act } from "./helpers/utils/act";
import { userEvent } from "@testing-library/user-event";

import Reset from "./helpers/components/Reset";
import SelectSyncValidation from "./helpers/components/SelectSyncValidation";
import { mountForm } from "./helpers/utils/mountForm";

import { Select } from "./../src";

const dataTestid = "select";
const name = "select";
const value = "test";

const onInit = jest.fn(state => state);
const onChange = jest.fn();
const onReset = jest.fn();

afterEach(cleanup);

describe("Component => Select", () => {
  let userAction;

  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    userAction = userEvent.setup();
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
    const select = getByTestId(dataTestid);
    expect(select.name).toBe(name);
    expect(select.value).toBe(value);
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
    const select = getByTestId(dataTestid);
    expect(select.name).toBe(name);
    expect(onInit).toHaveReturnedWith({ [name]: ["1", "2"] });
    expect(select.selectedOptions.length).toBe(2);
    expect(select.selectedOptions[0].value).toBe("1");
    expect(select.selectedOptions[1].value).toBe("2");
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
    expect(onChange).toHaveBeenCalledWith({ [name]: value }, true);
    expect(select.value).toBe(value);
  });

  it("should render a multiple Select and changing its value", async () => {
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

    await act(async () => {
      await userAction.selectOptions(select, ["1", "3"]);
    });

    expect(onChange).toHaveBeenCalledWith({ [name]: ["1", "3"] }, true);
    expect(select.selectedOptions[0].value).toBe("1");
    expect(select.selectedOptions[1].value).toBe("3");
  });

  it("should render a multiple Select with a inital value", async () => {
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

    await act(async () => {
      await userAction.selectOptions(select, ["1", "2", "3", "4"]);
    });

    expect(onChange).toHaveBeenCalledWith(
      { [name]: ["1", "2", "3", "4"] },
      true
    );

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({ [name]: ["1", "2"] }, true);
  });

  it("should accept an innerRef prop to access to DOM", () => {
    const name = "test";
    const value = "1";
    const ref = React.createRef();
    const children = [
      <Select key="1" innerRef={ref} name={name} value={value}>
        <option value="" />
        <option value={value}>{value}</option>
      </Select>
    ];

    act(() => {
      mountForm({ children });
    });

    expect(ref.current).toBeDefined();
    expect(ref.current.value).toBe("1");
    expect(ref.current.name).toBe(name);
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

  it("should run sync validation on the single Select with touched prop true", async () => {
    const children = [
      <SelectSyncValidation touched={true} key="1" />,
      <Reset key="2" />
    ];
    const { getByTestId } = mountForm({ children });
    const select = getByTestId("select");

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      select.focus();
      select.blur();
    });

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    await act(async () => {
      await userAction.selectOptions(select, ["1"]);
      select.blur();
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(() => getByTestId("errorLabel")).toThrow();
  });

  it("should run sync validation on the multiple Select with touched prop true", async () => {
    const children = [
      <SelectSyncValidation multiple touched={true} key="1" />,
      <Reset key="2" />
    ];
    const { getByTestId } = mountForm({ children });
    const select = getByTestId("select");
    const remove = getByTestId("remove");

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      select.focus();
      select.blur();
    });

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    await act(async () => {
      await userEvent.selectOptions(select, ["1"]);
      select.blur();
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      select.focus();
      select.blur();
    });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    act(() => {
      fireEvent.click(remove);
    });
    expect(() => getByTestId("errorLabel")).toThrow();
  });

  it("should run sync validation on the single Select with touched prop false", async () => {
    const children = [
      <SelectSyncValidation touched={false} key="1" />,
      <Reset key="2" />
    ];
    const { getByTestId } = mountForm({ children });
    const select = getByTestId("select");

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    await act(async () => {
      await userAction.selectOptions(select, ["1"]);
      select.blur();
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    const reset = getByTestId("reset");
    act(() => {
      fireEvent.click(reset);
    });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    const remove = getByTestId("remove");
    act(() => {
      fireEvent.click(remove);
    });
    expect(() => getByTestId("errorLabel")).toThrow();
  });

  it("should run sync validation on the multiple Select with touched prop false", async () => {
    const children = [
      <SelectSyncValidation multiple={true} touched={false} key="1" />,
      <Reset key="2" />
    ];
    const { getByTestId } = mountForm({ children });
    const select = getByTestId("select");

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    await act(async () => {
      await userEvent.selectOptions(select, ["1"]);
      select.blur();
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    const reset = getByTestId("reset");
    act(() => {
      fireEvent.click(reset);
    });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    const remove = getByTestId("remove");
    act(() => {
      fireEvent.click(remove);
    });
    expect(() => getByTestId("errorLabel")).toThrow();
  });
});
