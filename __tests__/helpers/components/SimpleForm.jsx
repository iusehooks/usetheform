import React from "react";
import Form, { Collection } from "./../../../src";
import Submit from "./Submit";
import Email from "./Email";
import TextField from "./TextField";
import Reset from "./Reset";

const SimpleForm = props => (
  <Form {...props}>
    <Collection object name="user">
      <TextField label="Name" name="name" />
      <TextField label="LastName" name="lastname" />
      <Email name="email" />
    </Collection>
    <Submit />
    <Reset />
  </Form>
);

export default SimpleForm;
