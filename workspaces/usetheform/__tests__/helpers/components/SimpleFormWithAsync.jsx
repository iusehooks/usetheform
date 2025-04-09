import React from "react";
import { Form, Collection } from "./../../../src";
import Submit from "./Submit";
import Reset from "./Reset";
import InputAsync from "./InputAsync";
import CollectionAsyncValidation from "./CollectionAsyncValidation";
import Email from "./Email";

const SimpleFormWithAsync = props => (
  <Form data-testid="form" {...props}>
    <InputAsync name="username" />
    <Submit />
    <Reset />
  </Form>
);

export default SimpleFormWithAsync;

export const expectedInitialState = {
  address: { city: "Milan", details: ["333"] },
  username: "Antonio"
};

const initialState = {
  username: "Antonio",
  address: { details: ["333"] }
};

export const SimpleFormWithAsyncStrictMode = props => (
  <Form data-testid="form" initialState={initialState} {...props}>
    <CollectionAsyncValidation />
    <Email />
    <InputAsync
      dataTestidNotStart="asyncNotStartedYetUsername"
      dataTestidStart="asyncStartUsername"
      dataTestidError="asyncErrorUsername"
      dataTestidSuccess="asyncSuccessUsername"
      dataTestid="username"
      name="username"
    />
    <Collection object name="address">
      <InputAsync
        dataTestidNotStart="asyncNotStartedYetCity"
        dataTestidStart="asyncStartCity"
        dataTestidError="asyncErrorCity"
        dataTestidSuccess="asyncSuccessCity"
        dataTestid="city"
        name="city"
        value="Milan"
      />
      <Collection array name="details">
        <InputAsync
          dataTestidNotStart="asyncNotStartedYetDetails"
          dataTestidStart="asyncStartDetails"
          dataTestidError="asyncErrorDetails"
          dataTestidSuccess="asyncSuccessDetails"
          dataTestid="details"
        />
      </Collection>
    </Collection>
    <Submit />
    <Reset />
  </Form>
);
