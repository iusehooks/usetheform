import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  act
} from "@testing-library/react";

import { SimpleFormTestSumbission } from "./helpers/components/SimpleFormTestSumbission";
import { CollectionDynamicCart } from "./helpers/components/CollectionDynamicField";
import SimpleForm from "./helpers/components/SimpleForm";
import SimpleFormWithAsync from "./helpers/components/SimpleFormWithAsync";
import {
  ComplexForm,
  ComplexFormInitValueAsProps,
  initialState as initialStateComplexForm
} from "./helpers/components/ComplexForm";
import { mountForm } from "./helpers/utils/mountForm";

import { Input, Select, Collection, TextArea, Form } from "./../src";

const dataTestid = "email";
const typeInput = "text";
const nameInput = "email";
const valueInput = "foo";

const onInit = jest.fn(state => state);
const onChange = jest.fn();
const onReset = jest.fn();
const onSubmit = jest.fn();

afterEach(cleanup);

describe("Component => Form", () => {
  beforeEach(() => {
    onInit.mockClear();
    onChange.mockClear();
    onReset.mockClear();
    onSubmit.mockClear();
  });

  it("should render a Form with an input", () => {
    const name = "myForm";
    const props = { name };
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
      />
    ];
    const { container, getByTestId } = mountForm({ props, children });
    const form = container.firstChild;
    expect(form.name).toBe(name);
    expect(form.children.length).toBe(children.length);
    expect(getByTestId(dataTestid).type).toBe(typeInput);
  });

  it("should trigger onInit event when Form is ready", () => {
    const props = { onInit };
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
        value={valueInput}
      />
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [nameInput]: valueInput });
  });

  it("should trigger onChange event when Form state changes", () => {
    const props = { onChange };
    const children = [
      <Input
        key="1"
        data-testid={dataTestid}
        type={typeInput}
        name={nameInput}
      />
    ];
    const { getByTestId } = mountForm({ props, children });
    const input = getByTestId(dataTestid);
    fireEvent.change(input, { target: { value: valueInput } });
    expect(onChange).toHaveBeenCalledWith({ [nameInput]: valueInput }, true);
  });

  it("should initialized the Form state", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };
    const props = { initialState, onInit };
    render(<SimpleForm {...props} />);
    expect(onInit).toHaveReturnedWith(initialState);
  });

  it("should onInit Form callback called only once", () => {
    const props = { onInit, onChange };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const textField = getByTestId("name");

    expect(onInit).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.change(textField, { target: { value: "Antonio" } });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInit).toHaveBeenCalledTimes(1);
  });

  it("should onReset callback called only once", () => {
    const props = { onReset, onChange };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const textField = getByTestId("name");
    const reset = getByTestId("reset");

    act(() => {
      fireEvent.change(textField, { target: { value: "Antonio" } });
    });

    expect(onChange).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(reset);
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("should test 'pristine' value after resetting form", () => {
    const { getByTestId } = render(<SimpleForm />);
    const textField = getByTestId("name");
    const reset = getByTestId("reset");

    expect(() => getByTestId("pristine")).not.toThrow();

    act(() => {
      fireEvent.change(textField, { target: { value: "Antonio" } });
    });

    expect(() => getByTestId("pristine")).toThrow();

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("pristine")).not.toThrow();
  });

  it("should override a initialized the Form state if Fields contain the value prop", () => {
    const initialState = {
      text: "foo",
      number: 1,
      checkbox: "1",
      radio: "2",
      range: 2,
      selectSingle: "1",
      selectMultiple: ["3"],
      object: { text: "foo" },
      object1: { text: "foo" },
      textarea: "foo",
      array: ["foo"],
      array1: ["foo"]
    };
    const props = { initialState, onInit };
    const children = [
      <Input type="text" name="text" value="BeBo" key="1" />,
      <Input type="number" name="number" value={10} key="2" />,
      <Input type="checkbox" name="checkbox" value="4" key="3" checked />,
      <Input type="radio" name="radio" value="6" key="4" checked />,
      <Input type="range" min="0" max="120" name="range" value={7} key="5" />,
      <Select name="selectSingle" value="2" key="6">
        <option value="" />
        <option value="1">1</option>
        <option value="2">2</option>
      </Select>,
      <Select key="7" multiple name="selectMultiple" value={["1", "2"]}>
        <option value="" />
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="2">3</option>
      </Select>,
      <Collection key="8" object name="object">
        <Input type="text" name="text" value="BeBo" />,
      </Collection>,
      <Collection key="9" object name="object1" value={{ text: "BeBo" }}>
        <Input type="text" name="text" />,
      </Collection>,
      <TextArea name="textarea" value="BeBo" key="10" />,
      <Collection key="11" array name="array" value={["foo"]}>
        <Input type="text" value="BeBo" />,
      </Collection>,
      <Collection key="12" array name="array1" value={["BeBo"]}>
        <Input type="text" />,
      </Collection>
    ];
    mountForm({ props, children });

    expect(onInit).toHaveReturnedWith({
      text: "BeBo",
      number: 10,
      checkbox: "4",
      radio: "6",
      range: 7,
      selectSingle: "2",
      selectMultiple: ["1", "2"],
      object: { text: "BeBo" },
      object1: { text: "BeBo" },
      textarea: "BeBo",
      array: ["BeBo"],
      array1: ["BeBo"]
    });
  });

  it("should reset the Form state", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = { initialState, onReset, onChange };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const reset = getByTestId("reset");
    const textField = getByTestId("name");

    fireEvent.change(textField, { target: { value: "Antonio" } });
    expect(onChange).toHaveBeenCalledWith(
      {
        user: {
          name: "Antonio",
          lastname: "anything",
          email: "anything@google.com"
        }
      },
      true
    );

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(initialState, true);
  });

  it("should render a Form with dynamic inputs and initial state passed to Form prop", () => {
    const onReset = jest.fn();
    const props = { onInit, onChange, onReset };
    const { getByTestId } = render(<ComplexForm {...props} />);
    expect(onInit).toHaveReturnedWith(initialStateComplexForm);

    const addmore = getByTestId("addinput");
    fireEvent.click(addmore);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1
      },
      true
    );

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1,
        2: 2
      },
      true
    );

    const select = getByTestId("select");
    fireEvent.change(select, { target: { value: "3" } });

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        select: "3",
        1: 1,
        2: 2
      },
      true
    );

    const reset = getByTestId("reset");
    fireEvent.click(reset);

    expect(onReset).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1,
        2: 2
      },
      true
    );

    const genderM = getByTestId("genderm");
    fireEvent.click(genderM);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "M",
        1: 1,
        2: 2
      },
      true
    );

    const removeinput = getByTestId("removeinput");
    fireEvent.click(removeinput);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "M",
        1: 1
      },
      true
    );

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "M",
        1: 1,
        3: 3
      },
      true
    );

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1,
        3: 3
      },
      true
    );

    const other1 = getByTestId("other1");
    fireEvent.click(other1);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        other: [undefined, "3"],
        1: 1,
        3: 3
      },
      true
    );

    fireEvent.click(other1);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        other: ["1", "3"],
        1: 1,
        3: 3
      },
      true
    );

    const genderF = getByTestId("genderf");
    fireEvent.click(genderF);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "F",
        1: 1,
        3: 3
      },
      true
    );

    const other2 = getByTestId("other2");
    onChange.mockClear();
    fireEvent.click(other2);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        other: ["1", undefined],
        1: 1,
        3: 3
      },
      true
    );
  });

  it("should render a Form with dynamic inputs and initial state passed to each input as 'value' prop", () => {
    const onReset = jest.fn();
    const props = { onInit, onChange, onReset };
    const { getByTestId } = render(<ComplexFormInitValueAsProps {...props} />);
    expect(onInit).toHaveReturnedWith(initialStateComplexForm);

    const addmore = getByTestId("addinput");
    fireEvent.click(addmore);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1
      },
      true
    );

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1,
        2: 2
      },
      true
    );

    const select = getByTestId("select");
    fireEvent.change(select, { target: { value: "3" } });

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        select: "3",
        1: 1,
        2: 2
      },
      true
    );

    const reset = getByTestId("reset");
    fireEvent.click(reset);

    expect(onReset).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1,
        2: 2
      },
      true
    );

    const genderM = getByTestId("genderm");
    fireEvent.click(genderM);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "M",
        1: 1,
        2: 2
      },
      true
    );

    const removeinput = getByTestId("removeinput");
    fireEvent.click(removeinput);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "M",
        1: 1
      },
      true
    );

    fireEvent.click(addmore);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "M",
        1: 1,
        3: 3
      },
      true
    );

    fireEvent.click(reset);
    expect(onReset).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        1: 1,
        3: 3
      },
      true
    );

    const other1 = getByTestId("other1");
    fireEvent.click(other1);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        other: [undefined, "3"],
        1: 1,
        3: 3
      },
      true
    );

    fireEvent.click(other1);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        other: ["1", "3"],
        1: 1,
        3: 3
      },
      true
    );

    const genderF = getByTestId("genderf");
    fireEvent.click(genderF);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        gender: "F",
        1: 1,
        3: 3
      },
      true
    );

    const other2 = getByTestId("other2");
    onChange.mockClear();
    fireEvent.click(other2);
    expect(onChange).toHaveBeenCalledWith(
      {
        ...initialStateComplexForm,
        other: ["1", undefined],
        1: 1,
        3: 3
      },
      true
    );
  });

  it("should reduce the Form state with the given reducer function", () => {
    const initialState = { name: "test" };

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

    const props = { onInit, initialState, reducers: [reducer, reducerN] };

    const children = [
      <Input key="1" data-testid="user" name="name" type="text" />
    ];

    const { getByTestId } = mountForm({ props, children });
    expect(jestReducer).toHaveBeenCalledWith({ name: "foo" }, {});

    expect(onInit).toHaveReturnedWith({ name: "foo" });

    jestReducer.mockReset();
    const user = getByTestId("user");
    fireEvent.change(user, { target: { value: "mickey" } });
    expect(jestReducer).toHaveBeenCalledWith(
      { name: "mickey" },
      { name: "foo" }
    );
  });

  it("should accept an innerRef prop to access to DOM", () => {
    const name = "foo";
    const ref = React.createRef();

    act(() => {
      render(<Form innerRef={ref} name={name} />);
    });

    expect(ref.current).toBeDefined();
    expect(ref.current.name).toBe(name);
  });

  it("should run reducer functions applied to Form on fields removal", () => {
    const reducers = jest.fn(value => {
      const { cart = {} } = value;
      const { list = {} } = cart;
      const { items = [] } = list;
      const result = items.reduce((acc, val) => {
        acc += val;
        return acc;
      }, 0);
      const newList = { ...list, result };
      const newCart = { ...cart, list: newList };

      return { ...value, cart: newCart, cartResult: result };
    });
    const props = { onInit, onSubmit, onChange, onReset, reducers };

    const children = [
      <CollectionDynamicCart key="1" />,
      <Input name="cartResult" type="number" key="2" value="0" />
    ];

    const { getByTestId } = mountForm({ children, props });
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { result: 0 } },
      cartResult: 0
    });

    const addInput = getByTestId("addInput");
    const removeInput = getByTestId("removeInput");

    fireEvent.click(addInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { items: [1], result: 1 } },
      cartResult: 1
    });

    fireEvent.click(addInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { items: [1, 2], result: 3 } },
      cartResult: 3
    });

    fireEvent.click(removeInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { items: [1], result: 1 } },
      cartResult: 1
    });

    fireEvent.click(removeInput);
    expect(reducers).toHaveBeenCalled();
    expect(reducers).toHaveReturnedWith({
      cart: { list: { result: 0 } },
      cartResult: 0
    });
  });

  it("should submit the Form", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = { initialState, onSubmit };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(initialState, true);
  });

  it("should not submit an invalid Form", () => {
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything" }
    };

    const props = { initialState, onSubmit };
    const { getByTestId } = render(<SimpleForm {...props} />);
    const submit = getByTestId("submit");

    fireEvent.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should not `preventDefault` Form submission if action props is present and Form is Valid", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = { initialState, action: "http://yourapiserver.com/submit" };

    const { getByTestId } = render(<SimpleForm {...props} />);
    const form = getByTestId("form");

    const isNotPrevented = fireEvent.submit(form);

    expect(isNotPrevented).toBe(true);
    console.error = originalError;
  });

  it("should `preventDefault` Form submission if action props is present and Async validation is applied at any level", async () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = { username: "BeBo" };

    const props = {
      onSubmit,
      initialState,
      action: "http://yourapiserver.com/submit"
    };

    const { getByTestId } = render(<SimpleFormWithAsync {...props} />);

    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"), {
      timeout: 5000
    });
    expect(asyncSuccess).toBeDefined();
    const submitbutton = getByTestId("submit");
    expect(submitbutton.disabled).toBe(false);

    const form = getByTestId("form");
    form.submit = jest.fn();

    const isNotPrevented = fireEvent.submit(form);
    expect(isNotPrevented).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    console.error = originalError;
  });

  it("should submit a valid Form with an action and not `preventDefault` form submission", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything@google.com" }
    };

    const props = {
      initialState,
      onSubmit,
      action: "http://yourapiserver.com/submit",
      method: "POST"
    };

    const { getByTestId } = render(<SimpleForm {...props} />);
    const form = getByTestId("form");

    const inputName = getByTestId("name");
    const inputLastName = getByTestId("lastname");
    const inputEmail = getByTestId("email");

    expect(inputName.value).toBe("foo");
    expect(inputLastName.value).toBe("anything");
    expect(inputEmail.value).toBe("anything@google.com");

    expect(form.action).toBe(props.action);
    expect(form.method).toMatch(/POST/i);

    const isNotPrevented = fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalled();
    expect(isNotPrevented).toBe(true);

    console.error = originalError;
  });

  it("should not submit a invalid Form with an action and `preventDefault` form submission", () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = {
      user: { name: "foo", lastname: "anything", email: "anything_google.com" }
    };

    const props = {
      initialState,
      onSubmit,
      action: "http://yourapiserver.com/submit",
      method: "POST"
    };

    const { getByTestId } = render(<SimpleForm {...props} />);
    const form = getByTestId("form");

    expect(form.action).toBe(props.action);
    expect(form.method).toMatch(/POST/i);

    const isNotPrevented = fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(isNotPrevented).toBe(false);
    console.error = originalError;
  });

  it("should <Submit /> button being enabled for a valid Form with Async Fields validators functions", async () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = { username: "abcde" };

    const props = { initialState, onSubmit };

    const { getByTestId } = render(<SimpleFormWithAsync {...props} />);

    const asyncinput = getByTestId("asyncinput");
    expect(asyncinput.value).toBe(initialState.username);

    const asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess).toBeDefined();

    expect(() => getByTestId("asyncError")).toThrow();

    const submitbutton = getByTestId("submit");
    expect(submitbutton.disabled).toBe(false);

    console.error = originalError;
  });

  it("should <Submit /> button being disabled for an a invalid Form with Async Fields validators functions", async () => {
    const originalError = console.error;
    console.error = jest.fn();
    const initialState = { username: "foo" };
    const props = { initialState, onSubmit };

    const { getByTestId } = render(<SimpleFormWithAsync {...props} />);
    const form = getByTestId("form");
    const submitbutton = getByTestId("submit");

    const asyncinput = getByTestId("asyncinput");
    expect(asyncinput.value).toBe("foo");

    fireEvent.submit(form);

    const asyncStart = await waitFor(() => getByTestId("asyncStart"), {
      timeout: 5000
    });
    expect(asyncStart).toBeDefined();

    const asyncError = await waitFor(() => getByTestId("asyncError"), {
      timeout: 5000
    });
    expect(asyncError).toBeDefined();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(submitbutton.disabled).toBe(true);
    console.error = originalError;
  });

  it("should count the total attempts and the total successfully submissions for sync onSubmit", () => {
    let pressSubmit = 0;
    const onSubmit = () => {
      const myIndex = ++pressSubmit;
      return myIndex % 2 === 0;
    };
    const props = { onSubmit };
    const { getByTestId } = render(<SimpleFormTestSumbission {...props} />);
    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    for (let i = 1; i <= 10; i++) {
      fireEvent.click(submit);
    }
    let submitAttempts = getByTestId("submitAttempts");
    let submittedCounter = getByTestId("submittedCounter");

    expect(submitAttempts.innerHTML).toBe("10");
    expect(submittedCounter.innerHTML).toBe("5");

    fireEvent.click(reset);
    expect(() => getByTestId("submitAttempts")).toThrow();
    expect(() => getByTestId("submittedCounter")).toThrow();
  });

  it("should count the total attempts and the total successfully submissions for async onSubmit", async () => {
    let pressSubmit = 0;
    const onSubmit = () => {
      const myIndex = ++pressSubmit;
      return new Promise((res, rej) => {
        myIndex % 2 === 0 ? res() : rej();
      });
    };
    const props = { onSubmit };
    const { getByTestId } = render(<SimpleFormTestSumbission {...props} />);
    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    for (let i = 1; i <= 10; i++) {
      fireEvent.click(submit);
    }

    const submitAttempts = await waitFor(() => getByTestId("submitAttempts"));
    const submittedCounter = await waitFor(() =>
      getByTestId("submittedCounter")
    );

    expect(submitAttempts.innerHTML).toBe("10");
    expect(submittedCounter.innerHTML).toBe("5");

    fireEvent.click(reset);
    expect(() => getByTestId("submitAttempts")).toThrow();
    expect(() => getByTestId("submittedCounter")).toThrow();
  });

  it("should submitted, submitAttempts be equal for async func which does not explicitly resolve or reject", async () => {
    async function test() {
      return 1;
    }
    async function onSubmit() {
      try {
        await test();
      } catch (err) {
        return;
      }
    }

    const attempts = 10;

    const props = { onSubmit };
    const { getByTestId } = render(
      <SimpleFormTestSumbission
        targetSumbission={attempts}
        targetAttempts={attempts}
        {...props}
      />
    );
    const submit = getByTestId("submit");
    const reset = getByTestId("reset");

    for (let i = 1; i <= attempts; i++) {
      fireEvent.click(submit);
    }

    const submitAttempts = await waitFor(() => getByTestId("submitAttempts"));
    const submittedCounter = await waitFor(() =>
      getByTestId("submittedCounter")
    );

    expect(Number(submitAttempts.innerHTML)).toBe(attempts);
    expect(Number(submittedCounter.innerHTML)).toBe(attempts);

    fireEvent.click(reset);
    expect(() => getByTestId("submitAttempts")).toThrow();
    expect(() => getByTestId("submittedCounter")).toThrow();
  });

  it("should count the total attempts and the total successfully submissions for sync validation fields", () => {
    const onSubmit = () => {};
    const props = { onSubmit, showEmail: true };
    const { getByTestId } = render(<SimpleFormTestSumbission {...props} />);
    const submit = getByTestId("submit");
    const reset = getByTestId("reset");
    const email = getByTestId("email");

    let CounterSubmitAttempts = getByTestId("CounterSubmitAttempts");
    let CounteSubmitted = getByTestId("CounteSubmitted");

    for (let i = 1; i <= 5; i++) {
      fireEvent.click(submit);
    }

    expect(CounterSubmitAttempts.innerHTML).toBe("5");
    expect(CounteSubmitted.innerHTML).toBe("0");

    fireEvent.click(reset);
    expect(CounterSubmitAttempts.innerHTML).toBe("0");
    expect(CounteSubmitted.innerHTML).toBe("0");

    fireEvent.change(email, { target: { value: "abc@sustancu.it" } });
    for (let i = 1; i <= 5; i++) {
      fireEvent.click(submit);
    }
    expect(CounterSubmitAttempts.innerHTML).toBe("5");
    expect(CounteSubmitted.innerHTML).toBe("5");
  });

  it("should count the total attempts and the total successfully submissions for async validation fields", async () => {
    const onSubmit = () => true;
    const targetSumbission = 1;
    const targetAttempts = 1;
    const props = {
      onSubmit,
      showCollection: true,
      targetSumbission,
      targetAttempts
    };
    const { getByTestId } = render(<SimpleFormTestSumbission {...props} />);
    const submit = getByTestId("submit");
    const reset = getByTestId("reset");
    const addInput = getByTestId("addInput");

    let CounterSubmitAttempts = getByTestId("CounterSubmitAttempts");
    let CounteSubmitted = getByTestId("CounteSubmitted");

    for (let i = 1; i <= 5; i++) {
      fireEvent.click(submit);
    }

    expect(CounterSubmitAttempts.innerHTML).toBe("5");
    expect(CounteSubmitted.innerHTML).toBe("0");

    fireEvent.click(reset);
    expect(CounterSubmitAttempts.innerHTML).toBe("0");
    expect(CounteSubmitted.innerHTML).toBe("0");

    fireEvent.click(addInput);
    fireEvent.click(addInput);
    for (let i = 1; i <= 1; i++) {
      fireEvent.click(submit);
    }

    const submitAttempts = await waitFor(() => getByTestId("submitAttempts"));
    expect(submitAttempts.innerHTML).toBe("1");

    const submittedCounter = await waitFor(() =>
      getByTestId("submittedCounter")
    );
    expect(submittedCounter.innerHTML).toBe("1");
  });
});
