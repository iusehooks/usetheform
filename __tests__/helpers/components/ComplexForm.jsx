import React, { useRef, useState } from "react";
import Form, { Collection, Input, Select, TextArea } from "./../../../src";
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
  sex: "F",
  other: ["1", "3"],
  age: 20,
  date: "2019-11-14",
  select: "1",
  textarea: "foo"
};

export const ComplexForm = props => {
  const [inputs, addInput] = useState([]);
  const counter = useRef(0);
  const add = () => {
    counter.current++;
    addInput(prev => [...prev, { id: counter.current }]);
  };

  const remove = () => {
    addInput(prev => prev.slice(0, -1));
  };

  return (
    <>
      <Form initialState={initialState} {...props}>
        <Collection object name="user">
          <TextField label="Name" name="name" data-testid="name" />
          <TextField label="LastName" name="lastname" data-testid="lastname" />
          <Email name="email" />
        </Collection>
        <Input type="radio" name="sex" data-testid="sexm" value="M" />
        <Input type="radio" name="sex" data-testid="sexf" value="F" />
        <Collection array name="other">
          <Input type="checkbox" data-testid="other1" />
          <Input type="checkbox" data-testid="other2" />
        </Collection>
        <Input type="range" name="age" min="0" max="120" data-testid="age" />
        <Input type="date" name="date" data-testid="date" />
        <Select name="select" data-testid="select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </Select>
        <TextArea name="textarea" data-testid="textarea" />
        {inputs.map(({ id }) => (
          <Input type="text" key={id} name={id} value={id} />
        ))}
        <Submit />
        <Reset />
      </Form>
      <button type="button" onClick={add} data-testid="addinput">
        ADD MORE
      </button>
      <button type="button" onClick={remove} data-testid="removeinput">
        Remove
      </button>
    </>
  );
};

export const ComplexFormInitValueAsProps = props => {
  const [inputs, addInput] = useState([]);
  const counter = useRef(0);
  const add = () => {
    counter.current++;
    addInput(prev => [...prev, { id: counter.current }]);
  };

  const remove = () => {
    addInput(prev => prev.slice(0, -1));
  };

  return (
    <>
      <Form {...props}>
        <Collection object name="user">
          <TextField label="Name" name="name" data-testid="name" value="foo" />
          <TextField
            label="LastName"
            name="lastname"
            data-testid="lastname"
            value="micky"
          />
          <Email name="email" value="abc@test.it" />
        </Collection>
        <Input type="radio" name="sex" data-testid="sexm" value="M" />
        <Input type="radio" name="sex" data-testid="sexf" value="F" checked />
        <Collection array name="other">
          <Input type="checkbox" data-testid="other1" value="1" checked />
          <Input type="checkbox" data-testid="other2" value="3" checked />
        </Collection>
        <Input
          type="range"
          name="age"
          min="0"
          max="120"
          data-testid="age"
          value={20}
        />
        <Input type="date" name="date" data-testid="date" value="2019-11-14" />
        <Select name="select" data-testid="select" value="1">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </Select>
        <TextArea name="textarea" data-testid="textarea" value="foo" />
        {inputs.map(({ id }) => (
          <Input type="text" key={id} name={id} value={id} />
        ))}
        <Submit />
        <Reset />
      </Form>
      <button type="button" onClick={add} data-testid="addinput">
        ADD MORE
      </button>
      <button type="button" onClick={remove} data-testid="removeinput">
        Remove
      </button>
    </>
  );
};
