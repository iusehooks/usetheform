import React from "react";
import Email from "./Email";
import CollectionAsyncValidation from "./CollectionAsyncValidation";
import Form, { useForm } from "./../../../src";

export const SimpleFormTestSumbission = ({
  targetSumbission,
  targetAttempts,
  showEmail,
  showCollection,
  ...props
}) => {
  return (
    <div>
      <Form data-testid="form" {...props}>
        {showCollection && <CollectionAsyncValidation />}
        {showEmail && <Email name="email" />}
        <Counter />
        <Submit
          targetSumbission={targetSumbission}
          targetAttempts={targetAttempts}
        />
        <Reset />
      </Form>
    </div>
  );
};

function Counter() {
  const { submitted, submitAttempts } = useForm();
  return (
    <>
      <span data-testid="CounterSubmitAttempts">{submitAttempts}</span>
      <span data-testid="CounteSubmitted">{submitted}</span>
    </>
  );
}

function Submit({ targetSumbission = 5, targetAttempts = 10 }) {
  const { submitted, submitAttempts } = useForm();
  return (
    <>
      <button data-testid="submit" type="submit">
        Submit
      </button>
      {targetAttempts === submitAttempts && (
        <span data-testid="submitAttempts">{submitAttempts}</span>
      )}
      {targetSumbission === submitted && (
        <span data-testid="submittedCounter">{submitted}</span>
      )}
    </>
  );
}

function Reset() {
  const { reset } = useForm();
  return (
    <button data-testid="reset" type="button" onClick={reset}>
      Reset
    </button>
  );
}
