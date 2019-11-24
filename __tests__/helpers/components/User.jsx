import React from "react";
import { Input, Collection } from "./../../../src";

export default function User({ name }) {
  return (
    <div>
      <label>User : </label>
      <Collection object name={name}>
        <Input name="name" type="text" />
        <Input name="lastname" type="text" />
      </Collection>
    </div>
  );
}
