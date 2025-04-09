import React from "react";
import {
  cleanup,
  fireEvent,
  act,
  waitFor,
  render
} from "@testing-library/react";

import Reset from "./helpers/components/Reset";
import Submit from "./helpers/components/Submit";
import SimpleFormWithAsync from "./helpers/components/SimpleFormWithAsync";
import { mountForm } from "./helpers/utils/mountForm";

import { Input, Collection } from "./../src";

afterEach(cleanup);

describe("Component => Form (Async validation)", () => {
  it("should asynchronously validate a Form", async () => {
    const name = "email";
    const value = "bebo@test.it";
    const props = { asyncValidatorFunc: isValidEmail };
    const children = [
      <Input key="1" data-testid={name} type="text" name={name} />,
      <Submit key="2" forceEnable />,
      <Reset key="3" forceEnable />
    ];
    const { getByTestId } = mountForm({ props, children });
    const emailInput = getByTestId(name);
    const reset = getByTestId("reset");
    const submit = getByTestId("submit");

    expect(() => getByTestId("asyncStart")).toThrow();

    act(() => {
      fireEvent.change(emailInput, { target: { value } });
      fireEvent.click(submit);
    });

    let asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    expect(asyncStart.innerHTML).toBe("Checking...");

    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess).toBeDefined();
    expect(asyncSuccess.innerHTML).toBe("Success");

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("asyncStart")).toThrow();
    expect(() => getByTestId("asyncSuccess")).toThrow();
    expect(() => getByTestId("asyncError")).toThrow();

    act(() => {
      fireEvent.change(emailInput, { target: { value: "bademail#live.it" } });
      fireEvent.click(submit);
    });

    asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();
    expect(asyncStart.innerHTML).toBe("Checking...");

    const asyncError = await waitFor(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();
    expect(asyncError.innerHTML).toBe("Mail not Valid");

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("asyncStart")).toThrow();
    expect(() => getByTestId("asyncSuccess")).toThrow();
    expect(() => getByTestId("asyncError")).toThrow();
  });

  it("should asynchronously validate a nested Form with Collection", async () => {
    const value = "bebo@test.it";
    const props = { asyncValidatorFunc: isValidEmailNested };
    const children = [
      <Collection object name="user" key="1">
        <Collection array name="mailList">
          <Input data-testid="email1" type="text" />
          <Input data-testid="email2" type="text" />
        </Collection>
      </Collection>,
      <Submit key="2" forceEnable />,
      <Reset key="3" forceEnable />
    ];
    const { getByTestId } = mountForm({ props, children });
    const emailInput1 = getByTestId("email1");
    const emailInput2 = getByTestId("email2");
    const reset = getByTestId("reset");
    const submit = getByTestId("submit");

    expect(() => getByTestId("asyncStart")).toThrow();

    act(() => {
      fireEvent.change(emailInput1, { target: { value } });
      fireEvent.click(submit);
    });

    let asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();

    expect(asyncStart.innerHTML).toBe("Checking...");

    let asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess).toBeDefined();
    expect(asyncSuccess.innerHTML).toBe("Success");

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("asyncStart")).toThrow();
    expect(() => getByTestId("asyncSuccess")).toThrow();
    expect(() => getByTestId("asyncError")).toThrow();

    act(() => {
      fireEvent.change(emailInput2, { target: { value: "bademail#live.it" } });
      fireEvent.click(submit);
    });

    asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();
    expect(asyncStart.innerHTML).toBe("Checking...");

    const asyncError = await waitFor(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();
    expect(asyncError.innerHTML).toBe("Some Mails not Valid");

    act(() => {
      fireEvent.click(reset);
    });

    expect(() => getByTestId("asyncStart")).toThrow();
    expect(() => getByTestId("asyncSuccess")).toThrow();
    expect(() => getByTestId("asyncError")).toThrow();

    act(() => {
      fireEvent.change(emailInput1, { target: { value } });
      fireEvent.change(emailInput1, { target: { value } });
      fireEvent.click(submit);
    });

    asyncStart = await waitFor(() => getByTestId("asyncStart"));
    expect(asyncStart).toBeDefined();
    expect(asyncStart.innerHTML).toBe("Checking...");

    asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess).toBeDefined();
    expect(asyncSuccess.innerHTML).toBe("Success");
  });

  it("should asynchronously validate Form with muliple editing on same field", async () => {
    const initialState = { username: "1234" };

    const props = { initialState };
    const { getByTestId } = render(<SimpleFormWithAsync {...props} />);
    const asyncinput = getByTestId("asyncinput");

    const asyncSuccess = await waitFor(() => getByTestId("asyncSuccess"));
    expect(asyncSuccess).toBeDefined();

    act(() => {
      fireEvent.change(asyncinput, { target: { value: "423456" } });
      asyncinput.focus();
      asyncinput.blur();
    });

    act(() => {
      fireEvent.change(asyncinput, { target: { value: "123" } });
      asyncinput.focus();
      asyncinput.blur();
    });

    const asyncError = await waitFor(() => getByTestId("asyncError"));
    expect(asyncError).toBeDefined();
  });
});

function isValidEmail({ email }) {
  return new Promise((resolve, reject) => {
    // it could be an API call or any async operation
    setTimeout(() => {
      const isValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
      if (!isValid) {
        reject("Mail not Valid");
      } else {
        resolve("Success");
      }
    }, 1000);
  });
}

function isValidEmailNested({ user }) {
  return new Promise((resolve, reject) => {
    // it could be an API call or any async operation
    setTimeout(() => {
      if (!user?.mailList?.length || user?.mailList?.length <= 0) {
        reject("Mail list empty");
      }
      const isValid = user?.mailList?.every?.(email =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
      );
      if (!isValid) {
        reject("Some Mails not Valid");
      } else {
        resolve("Success");
      }
    }, 1000);
  });
}
