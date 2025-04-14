import React from "react";
import { render } from "@testing-library/react";
import { FormWithValidation } from "./../components/FormWithValidation";

export const mountForm = ({ props = {}, children } = {}) =>
  render(
    <React.StrictMode>
      <FormWithValidation {...props}>{children}</FormWithValidation>
    </React.StrictMode>
  );
