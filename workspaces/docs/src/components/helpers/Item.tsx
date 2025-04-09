import React from "react";
import { InputLabel } from "./InputLabel";
import { Collection } from "@usetheform";

export const Item = ({ price = 10, qty = 1, desc }) => {
  return (
    <div className="flex space-x-2">
      <Collection object>
        <InputLabel
          type="number"
          min={1}
          name="price"
          placeholder="Price $"
          value={price}
        />
        <InputLabel
          type="number"
          name="qty"
          min={1}
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

export const reduceTotalPrice = formState => {
  const { items = [] } = formState;
  const totalPrice = items.reduce((total, { price = 0, qty = 0 }) => {
    total += price * qty;
    return total;
  }, 0);
  return { ...formState, totalPrice };
};

export const reduceTotalQuantity = formState => {
  const { items = [] } = formState;
  const totalQuantity = items.reduce((total, { qty = 0 }) => {
    total += qty;
    return total;
  }, 0);
  return { ...formState, totalQuantity };
};
