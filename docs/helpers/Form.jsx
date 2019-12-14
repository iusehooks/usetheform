import React, { useState } from "react";
import { default as FormUsetheform } from "../../src";
import JSONTree from "react-json-tree";

export const Form = props => {
  const [formState, setState] = useState({});
  const onInit = state => {
    props.onInit && props.onInit(state);
    setState(state);
  };
  const onChange = state => {
    props.onChange && props.onChange(state);
    setState(state);
  };
  return (
    <>
      <FormUsetheform onInit={onInit} onChange={onChange}>
        {props.children}
      </FormUsetheform>
      <JSONTree data={formState} />
    </>
  );
};
