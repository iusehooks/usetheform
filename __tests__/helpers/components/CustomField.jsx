import React, { useEffect } from "react";
import { useField, withIndex } from "./../../../src";

export const CustomField = withIndex(
  ({
    type = "custom",
    name,
    value,
    jestFN = () => {},
    valueToChange = "5"
  }) => {
    const props = useField({ type, name, value });
    const onChange = () => props.onChange({ target: { value: valueToChange } });
    useEffect(() => {
      jestFN(props.value);
    }, []);
    return (
      <>
        <pre>
          <code data-testid="output">{JSON.stringify(props.value)}</code>
        </pre>
        <button type="button" data-testid="buttonChange" onClick={onChange}>
          Change Value
        </button>
      </>
    );
  }
);
