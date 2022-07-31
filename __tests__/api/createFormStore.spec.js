/* eslint-disable no-unused-vars */
import React from "react";
import { fireEvent, cleanup, act, render } from "@testing-library/react";

import { Form, Input, Collection, createFormStore } from "../../src";
import Submit from "./../helpers/components/Submit";
import Reset from "./../helpers/components/Reset";

afterEach(cleanup);

describe("API => createFormStore", () => {
  let myFormStore;
  let Counter;
  beforeEach(() => {
    myFormStore = createFormStore();
    const [, useSelectorForm] = myFormStore;
    Counter = ({ selector, initialFormState }) => {
      const [counter, setCounter] = useSelectorForm(selector, initialFormState);
      return (
        <div>
          <span data-testid="counterValue">{counter}</span>
          <button
            data-testid="counterResetBtn"
            type="button"
            onClick={() => setCounter(0)}
          >
            Reset
          </button>
        </div>
      );
    };
  });

  it("should update the counter value and reset it", () => {
    const [formStore] = myFormStore;

    const { getByTestId } = render(
      <div>
        <Form formStore={formStore}>
          <Input
            type="text"
            value="0"
            name="counter"
            data-testid="counterInput"
          />
        </Form>
        <Counter selector={state => state.counter} />
      </div>
    );

    const counterValue = getByTestId("counterValue");
    expect(counterValue.textContent).toBe("0");

    const counterInput = getByTestId("counterInput");
    const newCounterValue = "50";
    act(() => {
      fireEvent.change(counterInput, { target: { value: newCounterValue } });
    });

    expect(counterValue.textContent).toBe(newCounterValue);

    const counterResetBtn = getByTestId("counterResetBtn");
    act(() => {
      fireEvent.click(counterResetBtn);
    });

    expect(counterValue.textContent).toBe("0");
  });

  it("should update the counter value when Form is resetted", () => {
    const [formStore] = myFormStore;
    const initValue = "1";

    const { getByTestId } = render(
      <div>
        <Form formStore={formStore}>
          <Input
            type="text"
            value={initValue}
            name="counter"
            data-testid="counterInput"
          />
          <Reset />
        </Form>
        <Counter selector={state => state.counter} />
      </div>
    );

    const counterValue = getByTestId("counterValue");
    expect(counterValue.textContent).toBe(initValue);

    const counterInput = getByTestId("counterInput");
    const newCounterValue = "50";
    act(() => {
      fireEvent.change(counterInput, { target: { value: newCounterValue } });
    });

    expect(counterValue.textContent).toBe(newCounterValue);

    const resetBtn = getByTestId("reset");
    act(() => {
      fireEvent.click(resetBtn);
    });

    expect(counterValue.textContent).toBe(initValue);
  });

  it("should update the counter value and validate the form", () => {
    const [formStore] = myFormStore;

    const initValue = "3";
    const { getByTestId } = render(
      <div>
        <Form formStore={formStore}>
          <Input
            type="text"
            value={initValue}
            validators={[
              val => (val && Number(val) >= 3 ? undefined : "error")
            ]}
            name="counter"
            data-testid="counterInput"
          />
          <Submit />
        </Form>
        <Counter selector={state => state.counter} />
      </div>
    );

    const counterValue = getByTestId("counterValue");
    expect(counterValue.textContent).toBe(initValue);

    const counterResetBtn = getByTestId("counterResetBtn");
    act(() => {
      fireEvent.click(counterResetBtn);
    });

    expect(counterValue.textContent).toBe("0");

    const submit = getByTestId("submit");
    expect(submit.disabled).toBe(true);
  });

  it("should initialize the counter value with a default", () => {
    const [formStore] = myFormStore;
    const initialState = { counter: "1" };

    const { getByTestId } = render(
      <div>
        <Form formStore={formStore}>
          <Input type="text" name="counter" data-testid="counterInput" />
        </Form>
        <Counter
          selector={state => state.counter}
          initialFormState={initialState}
        />
      </div>
    );

    const counterValue = getByTestId("counterValue");
    expect(counterValue.textContent).toBe("1");
  });

  it("should update the counter value and reset it within an object Collection", () => {
    const [formStore] = myFormStore;

    const { getByTestId } = render(
      <div>
        <Counter selector={state => state.test.counter} />
        <Form formStore={formStore} initialState={{ test: { counter: 0 } }}>
          <Collection object name="test">
            <Input type="text" name="counter" data-testid="counterInput" />
          </Collection>
        </Form>
      </div>
    );

    const counterValue = getByTestId("counterValue");
    expect(counterValue.textContent).toBe("0");

    const counterInput = getByTestId("counterInput");
    const newCounterValue = "50";
    act(() => {
      fireEvent.change(counterInput, { target: { value: newCounterValue } });
    });

    expect(counterValue.textContent).toBe(newCounterValue);

    const counterResetBtn = getByTestId("counterResetBtn");
    act(() => {
      fireEvent.click(counterResetBtn);
    });

    expect(counterValue.textContent).toBe("0");
  });

  it("should update the counter value and reset it within an array Collection", () => {
    const [formStore] = myFormStore;

    const { getByTestId } = render(
      <div>
        <Counter selector={state => state.test[0]} />
        <Form formStore={formStore} initialState={{ test: [0] }}>
          <Collection array name="test">
            <Input type="text" data-testid="counterInput" />
          </Collection>
        </Form>
      </div>
    );

    const counterValue = getByTestId("counterValue");
    expect(counterValue.textContent).toBe("0");

    const counterInput = getByTestId("counterInput");
    const newCounterValue = "50";
    act(() => {
      fireEvent.change(counterInput, { target: { value: newCounterValue } });
    });

    expect(counterValue.textContent).toBe(newCounterValue);

    const counterResetBtn = getByTestId("counterResetBtn");
    act(() => {
      fireEvent.click(counterResetBtn);
    });

    expect(counterValue.textContent).toBe("0");
  });

  it("should update the Form", () => {
    const [formStore, useSelectorForm] = myFormStore;

    const FormDriver = () => {
      const [formValue, setFormValue] = useSelectorForm(state => state);
      return (
        <div>
          <span data-testid="formVal">{JSON.stringify(formValue)}</span>
          <button
            data-testid="formResetBtn"
            type="button"
            onClick={() => setFormValue({ user: { name: "foo" } })}
          >
            Reset
          </button>
        </div>
      );
    };

    const initialState = { user: { name: "micky" } };
    const { getByTestId } = render(
      <div>
        <FormDriver />
        <Form formStore={formStore} initialState={initialState}>
          <Collection object name="user">
            <Input type="text" name="name" data-testid="userInput" />
          </Collection>
        </Form>
      </div>
    );

    const formVal = getByTestId("formVal");
    expect(formVal.textContent).toBe(
      JSON.stringify({ user: { name: "micky" } })
    );

    const userInput = getByTestId("userInput");
    const newInputValue = "Antonio";
    act(() => {
      fireEvent.change(userInput, { target: { value: newInputValue } });
    });

    expect(formVal.textContent).toBe(
      JSON.stringify({ user: { name: newInputValue } })
    );

    const formResetBtn = getByTestId("formResetBtn");
    act(() => {
      fireEvent.click(formResetBtn);
    });

    expect(formVal.textContent).toBe(JSON.stringify({ user: { name: "foo" } }));
  });

  it("should update an object Collection", () => {
    const [formStore, useSelectorForm] = myFormStore;

    const ObjectCollection = () => {
      const [collectionVal, setCollectionVal] = useSelectorForm(
        state => state.user
      );
      return (
        <div>
          <span data-testid="collectionVal">
            {JSON.stringify(collectionVal)}
          </span>
          <button
            data-testid="collectionResetBtn"
            type="button"
            onClick={() => setCollectionVal({ name: "foo" })}
          >
            Reset
          </button>
        </div>
      );
    };

    const initialState = { user: { name: "micky" } };
    const { getByTestId } = render(
      <div>
        <ObjectCollection />
        <Form formStore={formStore} initialState={initialState}>
          <Collection object name="user">
            <Input type="text" name="name" data-testid="userInput" />
          </Collection>
        </Form>
      </div>
    );

    const collectionVal = getByTestId("collectionVal");
    expect(collectionVal.textContent).toBe(JSON.stringify({ name: "micky" }));

    const userInput = getByTestId("userInput");
    const newValue = "Antonio";
    act(() => {
      fireEvent.change(userInput, { target: { value: newValue } });
    });

    expect(collectionVal.textContent).toBe(JSON.stringify({ name: newValue }));

    const collectionResetBtn = getByTestId("collectionResetBtn");
    act(() => {
      fireEvent.click(collectionResetBtn);
    });

    expect(collectionVal.textContent).toBe(JSON.stringify({ name: "foo" }));
  });

  it("should update a nested object Collection", () => {
    const [formStore, useSelectorForm] = myFormStore;

    const ObjectCollection = () => {
      const [collectionVal, setCollectionVal] = useSelectorForm(
        state => state.colors.palette
      );
      return (
        <div>
          <span data-testid="collectionVal">
            {JSON.stringify(collectionVal)}
          </span>
          <button
            data-testid="collectionResetBtn"
            type="button"
            onClick={() => setCollectionVal({ current: "blue" })}
          >
            Reset
          </button>
        </div>
      );
    };

    const initialState = { colors: { palette: { current: "red" } } };
    const { getByTestId } = render(
      <div>
        <Form formStore={formStore} initialState={initialState}>
          <Collection object name="colors">
            <Collection object name="palette">
              <Input type="text" name="current" data-testid="userInput" />
            </Collection>
          </Collection>
        </Form>
        <ObjectCollection />
      </div>
    );

    const collectionResetBtn = getByTestId("collectionResetBtn");
    act(() => {
      fireEvent.click(collectionResetBtn);
    });

    const collectionVal = getByTestId("collectionVal");
    expect(collectionVal.textContent).toBe(JSON.stringify({ current: "blue" }));

    const userInput = getByTestId("userInput");
    const newCounterValue = "yellow";
    act(() => {
      fireEvent.change(userInput, { target: { value: newCounterValue } });
    });

    expect(collectionVal.textContent).toBe(
      JSON.stringify({ current: newCounterValue })
    );
  });

  it("should update an array Collection", () => {
    const [formStore, useSelectorForm] = myFormStore;

    const ArrayCollection = () => {
      const [collectionVal, setCollectionVal] = useSelectorForm(
        state => state.values
      );
      return (
        <div>
          <span data-testid="collectionVal">
            {JSON.stringify(collectionVal)}
          </span>
          <button
            data-testid="collectionResetBtn"
            type="button"
            onClick={() => setCollectionVal(["0"])}
          >
            Reset
          </button>
        </div>
      );
    };

    const initialState = { values: ["0"] };
    const { getByTestId } = render(
      <div>
        <ArrayCollection />
        <Form formStore={formStore} initialState={initialState}>
          <Collection array name="values">
            <Input type="text" data-testid="userInput" />
          </Collection>
        </Form>
      </div>
    );

    const collectionVal = getByTestId("collectionVal");
    expect(collectionVal.textContent).toBe(JSON.stringify(["0"]));

    const userInput = getByTestId("userInput");
    const newValue = "1";
    act(() => {
      fireEvent.change(userInput, { target: { value: newValue } });
    });

    expect(collectionVal.textContent).toBe(JSON.stringify([newValue]));

    const collectionResetBtn = getByTestId("collectionResetBtn");
    act(() => {
      fireEvent.click(collectionResetBtn);
    });

    expect(collectionVal.textContent).toBe(JSON.stringify(["0"]));
  });

  it("should update an object Collection with reducers", () => {
    const [formStore, useSelectorForm] = myFormStore;

    const ObjectCollection = () => {
      const [collectionVal, setCollectionVal] = useSelectorForm(
        state => state.user
      );
      return (
        <div>
          <span data-testid="collectionVal">
            {JSON.stringify(collectionVal)}
          </span>
          <button
            data-testid="collectionResetBtn"
            type="button"
            onClick={() => setCollectionVal(prev => ({ ...prev, name: "foo" }))}
          >
            Reset
          </button>
        </div>
      );
    };

    const fullNameFN = nextValue => {
      const fullName = [nextValue["name"], nextValue["lastname"]]
        .filter(Boolean)
        .join(" ");
      const newValue = { ...nextValue, fullName };
      return newValue;
    };
    const initialState = { user: { name: "micky", lastname: "test" } };
    const { getByTestId } = render(
      <div>
        <ObjectCollection />
        <Form formStore={formStore} initialState={initialState}>
          <Collection object name="user" reducers={[fullNameFN]}>
            <Input type="text" name="name" data-testid="userInput" />
            <Input type="text" name="lastname" />
            <Input type="text" name="fullName" data-testid="fullName" />
          </Collection>
        </Form>
      </div>
    );

    const collectionVal = getByTestId("collectionVal");
    expect(collectionVal.textContent).toBe(
      JSON.stringify({
        name: "micky",
        lastname: "test",
        fullName: "micky test"
      })
    );

    const userInput = getByTestId("userInput");
    const newValue = "Antonio";
    act(() => {
      fireEvent.change(userInput, { target: { value: newValue } });
    });

    expect(collectionVal.textContent).toBe(
      JSON.stringify({
        name: newValue,
        lastname: "test",
        fullName: `${newValue} test`
      })
    );

    const collectionResetBtn = getByTestId("collectionResetBtn");
    act(() => {
      fireEvent.click(collectionResetBtn);
    });

    expect(collectionVal.textContent).toBe(
      JSON.stringify({
        name: "foo",
        lastname: "test",
        fullName: `foo test`
      })
    );
  });

  it("should throw if selector is not a function", () => {
    const originalError = console.error;
    console.error = jest.fn();

    const [formStore] = myFormStore;

    expect(() =>
      render(
        <div>
          <Form formStore={formStore}>
            <Input
              type="text"
              value="0"
              name="counter"
              data-testid="counterInput"
            />
          </Form>
          <Counter selector={{}} />
        </div>
      )
    ).toThrow(
      "createFormStore: the state selector argument must be a function"
    );

    console.error = originalError;
  });

  it("should throw if the initial form state is not an object", () => {
    const originalError = console.error;
    console.error = jest.fn();

    const [formStore] = myFormStore;

    expect(() =>
      render(
        <div>
          <Form formStore={formStore}>
            <Input
              type="text"
              value="0"
              name="counter"
              data-testid="counterInput"
            />
          </Form>
          <Counter selector={state => state.counter} initialFormState={[]} />
        </div>
      )
    ).toThrow(
      "createFormStore: the initial form state argument must be an object"
    );

    console.error = originalError;
  });
});
