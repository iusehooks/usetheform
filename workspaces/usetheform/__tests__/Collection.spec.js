import React from "react";
import { fireEvent, waitFor, cleanup } from "@testing-library/react";
import { act } from "./helpers/utils/act";

import { Input, Collection } from "./../src";

import {
  CollectionDynamicCart,
  CollectionObjectDynamicField
} from "./helpers/components/CollectionDynamicField";
import CollectionDynamicAdded from "./helpers/components/CollectionDynamicAdded";
import CollectionInputAsyncDynamicAdded from "./helpers/components/CollectionInputAsyncDynamicAdded";
import CollectionValidation, {
  CollectionValidationTouched
} from "./helpers/components/CollectionValidation";
import CollectionAsyncValidation from "./helpers/components/CollectionAsyncValidation";
import CollectionArrayNested, {
  initialValue as initialValueNested,
  expectedValueArrayNested,
  CollectionArrayNestedValue,
  reducerArrayNested,
  expectedValueArrayNestedReduced
} from "./helpers/components/CollectionArrayNested";
import CollectionObjectNested, {
  initialValue as initialValueObjNested,
  expectedValueObjNested,
  CollectionObjectNestedValue,
  reducerObjectNested
} from "./helpers/components/CollectionObjectNested";

import Reset from "./helpers/components/Reset";
import Submit from "./helpers/components/Submit";
import AgeRange from "./helpers/components/AgeRange";
import { mountForm } from "./helpers/utils/mountForm";

const dataTestid = "username";
const name = "user";
const userName = "username";
const typeInput = "text";

const onInit = jest.fn();
const onChange = jest.fn();
const onReset = jest.fn();
const onSubmit = jest.fn();

afterEach(cleanup);

