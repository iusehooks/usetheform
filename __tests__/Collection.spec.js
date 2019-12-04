import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import Form, { Input, Collection } from "./../src";

import CollectionValidation from "./helpers/components/CollectionValidation";
import CollectionAsyncValidation from "./helpers/components/CollectionAsyncValidation";
import CollectionArrayNested, {
  initialValue as initialValueNested
} from "./helpers/components/CollectionArrayNested";
import Reset from "./helpers/components/Reset";

import AgeRange from "./helpers/components/AgeRange";

const mountForm = ({ props = {}, children } = {}) =>
  render(<Form {...props}>{children}</Form>);

const dataTestid = "username";
const name = "user";
const userName = "username";
const typeInput = "text";

describe("Component => Collection", () => {
  it("should render a Collection of type object with an inial value", () => {
    const onInit = jest.fn(state => state);
    const props = { onInit };
    const value = "foo";

    const children = [
      <Collection key="1" object name={name}>
        <Input
          data-testid={dataTestid}
          type={typeInput}
          name={userName}
          value={value}
        />
      </Collection>
    ];
    mountForm({ props, children });

    expect(onInit).toHaveReturnedWith({ [name]: { [userName]: value } });
  });

  it("should render a Collection of type array with an inial value", () => {
    const onInit = jest.fn(state => state);
    const props = { onInit };
    const value = "foo";

    const children = [
      <Collection key="1" array name={name}>
        <Input data-testid={dataTestid} type={typeInput} value={value} />
      </Collection>
    ];
    mountForm({ props, children });

    expect(onInit).toHaveReturnedWith({ [name]: [value] });
  });

  it("should apply reducer functions to reduce the Collection value", () => {
    const onChange = jest.fn();
    const onInit = jest.fn(state => state);

    const props = { onChange, onInit };
    const children = [<AgeRange key="1" />];

    const { getByTestId } = mountForm({ props, children });
    const start = getByTestId("start");
    const end = getByTestId("end");

    expect(onInit).toHaveReturnedWith({ ageRange: { start: 18, end: 65 } });

    fireEvent.change(start, { target: { value: 50 } });
    fireEvent.change(end, { target: { value: 80 } });
    expect(onChange).toHaveBeenCalledWith({ ageRange: { start: 50, end: 80 } });

    fireEvent.change(start, { target: { value: 81 } });
    fireEvent.change(end, { target: { value: 80 } });
    expect(onChange).toHaveBeenCalledWith({ ageRange: { start: 80, end: 80 } });

    fireEvent.change(start, { target: { value: 18 } });
    fireEvent.change(end, { target: { value: 90 } });
    expect(onChange).toHaveBeenCalledWith({ ageRange: { start: 18, end: 90 } });

    fireEvent.change(start, { target: { value: 18 } });
    fireEvent.change(end, { target: { value: 16 } });
    expect(onChange).toHaveBeenCalledWith({ ageRange: { start: 18, end: 18 } });
  });

  it("should show an error label if Collection is not valid due to sync validator", () => {
    const children = [
      <CollectionValidation key="1" />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>
    ];
    const { getByTestId } = mountForm({ children });
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    const errorLabel = getByTestId("errorLabel");
    expect(errorLabel).toBeDefined();
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
    const onReset = jest.fn(state => state);
    const onChange = jest.fn(state => state);
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
    expect(onChange).toHaveReturnedWith({ user: { name: "foo" } });

    const reset = getByTestId("reset");
    fireEvent.click(reset);
    expect(onReset).toHaveReturnedWith({ user: { name: "test" } });
  });

  it("should reduce a Collection of type object value with the given reducer function", () => {
    const initalValue = { name: "test" };
    const onInit = jest.fn(state => state);
    const props = { onInit };
    const reducer = jest.fn((state, prevState) => {
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

    expect(onInit).toHaveReturnedWith({ user: { name: "foo" } });

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
    const onInit = jest.fn(state => state);
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

    expect(onInit).toHaveReturnedWith({ user: ["foo"] });
  });

  it("should show an error label if Collection is not valid due to async validator", async () => {
    const children = [
      <CollectionAsyncValidation key="1" />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>
    ];
    const { getByTestId } = mountForm({ children });
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    const asyncStart = await waitForElement(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    const asyncError = await waitForElement(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();
  });

  it("should render a nested array Collection", () => {
    const onInit = jest.fn(state => state);
    const onSubmit = jest.fn();
    const onChange = jest.fn();

    const props = { onInit, onSubmit, onChange };
    const children = [
      <CollectionArrayNested key="1" />,
      <button key="2" type="submit" data-testid="submit">
        Submit
      </button>
    ];
    const { getByTestId } = mountForm({ children, props });

    expect(onInit).toHaveReturnedWith({ arrayNested: initialValueNested });

    const mostinnerText = getByTestId("mostinnerText");
    const mostinnerCheckbox = getByTestId("mostinnerCheckbox");
    fireEvent.change(mostinnerText, { target: { value: "mostinnerText" } });
    fireEvent.change(mostinnerCheckbox, { target: { value: "" } });

    const nestedResultAfterChange = [...initialValueNested];
    nestedResultAfterChange[2][2][2][2][0] = "mostinnerText";
    nestedResultAfterChange[2][2][2][2][1] = undefined;

    expect(onChange).toHaveBeenCalledWith({
      arrayNested: nestedResultAfterChange
    });

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      { arrayNested: nestedResultAfterChange },
      true
    );
  });
});
