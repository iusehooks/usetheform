import React, { useState } from "react";
import { FormContext as FormUsetheform, useForm } from "@usetheform";
import { JSONTree } from "react-json-tree";

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
      <div
        style={{
          borderRadius: "4px",
          paddingLeft: "0.30em",
          paddingRight: "0.30em",
          paddingBottom: "0.25em",
          backgroundColor: "rgb(0, 43, 54)"
        }}
      >
        <JSONTree
          data={formState}
          valueRenderer={raw => (
            <span style={{ color: "rgb(133, 153, 0)" }}>{raw}</span>
          )}
        />
      </div>
    </>
  );
};

export const Form = ({ children }) => {
  const { onSubmitForm } = useForm();
  return (
    <form
      className="FormCustom mx-auto bg-white space-y-8 rounded-lg p-4"
      onSubmit={onSubmitForm}
    >
      {children}
    </form>
  );
};
