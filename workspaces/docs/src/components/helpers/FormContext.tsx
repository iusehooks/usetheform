import React, { useState } from "react";
import {
  FormContext as FormContextMain,
  useForm,
  Form as FormMain
} from "@usetheform";
import { JSONTree } from "react-json-tree";

export const FormContext = ({ onInit, onChange, ...props }) => {
  const [formState, setState] = useState({});
  const onInitFN = (state) => {
    onInit && onInit(state);
    setState(state);
  };
  const onChangeFN = (state) => {
    onChange && onChange(state);
    setState(state);
  };
  return (
    <div className="FormContext">
      <FormContextMain onInit={onInitFN} onChange={onChangeFN} {...props}>
        {props.children}
      </FormContextMain>
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
          valueRenderer={(raw) => (
            <span style={{ color: "rgb(133, 153, 0)" }}>{raw}</span>
          )}
        />
      </div>
    </div>
  );
};

export const Form = ({ onInit, onChange, onReset, ...props }) => {
  try {
    const { onSubmitForm } = useForm();
    return (
      <form
        className="FormCustom mx-auto bg-white space-y-8 rounded-lg p-4"
        onSubmit={onSubmitForm}
      >
        {props.children}
      </form>
    );
  } catch (error) {
    const [formState, setState] = useState({});
    const onInitFN = (state, isValid) => {
      onInit && onInit(state, isValid);
      setState(state);
    };
    const onChangeFN = (state, isValid) => {
      onChange && onChange(state, isValid);
      setState(state);
    };

    const onResetFN = (state, isValid) => {
      onReset && onReset(state, isValid);
      setState(state);
    };
    return (
      <>
        <FormMain
          className="FormCustom mx-auto bg-white space-y-8 rounded-lg p-4"
          onInit={onInitFN}
          onReset={onResetFN}
          onChange={onChangeFN}
          {...props}
        >
          {props.children}
        </FormMain>
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
            valueRenderer={(raw) => (
              <span style={{ color: "rgb(133, 153, 0)" }}>{raw}</span>
            )}
          />
        </div>
      </>
    );
  }
};
