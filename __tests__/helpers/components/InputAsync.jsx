import React from "react";
import { Input, useAsyncValidation, withIndex } from "./../../../src";

const asyncTest = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length <= 3) {
        reject("Error");
      } else resolve("Success");
    }, 50);
  });

export function InputAsync({
  name,
  dataTestid = "asyncinput",
  dataTestidStart = "asyncStart",
  dataTestidError = "asyncError",
  dataTestidSuccess = "asyncSuccess",
  value,
  index
}) {
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div data-testid="asyncinput_wrapper">
      <label>InputAsync: </label>
      <Input
        touched
        index={index}
        name={name}
        {...asyncValidation}
        type="text"
        value={value}
        data-testid={dataTestid}
      />
      {asyncStatus.status === undefined && (
        <label data-testid="asyncNotStartedYet">asyncNotStartedYet</label>
      )}
      {asyncStatus.status === "asyncStart" && (
        <label data-testid={dataTestidStart}>Checking...</label>
      )}
      {asyncStatus.status === "asyncError" && (
        <label data-testid={dataTestidError}>{asyncStatus.value}</label>
      )}
      {asyncStatus.status === "asyncSuccess" && (
        <label data-testid={dataTestidSuccess}>{asyncStatus.value}</label>
      )}
    </div>
  );
}

export default withIndex(InputAsync);
