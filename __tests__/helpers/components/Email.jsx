import React from "react";
import { Input, useValidation } from "./../../../src";

const email = value =>
  !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
    ? undefined
    : "Mail not Valid";
const required = value => (value && value !== "" ? undefined : "Required");

export default function Email({ name }) {
  const [status, validation] = useValidation([required, email]);
  return (
    <div>
      <label>Email: </label>
      <Input touched name={name} {...validation} type="text" />
      {status.error && <label>{status.error}</label>}
    </div>
  );
}
