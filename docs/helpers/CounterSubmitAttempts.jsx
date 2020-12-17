import React from "react";
import { useForm } from "./../../src";

export const CounterSubmitAttempts = () => {
  const { submitAttempts } = useForm();
  return <span>{submitAttempts}</span>;
};
