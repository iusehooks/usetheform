import React from "react";
import { InputLabel } from "./InputLabel";
import { Collection } from "./../../src";

export const Item = ({ price = 10, qty = 1, desc }) => {
  return (
    <div style={{ display: "flex", marginRight: "100%" }}>
      <Collection object>
        <InputLabel
          type="number"
          name="price"
          placeholder="Price $"
          value={price}
        />
        <InputLabel
          type="number"
          name="qty"
          placeholder="Quantity"
          value={qty}
        />
        <InputLabel
          type="text"
          name="description"
          placeholder="Description"
          value={desc}
        />
      </Collection>
    </div>
  );
};

export const recudeTotalPrice = formState => {
  const { items = [] } = formState;
  const totalPrice = items.reduce((total, { price = 0, qty = 0 }) => {
    total += price * qty;
    return total;
  }, 0);
  return { ...formState, totalPrice };
};

export const recudeTotalQuantity = formState => {
  const { items = [] } = formState;
  const totalQuantity = items.reduce((total, { qty = 0 }) => {
    total += qty;
    return total;
  }, 0);
  return { ...formState, totalQuantity };
};
