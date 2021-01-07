import React from "react";
import { render } from "@testing-library/react";
import { Form } from "./../../../src";

export const mountForm = ({ props = {}, children } = {}) =>
  render(
    <React.StrictMode>
      <Form {...props}>{children}</Form>
    </React.StrictMode>
  );
