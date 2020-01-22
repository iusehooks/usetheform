import React, { useState } from "react";
import { FormContext as FormUsetheform, useForm } from "./../../src";
import JSONTree from "react-json-tree";

export const FormContext = ({ onInit, onChange, ...props }) => {
  const [formState, setState] = useState({});
  const onInitFN = state => {
    onInit && onInit(state);
    setState(state);
  };
  const onChangeFN = state => {
    onChange && onChange(state);
    setState(state);
  };
  return (
    <>
      <FormUsetheform onInit={onInitFN} onChange={onChangeFN} {...props}>
        {props.children}
      </FormUsetheform>
      <JSONTree data={formState} />
    </>
  );
};

export const Form = ({ children }) => {
  const { onSubmitForm } = useForm();
  return <form onSubmit={onSubmitForm}>{children}</form>;
};
