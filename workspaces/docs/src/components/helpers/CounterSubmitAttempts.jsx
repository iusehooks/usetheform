import React from "react";
import { useForm } from "@usetheform";

export const CounterSubmitAttempts = () => {
  const { submitAttempts } = useForm();
  return <span>{submitAttempts}</span>;
};