describe("Component => Collection", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should render a Collection of type object with an inial value", () => {
    const props = { onInit };
    const value = "foo";
    const children = [
      <Collection key="1" name={name}>
        <Input
          data-testid={dataTestid}
          type={typeInput}
          name={userName}
          value={value}
        />
      </Collection>
    ];
    mountForm({ props, children });

    expect(onInit).toHaveBeenCalledWith(
      { [name]: { [userName]: value } },
      true
    );
  });

  it("should render a Collection of type array with an inial value", () => {
    const props = { onInit };
    const value = "foo";

    const children = [
      <Collection key="1" array name={name}>
        <Input data-testid={dataTestid} type={typeInput} value={value} />
      </Collection>
    ];
    mountForm({ props, children });

    expect(onInit).toHaveBeenCalledWith({ [name]: [value] }, true);
  });

  it("should apply reducer functions to reduce the Collection value", () => {
    const props = { onChange, onInit };
    const children = [<AgeRange key="1" />];

    const { getByTestId } = mountForm({ props, children });
    const start = getByTestId("start");
    const end = getByTestId("end");

    expect(onInit).toHaveBeenCalledWith(
      { ageRange: { start: 18, end: 65 } },
      true
    );

    onChange.mockClear();
    fireEvent.change(start, { target: { value: 50 } });
    fireEvent.change(end, { target: { value: 80 } });
    expect(onChange).toHaveBeenCalledWith(
      { ageRange: { start: 50, end: 80 } },
      true
    );

    onChange.mockClear();
    fireEvent.change(start, { target: { value: 81 } });
    fireEvent.change(end, { target: { value: 80 } });
    expect(onChange).toHaveBeenCalledWith(
      { ageRange: { start: 80, end: 80 } },
      true
    );

    onChange.mockClear();
    fireEvent.change(start, { target: { value: 18 } });
    fireEvent.change(end, { target: { value: 90 } });
    expect(onChange).toHaveBeenCalledWith(
      { ageRange: { start: 18, end: 90 } },
      true
    );

    onChange.mockClear();
    fireEvent.change(start, { target: { value: 18 } });
    fireEvent.change(end, { target: { value: 16 } });
    expect(onChange).toHaveBeenCalledWith(
      { ageRange: { start: 18, end: 18 } },
      true
    );
  });

  it("should add/remove collection dynamically and reset the errors message validation to the proper value", async () => {
    const children = [<CollectionDynamicAdded key="1" />, <Reset key="2" />];
    const { getByTestId, getAllByTestId } = mountForm({ children });

    const addCollection = getByTestId("addCollection");
    const removeCollection = getByTestId("removeCollection");

    // no error initially
    expect(() => getByTestId("errorLabel")).toThrow();
    expect(() => getByTestId("errorLabelCollection")).toThrow();

    fireEvent.click(addCollection);

    let input_1 = getByTestId("input1");
    fireEvent.change(input_1, { target: { value: "ab" } });

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    // Collection has touched = true
    act(() => {
      input_1.focus();
      input_1.blur();
    });
    let errorLabelCollection = getByTestId("errorLabelCollection");
    expect(errorLabelCollection).toBeDefined();

    fireEvent.click(removeCollection);
    expect(() => getAllByTestId("errorLabel")).toThrow();
    expect(() => getByTestId("errorLabelCollection")).toThrow();

    fireEvent.click(addCollection);
    let input_2 = getByTestId("input2");
    fireEvent.change(input_2, { target: { value: "3" } });
    expect(() => getByTestId("errorLabel")).toThrow();

    // Collection has touched = true
    act(() => {
      input_2.focus();
      input_2.blur();
    });

    expect(() => getByTestId("errorLabelCollection")).toThrow();
  });

  it("should trigger validation when touched prop is true and only if any of its children is touched at any nested level", async () => {
    const children = [
      <CollectionValidationTouched key="1" />,
      <Reset key="2" />
    ];
    const { getByTestId, getAllByTestId } = mountForm({ children });

    const addMember = getByTestId("addMember");
    fireEvent.click(addMember);

    let member = getByTestId("member_name");

    expect(() => getAllByTestId("errorLabel")).toThrow();
    fireEvent.change(member, { target: { value: "Foo" } });
    expect(() => getAllByTestId("errorLabel")).toThrow();

    // Collection has touched = true
    act(() => {
      member.focus();
      member.blur();
    });

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();

    fireEvent.click(addMember);

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(() => getAllByTestId("member")).toThrow();
    expect(() => getAllByTestId("errorLabel")).toThrow();

    fireEvent.click(addMember);
    member = getByTestId("member_name");

    // Collection has touched = true
    act(() => {
      member.focus();
      member.blur();
    });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();
  });

  it("should show an error label if Collection is not valid due to sync validator", () => {
    const children = [
      <CollectionValidation key="1" />,
      <Submit forceEnable key="2" />
    ];
    const { getByTestId } = mountForm({ children });
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    const errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();
  });

  it("should trigger onChange, onInit, onReset with flag 'isValid' false if Collection is not valid due to sync validator", () => {
    const props = { onChange, onInit: jest.fn(), onReset };
    const validator = val => (val && val === "Antonio" ? undefined : "error");
    const children = [
      <Collection name="user" object key="1">
        <Input
          type="text"
          validators={[validator]}
          name="name"
          data-testid="name"
        />
      </Collection>,
      <Reset key="2" />,
      <Submit forceEnable key="3" />
    ];
    const { getByTestId } = mountForm({ children, props });
    const name = getByTestId("name");
    const reset = getByTestId("reset");

    expect(props.onInit).toHaveBeenCalledWith({}, false);

    fireEvent.change(name, { target: { value: "Toto" } });
    expect(onChange).toHaveBeenCalledWith({ user: { name: "Toto" } }, false);

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({}, false);
  });

  it("should reset the Collection state", () => {
    const children = [<CollectionValidation key="1" />, <Reset key="3" />];
    const { getByTestId, getAllByTestId } = mountForm({ children });

    const addMember = getByTestId("addMember");
    fireEvent.click(addMember);
    fireEvent.click(addMember);

    let members = getAllByTestId("member");
    expect(members.length).toBe(2);

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(() => getAllByTestId("member")).toThrow();
  });

  it("should reset a Collection with to the given initial value", () => {
    const initalValue = { name: "test" };
    const props = { onReset, onChange };
    const children = [
      <Collection key="1" object name="user" value={initalValue}>
        <Input data-testid="user" name="name" type="text" />
      </Collection>,
      <Reset key="3" />
    ];

    const { getByTestId } = mountForm({ props, children });
    const user = getByTestId("user");
    fireEvent.change(user, { target: { value: "foo" } });
    expect(onChange).toHaveBeenCalledWith({ user: { name: "foo" } }, true);

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith({ user: { name: "test" } }, true);
  });

  it("should reduce a Collection of type object value with the given reducer function", () => {
    const initalValue = { name: "test" };
    const props = { onInit };
    const reducer = jest.fn(state => {
      const newState = { ...state };
      if (newState.name !== "mickey") newState.name = "foo";
      return newState;
    });

    const jestReducer = jest.fn();
    const reducerN = (state, prevState) => {
      jestReducer(state, prevState);
      return state;
    };

    const children = [
      <Collection
        reducers={[reducer, reducerN]}
        key="1"
        object
        name="user"
        value={initalValue}
      >
        <Input data-testid="user" name="name" type="text" />
      </Collection>
    ];

    const { getByTestId } = mountForm({ props, children });
    expect(jestReducer).toHaveBeenCalledWith({ name: "foo" }, {});

    expect(onInit).toHaveBeenCalledWith({ user: { name: "foo" } }, true);

    jestReducer.mockReset();
    const user = getByTestId("user");
    fireEvent.change(user, { target: { value: "mickey" } });
    expect(jestReducer).toHaveBeenCalledWith(
      { name: "mickey" },
      { name: "foo" }
    );
  });

  it("should reduce a Collection of type array value with the given reducer function", () => {
    const initalValue = ["test"];
    const props = { onInit };
    const reducer = jest.fn(state => {
      const newState = [...state];
      newState[0] = "foo";
      return newState;
    });

    const jestReducer = jest.fn();
    const reducerN = (state, prevState) => {
      jestReducer(state, prevState);
      return state;
    };

    const children = [
      <Collection
        reducers={[reducer, reducerN]}
        key="1"
        array
        name="user"
        value={initalValue}
      >
        <Input data-testid="user" type="text" />
      </Collection>
    ];

    mountForm({ props, children });
    expect(jestReducer).toHaveBeenCalledWith(["foo"], []);
  });

  it("should show an error label if Collection is not valid due to async validator", async () => {
    const children = [
      <CollectionAsyncValidation key="1" />,
      <Submit key="2" />
    ];
    const { getByTestId } = mountForm({ children });
    const submit = getByTestId("submit");
    const addInput = getByTestId("addInput");

    fireEvent.click(submit);
    const asyncStart = await waitFor(() => getByTestId("asyncStart"), {
      timeout: 5000
    });
    expect(asyncStart).toBeDefined();

    const asyncError = await waitFor(() => getByTestId("asyncError"), {
      timeout: 5000
    });
    expect(asyncError).toBeDefined();

    fireEvent.click(addInput);
    fireEvent.click(addInput);
    fireEvent.click(submit);
    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"), {
      timeout: 5000
    });
    expect(asyncSuccess).toBeDefined();
  });

  it("should render a nested array Collection with initial value passed as prop", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionArrayNested key="1" />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    const { getByTestId } = mountForm({ children, props });

    expect(onInit).toHaveBeenCalledWith(
      { arrayNested: initialValueNested },
      true
    );

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(dataTestid => {
      const input = getByTestId(`${dataTestid}`);
      fireEvent.change(input, { target: { value: `input_${dataTestid}` } });
    });

    expect(onChange).toHaveBeenCalledWith(
      {
        arrayNested: expectedValueArrayNested
      },
      true
    );

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        arrayNested: initialValueNested
      },
      true
    );

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      { arrayNested: initialValueNested },
      true
    );
  });

  it("should render a nested array Collection with initial value passed by the input fields", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionArrayNestedValue key="1" />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    const { getByTestId } = mountForm({ children, props });

    expect(onInit).toHaveBeenCalledWith(
      { arrayNested: initialValueNested },
      true
    );

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(dataTestid => {
      const input = getByTestId(`${dataTestid}`);
      fireEvent.change(input, { target: { value: `input_${dataTestid}` } });
    });

    expect(onChange).toHaveBeenCalledWith(
      {
        arrayNested: expectedValueArrayNested
      },
      true
    );

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        arrayNested: initialValueNested
      },
      true
    );

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      { arrayNested: initialValueNested },
      true
    );
  });

  it("should render a reduced nested array Collection with initial value passed by the inputs field", () => {
    const props = { onInit };
    const children = [
      <CollectionArrayNestedValue key="1" reducers={reducerArrayNested} />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    mountForm({ children, props });

    expect(onInit).toHaveBeenCalledWith(
      {
        arrayNested: expectedValueArrayNestedReduced
      },
      true
    );
  });

  it("should render a nested object Collection with initial valued passed as prop of the Collection", () => {
    const props = { onInit, onSubmit, onReset };
    const children = [
      <CollectionObjectNested key="1" />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    const { getByTestId } = mountForm({ children, props });

    expect(onInit).toHaveBeenCalledWith({ lv1: initialValueObjNested }, true);

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(dataTestid => {
      const input = getByTestId(`${dataTestid}`);
      expect(input.value).toBe(`${dataTestid}`);
      fireEvent.change(input, { target: { value: `${dataTestid}_1` } });
    });

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      { lv1: expectedValueObjNested },
      true
    );

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        lv1: initialValueObjNested
      },
      true
    );
  });

  it("should render a nested object Collection with initial value passed by the input fields", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionObjectNestedValue key="1" />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    const { getByTestId } = mountForm({ children, props });

    expect(onInit).toHaveBeenCalledWith({ lv1: initialValueObjNested }, true);

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(dataTestid => {
      const input = getByTestId(`${dataTestid}`);
      fireEvent.change(input, { target: { value: `${dataTestid}_1` } });
    });

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      { lv1: expectedValueObjNested },
      true
    );

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(dataTestid => {
      const input = getByTestId(`${dataTestid}`);
      expect(input.value).toBe(`${dataTestid}_1`);
    });

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        lv1: initialValueObjNested
      },
      true
    );
  });

  it("should render a reduced nested object Collection with initial value passed by the inputs field", () => {
    const props = { onInit, onSubmit, onChange, onReset };
    const children = [
      <CollectionObjectNestedValue key="1" reducers={reducerObjectNested} />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    mountForm({ children, props });

    expect(onInit).toHaveBeenCalledWith(
      {
        lv1: expectedValueObjNested
      },
      true
    );
  });
  it("should add/remove fields dynamically from an object Collection", () => {
    const props = { onInit, onChange };
    const children = [<CollectionObjectDynamicField key="1" />];

    const { getByTestId } = mountForm({ children, props });

    const addInput = getByTestId("addInput");
    const removeInput = getByTestId("removeInput");
    expect(onInit).toHaveBeenCalledWith({}, true);
    act(() => {
      fireEvent.click(addInput);
    });

    expect(onChange).toHaveBeenCalledWith({ dynamic: { 1: "1" } }, true);

    act(() => {
      fireEvent.click(removeInput);
    });

    expect(onChange).toHaveBeenCalledWith({}, true);
  });

  it("should add/remove input fields with async validators dynamically from an array Collection", async () => {
    const props = { onInit, onChange, onSubmit };
    const children = [
      <CollectionInputAsyncDynamicAdded key="1" />,
      <Submit key="2" />
    ];

    const { getByTestId } = mountForm({ children, props });

    const addInput = getByTestId("addInput");
    const submit = getByTestId("submit");
    const isValid = getByTestId("isValid");
    const removeInput = getByTestId("removeInput");

    expect(onInit).toHaveBeenCalledWith({}, true);
    act(() => {
      fireEvent.click(addInput);
    });

    expect(onChange).toHaveBeenCalledWith({ asyncCollection: ["1"] }, false);

    expect(() => getByTestId("asyncNotStartedYet")).not.toThrow();
    expect(() => getByTestId("asyncSuccess")).toThrow();
    expect(() => getByTestId("asyncError")).toThrow();

    const input = getByTestId("asyncinput");
    act(() => {
      input.focus();
      input.blur();
    });

    const asyncError = await waitFor(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();

    expect(submit.disabled).toBe(true);
    expect(isValid.innerHTML).toBe("false");

    act(() => {
      fireEvent.click(submit);
    });

    expect(onSubmit).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: "12345" } });
    });

    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess.innerHTML).toBe("Success");

    expect(submit.disabled).toBe(false);
    expect(isValid.innerHTML).toBe("true");

    act(() => {
      fireEvent.click(removeInput);
    });

    expect(onChange).toHaveBeenCalledWith({}, true);

    act(() => {
      fireEvent.click(submit);
    });

    expect(onSubmit).toHaveBeenCalledWith({}, true);
  });

  it("should run reducer functions on Collection fields removal", () => {
    const props = { onSubmit, onChange, onReset };
    const reducer = jest.fn(value => {
      const { items = [] } = value?.list || {};
      const result = items.reduce((acc, val) => {
        acc += val;
        return acc;
      }, 0);
      const list = { ...value.list, result };
      return { ...value, list };
    });
    const children = [
      <CollectionDynamicCart key="1" reducers={reducer} />,
      <Submit key="2" />,
      <Reset key="3" />
    ];
    const { getByTestId } = mountForm({ children, props });
    expect(reducer).toHaveBeenCalled();
    expect(reducer).toHaveReturnedWith({ list: { result: 0 } });

    const addInput = getByTestId("addInput");
    const removeInput = getByTestId("removeInput");

    act(() => {
      fireEvent.click(addInput);
    });

    expect(reducer).toHaveBeenCalled();
    expect(reducer).toHaveReturnedWith({ list: { items: [1], result: 1 } });

    act(() => {
      fireEvent.click(addInput);
    });
    expect(reducer).toHaveBeenCalled();
    expect(reducer).toHaveReturnedWith({ list: { items: [1, 2], result: 3 } });

    act(() => {
      fireEvent.click(removeInput);
    });

    expect(reducer).toHaveBeenCalled();
    expect(reducer).toHaveReturnedWith({ list: { items: [1], result: 1 } });

    act(() => {
      fireEvent.click(removeInput);
    });
    expect(reducer).toHaveBeenCalled();
    expect(reducer).toHaveReturnedWith({ list: { result: 0 } });
  });

  it("should throw an error if the the prop 'index' is not an integer", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [
      <Collection key="1" array name="array">
        <Input type="text" index="abc" />
      </Collection>
    ];
    expect(() => mountForm({ children })).toThrowError(/The prop "index"/i);

    children = [
      <Collection key="1" array name="array">
        <Collection object index="3.1">
          <Input type="text" name="test" />
        </Collection>
      </Collection>
    ];
    expect(() => mountForm({ children })).toThrowError(/The prop "index"/i);

    children = [
      <Collection key="1" array name="array">
        <Collection object index="-1">
          <Input type="text" name="test" />
        </Collection>
      </Collection>
    ];
    expect(() => mountForm({ children })).toThrowError(/The prop "index"/i);

    console.error = originalError;
  });

  it("should throw an error if the a prop 'name' is used within an array Collection", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [
      <Collection key="1" array name="array">
        <Input type="text" name="abc" />
      </Collection>
    ];
    expect(() => mountForm({ children })).toThrowError(
      /it is not allowed within context a of type \"array\"/i
    );

    console.error = originalError;
  });

  it("should throw an error for an invalid 'asyncValidator' prop", () => {
    const originalError = console.error;
    console.error = jest.fn();
    let children = [
      <Collection key="1" array name="array" asyncValidator={true}>
        <Collection object>
          <Input type="text" name="test" />
        </Collection>
      </Collection>
    ];
    expect(() => mountForm({ children })).toThrowError(
      /It must be a function/i
    );

    console.error = originalError;
  });
});
