import React from "react";
import { render } from "@testing-library/react";
import { FormContextWithValidation } from "./../components/FormContextWithValidation";

export const mountFormContext = ({ props = {}, children } = {}) =>
  render(
    <React.StrictMode>
      <FormContextWithValidation {...props}>
        {children}
      </FormContextWithValidation>
    </React.StrictMode>
  );
