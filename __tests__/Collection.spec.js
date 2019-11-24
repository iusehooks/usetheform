import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import Form, { Input, Collection } from "./../src";

import CollectionValidation from "./helpers/components/CollectionValidation";
import CollectionAsyncValidation from "./helpers/components/CollectionAsyncValidation";

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
});
