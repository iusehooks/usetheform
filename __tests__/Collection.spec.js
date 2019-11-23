import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Form, { Input, Collection } from "./../src";

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

  it("should use a reducer to reduce the Collection value", () => {
    const onInit = jest.fn(state => state);
    const reducedValue = 3;
    const reducer = value => [...value, reducedValue];
    const props = { onInit };
    const value = "foo";
    const children = [
      <Collection key="1" array name={name} reducers={reducer}>
        <Input data-testid={dataTestid} type={typeInput} value={value} />
        <Input data-testid={dataTestid} type={typeInput} />
      </Collection>
    ];
    mountForm({ props, children });
    expect(onInit).toHaveReturnedWith({ [name]: [value, reducedValue] });
  });
});
