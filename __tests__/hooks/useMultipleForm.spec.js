import React from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import Wizard from "./../helpers/components/Wizard";

afterEach(cleanup);

describe("Hooks => useMultipleForm", () => {
  it("should render multiple Forms as a Wizard", () => {
    const onSubmitWizard = jest.fn();
    const props = { onSubmitWizard };

    const { getByTestId } = render(<Wizard {...props} />);
    const next = getByTestId("next");
    act(() => {
      fireEvent.click(next);
    });

    const submit = getByTestId("submit");
    act(() => {
      fireEvent.click(submit);
    });
    expect(onSubmitWizard).toHaveBeenCalledWith({});
  });
  it("should handle multiple Forms as a Wizard", () => {
    const onChangeWizard = jest.fn();
    const onSubmitWizard = jest.fn();

    const props = { onSubmitWizard, onChangeWizard };
    const { getByTestId } = render(<Wizard {...props} />);

    let name = getByTestId("name");
    fireEvent.change(name, { target: { value: "foo" } });
    expect(onChangeWizard).toHaveBeenCalledWith({ name: "foo" });

    let next = getByTestId("next");
    fireEvent.click(next);

    let lastname = getByTestId("lastname");
    fireEvent.change(lastname, { target: { value: "micky" } });
    expect(onChangeWizard).toHaveBeenCalledWith({
      name: "foo",
      lastname: "micky"
    });

    const prev = getByTestId("prev");
    fireEvent.click(prev);
    name = getByTestId("name");
    fireEvent.change(name, { target: { value: "duck" } });
    expect(onChangeWizard).toHaveBeenCalledWith({
      name: "duck",
      lastname: "micky"
    });

    next = getByTestId("next");
    fireEvent.click(next);

    lastname = getByTestId("lastname");
    fireEvent.change(lastname, { target: { value: "foo" } });
    expect(onChangeWizard).toHaveBeenCalledWith({
      name: "duck",
      lastname: "foo"
    });

    const submit = getByTestId("submit");
    fireEvent.click(submit);
    expect(onSubmitWizard).toHaveBeenCalledWith({
      name: "duck",
      lastname: "foo"
    });
  });
});
