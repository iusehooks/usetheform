import React from "react";
import { Input, useAsyncValidation } from "./../../../src";

const asyncTest = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length <= 3) {
        reject("Error");
      } else resolve("Success");
    }, 90);
  });

export default function InputAsync({ name, dataTestid = "asyncinput" }) {
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div>
      <label>InputAsync: </label>
      <Input
        touched
        name={name}
        {...asyncValidation}
        type="text"
        data-testid={dataTestid}
      />
      {asyncStatus.status === "asyncStart" && (
        <label data-testid="asyncStart">Checking...</label>
      )}
      {asyncStatus.status === "asyncError" && (
        <label data-testid="asyncError">{asyncStatus.value}</label>
      )}
      {asyncStatus.status === "asyncSuccess" && (
        <label data-testid="asyncSuccess">{asyncStatus.value}</label>
      )}
    </div>
  );
}
