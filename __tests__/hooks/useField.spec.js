import React from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { Form, Collection, useField, withIndex } from "./../../src";

const InputCustom = withIndex(({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
});

const CustomField = withIndex(({ name, value, ...restAttr }) => {
  const props = useField({ type: "custom", name, value });
  const onChange = () => props.onChange({ target: { value: "5" } });
  return (
    <button type="button" onClick={onChange} {...restAttr}>
      Change Value
    </button>
  );
});

const InputCustomNoAutoIndex = ({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
};

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const onInit = jest.fn();
const onChange = jest.fn();
afterEach(cleanup);

describe("Hooks => useField", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
  });

  it("should change a Field value due to an action", () => {
    const props = { onChange };
    const children = [
      <InputCustomNoAutoIndex
        type="text"
        key="1"
        data-testid="input1"
        name="number"
        value="2"
      />,
      <InputCustom
        type="text"
        key="2"
        data-testid="input2"
        name="number2"
        value="4"
      />
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    onChange.mockClear();
    fireEvent.change(input1, { target: { value: "50" } });
    expect(input1.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith({ number: "50", number2: "4" }, true);

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "5" } });
    expect(input2.value).toBe("5");
    expect(onChange).toHaveBeenCalledWith({ number: "50", number2: "5" }, true);
  });

  it("should render a Field of type custom with an initial value", () => {
    const name = "custom";
    const props = { onInit, onChange };
    const initial = { a: "test" };

    const children = [
      <CustomField key="1" data-testid={name} name={name} value={initial} />
    ];
    const { getByTestId } = mountForm({ children, props });
    expect(onInit).toHaveBeenCalledWith({ [name]: initial }, true);

    const custom = getByTestId("custom");
    act(() => {
      fireEvent.click(custom);
    });

    expect(onChange).toHaveBeenCalledWith({ [name]: "5" }, true);
  });

  it("should change a Field value due to an action", () => {
    const props = { onChange };
    const children = [
      <Collection array key="1" name="array">
        <InputCustom type="text" data-testid="input1" />
        <InputCustom type="text" data-testid="input2" />
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    onChange.mockClear();
    fireEvent.change(input1, { target: { value: "50" } });
    expect(input1.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith({ array: ["50"] }, true);

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(input2.value).toBe("60");
    expect(onChange).toHaveBeenCalledWith({ array: ["50", "60"] }, true);
  });

  it("should nest Fields into array Collection", () => {
    const props = { onChange };
    const children = [
      <Collection array key="1" name="array">
        <Collection array>
          <InputCustom type="text" data-testid="input1" />
          <InputCustom type="text" data-testid="input2" />
        </Collection>
        <Collection array>
          <Collection array>
            <InputCustom type="text" data-testid="input3" />
            <InputCustom type="text" data-testid="input4" />
          </Collection>
        </Collection>
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    const input3 = getByTestId("input3");
    const input4 = getByTestId("input4");

    onChange.mockClear();
    fireEvent.change(input1, { target: { value: "50" } });
    expect(input1.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith({ array: [["50"]] }, true);

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith({ array: [["50", "60"]] }, true);
    expect(input2.value).toBe("60");

    onChange.mockClear();
    fireEvent.change(input3, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["50", "60"], [["hello"]]]
      },
      true
    );
    expect(input3.value).toBe("hello");

    onChange.mockClear();
    fireEvent.change(input4, { target: { value: "world" } });
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["50", "60"], [["hello", "world"]]]
      },
      true
    );
    expect(input4.value).toBe("world");
  });

  it("should nest Checkboxes into array Collection", () => {
    const props = { onChange };
    const children = [
      <Collection array key="1" name="array">
        <Collection array>
          <InputCustom type="checkbox" value="blue" data-testid="input1" />
          <InputCustom type="checkbox" value="green" data-testid="input2" />
        </Collection>
        <Collection array>
          <Collection array>
            <InputCustom type="checkbox" value="yellow" data-testid="input3" />
            <InputCustom type="checkbox" data-testid="input4" />
          </Collection>
        </Collection>
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    const input3 = getByTestId("input3");
    const input4 = getByTestId("input4");

    onChange.mockClear();
    fireEvent.click(input1);
    expect(input1.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith({ array: [["blue"]] }, true);

    onChange.mockClear();
    fireEvent.click(input2);
    expect(input2.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith({ array: [["blue", "green"]] }, true);

    onChange.mockClear();
    fireEvent.click(input3);
    expect(input3.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["blue", "green"], [["yellow"]]]
      },
      true
    );

    onChange.mockClear();
    fireEvent.click(input4);
    expect(input4.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["blue", "green"], [["yellow", true]]]
      },
      true
    );
  });

  it("should nest Radios into array Collection", () => {
    const props = { onChange };
    const children = [
      <Collection array key="1" name="array">
        <Collection array>
          <InputCustom type="radio" value="blue" data-testid="input1" />
        </Collection>
        <Collection array>
          <Collection array>
            <InputCustom type="radio" value="yellow" data-testid="input2" />
          </Collection>
        </Collection>
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    onChange.mockClear();
    fireEvent.click(input1);
    expect(input1.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith({ array: [["blue"]] }, true);

    onChange.mockClear();
    fireEvent.click(input2);
    expect(input2.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["blue"], [["yellow"]]]
      },
      true
    );
  });

  it("should nest Fields into object Collection", () => {
    const props = { onChange, onInit };
    const initialValue = { array: [[["100", "200"]]] };
    const children = [
      <Collection object name="object" key="1" value={initialValue}>
        <Collection array name="array">
          <Collection array>
            <Collection array>
              <InputCustom type="text" data-testid="input1" />
              <InputCustom type="text" data-testid="input2" />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    expect(onInit).toHaveBeenCalledWith({ object: initialValue }, true);

    onChange.mockClear();
    fireEvent.change(input1, { target: { value: "50" } });
    expect(input1.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith(
      {
        object: { array: [[["50", "200"]]] }
      },
      true
    );

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(input2.value).toBe("60");
    expect(onChange).toHaveBeenCalledWith(
      {
        object: { array: [[["50", "60"]]] }
      },
      true
    );
  });

  it("should nest Fields into array Collection with a given index", () => {
    const props = { onChange };
    const children = [
      <Collection array key="1" name="array">
        <Collection array>
          <InputCustomNoAutoIndex type="text" index="0" data-testid="input1" />
          <InputCustomNoAutoIndex type="text" index="1" data-testid="input2" />
        </Collection>
        <Collection array>
          <Collection array>
            <InputCustomNoAutoIndex
              type="text"
              index="0"
              data-testid="input3"
            />
            <InputCustomNoAutoIndex
              type="text"
              index="1"
              data-testid="input4"
            />
          </Collection>
        </Collection>
      </Collection>
    ];
    const { getByTestId } = mountForm({ props, children });

    const input1 = getByTestId("input1");
    const input2 = getByTestId("input2");

    const input3 = getByTestId("input3");
    const input4 = getByTestId("input4");

    onChange.mockClear();
    fireEvent.change(input1, { target: { value: "50" } });
    expect(input1.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith({ array: [["50"]] }, true);

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith({ array: [["50", "60"]] }, true);
    expect(input2.value).toBe("60");

    onChange.mockClear();
    fireEvent.change(input3, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["50", "60"], [["hello"]]]
      },
      true
    );
    expect(input3.value).toBe("hello");

    onChange.mockClear();
    fireEvent.change(input4, { target: { value: "world" } });
    expect(onChange).toHaveBeenCalledWith(
      {
        array: [["50", "60"], [["hello", "world"]]]
      },
      true
    );
    expect(input4.value).toBe("world");
  });
});
