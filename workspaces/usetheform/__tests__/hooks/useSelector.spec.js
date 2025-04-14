import React from "react";
import { fireEvent, cleanup } from "@testing-library/react";
import { act } from "./../helpers/utils/act";
import { CmpWithSelectorToggle } from "./../helpers/components/CmpWithSelectorToggle";
import { Input, Collection } from "./../../src";
import Reset from "./../helpers/components/Reset";
import { mountForm } from "./../helpers/utils/mountForm";
import { InputCustom } from "./../helpers/components/InputCustom";

const onReset = jest.fn();
const onChange = jest.fn();
afterEach(cleanup);

describe("Hooks => useSelector", () => {
  beforeEach(() => {
    onReset.mockClear();
    onChange.mockClear();
  });

  it("should use a selector function for listening to any Input value changes", () => {
    const props = { onChange, onReset };
    const selectorFN = state => state.number;
    const setNewValue = prev => `${++prev}`;
    const newValue = "0";

    const children = [
      <Input type="text" key="1" data-testid="input" name="number" value="2" />,
      <CmpWithSelectorToggle
        key="2"
        selector={selectorFN}
        setNewValue={setNewValue}
      />,
      <CmpWithSelectorToggle
        key="3"
        id="1"
        selector={selectorFN}
        setNewValue={newValue}
      />,
      <Reset key="4" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const reset = getByTestId("reset");

    const input = getByTestId("input");
    let selector = getByTestId("selector");
    let selectorBtn = getByTestId("selectorBtn");
    const toggleBtn = getByTestId("toggle");

    fireEvent.change(input, { target: { value: "50" } });

    expect(input.value).toBe("50");
    expect(selector.innerHTML).toBe("50");
    expect(onChange).toHaveBeenCalledWith({ number: "50" }, true);

    act(() => {
      fireEvent.click(selectorBtn);
    });

    expect(onChange).toHaveBeenCalledWith({ number: "51" }, true);
    expect(input.value).toBe("51");
    expect(selector.innerHTML).toBe("51");

    act(() => {
      fireEvent.click(toggleBtn);
      fireEvent.click(toggleBtn);
    });

    selector = getByTestId("selector");
    selectorBtn = getByTestId("selectorBtn");

    expect(selector.innerHTML).toBe("51");

    act(() => {
      fireEvent.click(selectorBtn);
    });
    expect(onChange).toHaveBeenCalledWith({ number: "52" }, true);
    expect(selector.innerHTML).toBe("52");

    const selectorBtn1 = getByTestId("selectorBtn1");
    const selector1 = getByTestId("selector1");
    act(() => {
      fireEvent.click(selectorBtn1);
    });

    expect(onChange).toHaveBeenCalledWith({ number: "0" }, true);
    expect(selector1.innerHTML).toBe("0");

    act(() => {
      fireEvent.click(reset);
    });
    expect(onReset).toHaveBeenCalledWith({ number: "2" }, true);
  });

  it("should use a selector function for listening to any object Collection value changes", () => {
    const props = { onChange, onReset };
    const selectorFN = state => state.object;
    const setNewValue = prev => ({ ...prev, number: `${++prev.number}` });
    const newValue = { number: "0" };

    const children = [
      <Collection name="object" object key="1">
        <Input type="text" data-testid="input" name="number" value="2" />
      </Collection>,
      <CmpWithSelectorToggle
        key="2"
        selector={selectorFN}
        setNewValue={setNewValue}
      />,
      <CmpWithSelectorToggle
        key="3"
        id="1"
        selector={selectorFN}
        setNewValue={newValue}
      />,
      <Reset key="4" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const reset = getByTestId("reset");
    const input = getByTestId("input");
    let selector = getByTestId("selector");
    let selectorBtn = getByTestId("selectorBtn");
    const toggleBtn = getByTestId("toggle");

    fireEvent.change(input, { target: { value: "50" } });

    expect(input.value).toBe("50");
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "50" }));
    expect(onChange).toHaveBeenCalledWith({ object: { number: "50" } }, true);

    act(() => {
      fireEvent.click(selectorBtn);
    });

    expect(onChange).toHaveBeenCalledWith({ object: { number: "51" } }, true);
    expect(input.value).toBe("51");
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "51" }));

    act(() => {
      fireEvent.click(toggleBtn);
      fireEvent.click(toggleBtn);
    });

    selector = getByTestId("selector");
    selectorBtn = getByTestId("selectorBtn");

    expect(selector.innerHTML).toBe(JSON.stringify({ number: "51" }));

    act(() => {
      fireEvent.click(selectorBtn);
    });
    expect(onChange).toHaveBeenCalledWith({ object: { number: "52" } }, true);
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "52" }));

    const selectorBtn1 = getByTestId("selectorBtn1");
    const selector1 = getByTestId("selector1");
    act(() => {
      fireEvent.click(selectorBtn1);
    });

    expect(onChange).toHaveBeenCalledWith({ object: { number: "0" } }, true);
    expect(selector1.innerHTML).toBe(JSON.stringify({ number: "0" }));

    act(() => {
      fireEvent.click(reset);
    });
    expect(onReset).toHaveBeenCalledWith({ object: { number: "2" } }, true);
  });

  it("should use a selector function for listening to any array Collection value changes", () => {
    const props = { onChange, onReset };
    const selectorFN = state => state.array;
    const setNewValue = prev => [`${++prev[0]}`];
    const newValue = ["0"];

    const children = [
      <Collection name="array" array key="1">
        <InputCustom type="text" data-testid="input" value="2" />
      </Collection>,
      <CmpWithSelectorToggle
        key="2"
        selector={selectorFN}
        setNewValue={setNewValue}
      />,
      <CmpWithSelectorToggle
        key="3"
        id="1"
        selector={selectorFN}
        setNewValue={newValue}
      />,
      <Reset key="4" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const reset = getByTestId("reset");
    const input = getByTestId("input");
    let selector = getByTestId("selector");
    let selectorBtn = getByTestId("selectorBtn");
    const toggleBtn = getByTestId("toggle");

    fireEvent.change(input, { target: { value: "50" } });

    expect(input.value).toBe("50");
    expect(selector.innerHTML).toBe(JSON.stringify(["50"]));
    expect(onChange).toHaveBeenCalledWith({ array: ["50"] }, true);

    act(() => {
      fireEvent.click(selectorBtn);
    });

    expect(onChange).toHaveBeenCalledWith({ array: ["51"] }, true);
    expect(input.value).toBe("51");
    expect(selector.innerHTML).toBe(JSON.stringify(["51"]));

    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(() => getByTestId("selector")).toThrow();
    expect(() => getByTestId("selectorBtn")).toThrow();

    act(() => {
      fireEvent.click(toggleBtn);
    });

    selector = getByTestId("selector");
    selectorBtn = getByTestId("selectorBtn");

    expect(selector.innerHTML).toBe(JSON.stringify(["51"]));

    act(() => {
      fireEvent.click(selectorBtn);
    });
    expect(onChange).toHaveBeenCalledWith({ array: ["52"] }, true);
    expect(selector.innerHTML).toBe(JSON.stringify(["52"]));

    const selectorBtn1 = getByTestId("selectorBtn1");
    const selector1 = getByTestId("selector1");
    act(() => {
      fireEvent.click(selectorBtn1);
    });

    expect(onChange).toHaveBeenCalledWith({ array: ["0"] }, true);
    expect(selector1.innerHTML).toBe(JSON.stringify(["0"]));

    act(() => {
      fireEvent.click(reset);
    });
    expect(onReset).toHaveBeenCalledWith({ array: ["2"] }, true);
  });

  it("should use a selector function for listening to any nested Collection value changes", () => {
    const props = { onChange, onReset };
    const selectorFN = state => state.array[0];
    const setNewValue = prev => ({ number: `${++prev.number}` });

    const netesteInput = state => state.array[1][0][0];
    const newValue = "0";

    const children = [
      <Collection name="array" array key="1">
        <Collection object>
          <InputCustom
            type="text"
            data-testid="input"
            name="number"
            value="2"
          />
        </Collection>
        <Collection array>
          <Collection array>
            <InputCustom type="text" value="3" />
          </Collection>
        </Collection>
      </Collection>,
      <CmpWithSelectorToggle
        key="2"
        selector={selectorFN}
        setNewValue={setNewValue}
      />,
      <CmpWithSelectorToggle
        key="3"
        id="1"
        selector={netesteInput}
        setNewValue={newValue}
      />,
      <Reset key="4" />
    ];
    const { getByTestId } = mountForm({ props, children });
    const reset = getByTestId("reset");

    const input = getByTestId("input");
    let selector = getByTestId("selector");
    let selectorBtn = getByTestId("selectorBtn");
    const toggleBtn = getByTestId("toggle");

    fireEvent.change(input, { target: { value: "50" } });

    expect(input.value).toBe("50");
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "50" }));
    expect(onChange).toHaveBeenCalledWith(
      { array: [{ number: "50" }, [["3"]]] },
      true
    );

    act(() => {
      fireEvent.click(selectorBtn);
    });

    expect(onChange).toHaveBeenCalledWith(
      { array: [{ number: "51" }, [["3"]]] },
      true
    );
    expect(input.value).toBe("51");
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "51" }));

    act(() => {
      fireEvent.click(toggleBtn); // hide
    });

    expect(() => getByTestId("selector")).toThrow();
    expect(() => getByTestId("selectorBtn")).toThrow();

    act(() => {
      fireEvent.click(toggleBtn); // show again
    });

    selector = getByTestId("selector");
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "51" }));
    selectorBtn = getByTestId("selectorBtn");
    act(() => {
      fireEvent.click(selectorBtn);
    });

    expect(onChange).toHaveBeenCalledWith(
      { array: [{ number: "52" }, [["3"]]] },
      true
    );
    expect(selector.innerHTML).toBe(JSON.stringify({ number: "52" }));

    const selectorBtn1 = getByTestId("selectorBtn1");
    const selector1 = getByTestId("selector1");
    act(() => {
      fireEvent.click(selectorBtn1);
    });

    expect(onChange).toHaveBeenCalledWith(
      { array: [{ number: "52" }, [["0"]]] },
      true
    );
    expect(selector1.innerHTML).toBe("0");

    act(() => {
      fireEvent.click(reset);
    });

    expect(onReset).toHaveBeenCalledWith(
      { array: [{ number: "2" }, [["3"]]] },
      true
    );
  });
});
