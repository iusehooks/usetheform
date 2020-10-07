import React, { useState } from "react";
import Form, { Collection, Input } from "./../../../src";
import Submit from "./Submit";
import Email from "./Email";
import TextField from "./TextField";
import Reset from "./Reset";

const SimpleForm = props => (
  <Form data-testid="form" {...props}>
    <Collection object name="user">
      <TextField label="Name" name="name" data-testid="name" />
      <TextField label="LastName" name="lastname" data-testid="lastname" />
      <Email name="email" />
    </Collection>
    <Submit />
    <Reset />
  </Form>
);

export default SimpleForm;

export const SimpleFormDynamicField = props => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Form data-testid="form" {...props}>
        {show && (
          <div>
            <Input type="radio" name="radio" value="1" />
            <Input
              type="radio"
              name="radio"
              data-testid="radio2"
              checked
              value="2"
            />
            <Input type="radio" name="radio" value="3" />
            <Input type="radio" data-testid="radio" name="radio" value="4" />
          </div>
        )}

        {show && (
          <div>
            <Input
              type="checkbox"
              data-testid="checkbox1"
              name="checkbox1"
              value="1"
            />
            <Input
              type="checkbox"
              data-testid="checkbox2"
              name="checkbox2"
              checked
              value="2"
            />
            <Input type="checkbox" name="checkbox3" value="3" />
          </div>
        )}

        {show && (
          <div>
            <Input type="text" data-testid="text1" name="text1" />
            <Input type="text" data-testid="text2" name="text2" value="2" />
            <Input type="text" name="text3" />
          </div>
        )}

        <Submit />
        <Reset />
      </Form>
      <button
        type="button"
        data-testid="add"
        onClick={() => setShow(true)}
      ></button>
    </div>
  );
};
