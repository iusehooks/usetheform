import React, { useState } from "react";
import {
  Form,
  Collection,
  Input,
  Select,
  PersistStateOnUnmount
} from "./../../../src";
import Submit from "./Submit";
import Email from "./Email";
import TextField from "./TextField";
import Reset from "./Reset";

export const initialState = {
  user: {
    name: "foo",
    lastname: "micky",
    email: "abc@test.it"
  },
  gender: "F",
  other: ["1", "3"],
  select: "1"
};

export const PersistStateOnUnmountHelpers = props => {
  const [showCollection, setShowCollection] = useState(true);
  const [showShowNestedInput, setShowNestedInput] = useState(true);
  const [showShowRadio, setShowRadio] = useState(true);
  const [showShowSelect, setShowShowSelect] = useState(true);

  const toggleSelect = () => {
    setShowShowSelect(prev => !prev);
  };

  const toggleNestedRadio = () => {
    setShowRadio(prev => !prev);
  };

  const toggleNestedInput = () => {
    setShowNestedInput(prev => !prev);
  };

  const toggleCollection = () => {
    setShowCollection(prev => !prev);
  };

  return (
    <>
      <Form initialState={initialState} {...props}>
        {showCollection && (
          <PersistStateOnUnmount>
            <Collection object name="user">
              <TextField label="Name" name="name" data-testid="name" />
              <TextField
                label="LastName"
                name="lastname"
                data-testid="lastname"
              />
              <Email name="email" />
            </Collection>
          </PersistStateOnUnmount>
        )}
        {showShowRadio && (
          <PersistStateOnUnmount>
            <Input type="radio" name="gender" data-testid="genderm" value="M" />
            <Input type="radio" name="gender" data-testid="genderf" value="F" />
          </PersistStateOnUnmount>
        )}
        <Collection array name="other">
          {showShowNestedInput && (
            <PersistStateOnUnmount>
              <Input type="checkbox" data-testid="other1" />
            </PersistStateOnUnmount>
          )}
          <Input type="checkbox" data-testid="other2" />
        </Collection>
        {showShowSelect && (
          <PersistStateOnUnmount>
            <Select name="select" data-testid="select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Select>
          </PersistStateOnUnmount>
        )}
        <Submit />
        <Reset />
      </Form>
      <button
        type="button"
        onClick={toggleCollection}
        data-testid="toggleCollection"
      >
        toggleCollection
      </button>
      <button
        type="button"
        onClick={toggleNestedInput}
        data-testid="toggleNestedInput"
      >
        toggleNestedInput
      </button>
      <button
        type="button"
        onClick={toggleNestedRadio}
        data-testid="toggleNestedRadio"
      >
        toggleNestedRadio
      </button>
      <button type="button" onClick={toggleSelect} data-testid="toggleSelect">
        toggleSelect
      </button>
    </>
  );
};
