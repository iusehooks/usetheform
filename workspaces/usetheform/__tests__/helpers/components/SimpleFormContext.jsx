import React, { useState } from "react";
import { Input, FormContext, Collection, useForm } from "./../../../src";

const initialState = { tags: ["red", "blue"] };

export default function SimpleFormContext({ onChange, onSubmit, reducers }) {
  const [tags, setTags] = useState(initialState.tags);
  const onChangeState = state => {
    onChange(state);
    setTags(state.tags);
  };

  return (
    <FormContext
      reducers={reducers}
      initialState={initialState}
      onChange={onChangeState}
      onSubmit={onSubmit}
    >
      {tags.map((value, index) => (
        <Tag key={index} value={value} index={index} />
      ))}
      <Form />
    </FormContext>
  );
}

function Form() {
  const { onSubmitForm } = useForm();

  return (
    <form onSubmit={onSubmitForm}>
      <Collection array name="tags">
        <Input type="text" />
        <Input type="text" />
      </Collection>
      <button data-testid="submit" type="submit">
        Submit
      </button>
    </form>
  );
}

function Tag({ value, index }) {
  const { state, dispatch } = useForm();

  const remove = () => {
    const tags = [...state.tags];
    tags[index] = undefined;
    dispatch(state => ({ ...state, tags }));
  };

  return value ? (
    <button data-testid={`button${index}`} onClick={remove}>
      Reset {value}
    </button>
  ) : null;
}
