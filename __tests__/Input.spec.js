import React from "react";
import { render, fireEvent } from "@testing-library/react";

import From, { Input } from "./../src";

const mountFrom = ({ props, children } = {}) =>
  render(<From {...props}>{children}</From>);

describe("Component => Input", () => {
  it("should render a Form with one Input => type text", () => {
    const children = [<Input key="1" type="text" />];
    const props = { store };
    const { container } = mountFrom({ props, children });
    expect(container.children.length).toBe(children.length);
  });
});
