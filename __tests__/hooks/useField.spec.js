import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Form, { Collection, useField, withIndex } from "./../../src";

const InputCustom = withIndex(({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
});

const InputCustomNoAutoIndex = ({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
};

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const onInit = jest.fn(state => state);
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
    expect(onChange).toHaveBeenCalledWith({ array: ["50"] });

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(input2.value).toBe("60");
    expect(onChange).toHaveBeenCalledWith({ array: ["50", "60"] });
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
    expect(onChange).toHaveBeenCalledWith({ array: [["50"]] });

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith({ array: [["50", "60"]] });
    expect(input2.value).toBe("60");

    onChange.mockClear();
    fireEvent.change(input3, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith({
      array: [["50", "60"], [["hello"]]]
    });
    expect(input3.value).toBe("hello");

    onChange.mockClear();
    fireEvent.change(input4, { target: { value: "world" } });
    expect(onChange).toHaveBeenCalledWith({
      array: [["50", "60"], [["hello", "world"]]]
    });
    expect(input4.value).toBe("world");
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

    expect(onInit).toHaveReturnedWith({ object: initialValue });

    onChange.mockClear();
    fireEvent.change(input1, { target: { value: "50" } });
    expect(input1.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith({
      object: { array: [[["50", "200"]]] }
    });

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(input2.value).toBe("60");
    expect(onChange).toHaveBeenCalledWith({
      object: { array: [[["50", "60"]]] }
    });
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
    expect(onChange).toHaveBeenCalledWith({ array: [["50"]] });

    onChange.mockClear();
    fireEvent.change(input2, { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith({ array: [["50", "60"]] });
    expect(input2.value).toBe("60");

    onChange.mockClear();
    fireEvent.change(input3, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith({
      array: [["50", "60"], [["hello"]]]
    });
    expect(input3.value).toBe("hello");

    onChange.mockClear();
    fireEvent.change(input4, { target: { value: "world" } });
    expect(onChange).toHaveBeenCalledWith({
      array: [["50", "60"], [["hello", "world"]]]
    });
    expect(input4.value).toBe("world");
  });
});
