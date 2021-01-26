import React, { useState } from "react";
import { default as FormUsetheform } from "./../../src";
import JSONTree from "react-json-tree";

export const Form = ({ onInit, onChange, onReset, ...props }) => {
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
      <FormUsetheform
        onInit={onInitFN}
        onReset={onResetFN}
        onChange={onChangeFN}
        {...props}
      >
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
        <JSONTree data={formState} />
      </div>
    </>
  );
};
