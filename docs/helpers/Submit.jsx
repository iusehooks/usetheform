import React from "react";
import { useForm } from "../../src";

export const Submit = props => {
  const { isValid } = useForm();
  return (
    <button disabled={!isValid} type="submit">
      Submit
    </button>
  );
};
