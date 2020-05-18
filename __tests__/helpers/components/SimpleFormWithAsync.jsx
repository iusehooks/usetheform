import React from "react";
import Form from "./../../../src";
import Submit from "./Submit";
import Reset from "./Reset";
import InputAsync from "./InputAsync";

const SimpleFormWithAsync = props => (
  <Form data-testid="form" {...props}>
    <InputAsync name="username" />
    <Submit />
    <Reset />
  </Form>
);

export default SimpleFormWithAsync;
