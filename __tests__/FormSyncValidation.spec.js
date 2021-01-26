import React from "react";
import { cleanup, fireEvent, act } from "@testing-library/react";

import Reset from "./helpers/components/Reset";
import { mountForm } from "./helpers/utils/mountForm";

import { Input, Collection } from "./../src";

afterEach(cleanup);

describe("Component => Form (sync validation)", () => {
  it("should synchronously validate a Form with touched prop false", () => {
    const name = "email";
    const value = "bebo@test.it";
    const props = { validators: [isValidEmail] };
    const children = [
      <Input key="1" data-testid={name} type="text" name={name} />,
      <Reset key="2" forceEnable />
    ];
    const { getByTestId } = mountForm({ props, children });
    const emailInput = getByTestId(name);
    const reset = getByTestId("reset");

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel.innerHTML).toBe("Mail not Valid");

    act(() => {
      fireEvent.change(emailInput, { target: { value } });
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      fireEvent.click(reset);
    });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel.innerHTML).toBe("Mail not Valid");
  });

  it("should synchronously validate a Form with touched prop true", () => {
    const name = "email";
    const value = "bebo@test.it";
    const props = { validators: [isValidEmail], touched: true };
    const children = [
      <Input key="1" data-testid={name} type="text" name={name} />,
      <Reset key="2" forceEnable />
    ];
    const { getByTestId } = mountForm({ props, children });
    const emailInput = getByTestId(name);
    const reset = getByTestId("reset");

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      emailInput.focus();
      emailInput.blur();
    });

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel.innerHTML).toBe("Mail not Valid");

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      fireEvent.change(emailInput, { target: { value } });
    });

    expect(() => getByTestId("errorLabel")).toThrow();
  });

  it("should synchronously validate a nested Form with touched prop true", () => {
    const value = "bebo@test.it";
    const props = { validators: [isArrayOfMailValid], touched: true };
    const children = [
      <Collection object name="user" key="1">
        <Collection array name="mailList">
          <Input data-testid="email1" type="text" />
          <Input data-testid="email2" type="text" />
        </Collection>
      </Collection>,
      <Reset key="2" forceEnable />
    ];
    const { getByTestId } = mountForm({ props, children });
    const emailInput1 = getByTestId("email1");
    const emailInput2 = getByTestId("email2");
    const reset = getByTestId("reset");

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      emailInput2.focus();
      emailInput2.blur();
    });

    let errorLabel = getByTestId("errorLabel");
    expect(errorLabel.innerHTML).toBe("Mail list empty");

    act(() => {
      emailInput2.focus();
      fireEvent.change(emailInput2, { target: { value } });
      emailInput2.blur();
    });

    expect(() => getByTestId("errorLabel")).toThrow();

    act(() => {
      emailInput1.focus();
      fireEvent.change(emailInput1, { target: { value: "invalid@test" } });
      emailInput1.blur();
    });

    errorLabel = getByTestId("errorLabel");
    expect(errorLabel.innerHTML).toBe("Some Mails not Valid");

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("errorLabel")).toThrow();
  });
});

function isValidEmail({ email }) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    ? undefined
    : "Mail not Valid";
}

function isArrayOfMailValid({ user }) {
  if (!user?.mailList?.length || user?.mailList?.length <= 0) {
    return "Mail list empty";
  }

  return user?.mailList?.every?.(email =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  )
    ? undefined
    : "Some Mails not Valid";
}
