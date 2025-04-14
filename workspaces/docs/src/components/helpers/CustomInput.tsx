import React from "react";
import { withIndex, useField } from "@usetheform";

const inputStyle = {
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: "4px"
};

export const CustomInput = withIndex(
  ({ type, name, value, index, placeholder }) => {
    const props = useField({ type, name, value, index });
    return (
      <label
        style={{
          display: "flex",
          position: "relative",
          minWidth: "60px",
          minHeight: "40px",
          flex: 1
        }}
        className="flex items-center"
      >
        <span
          style={{
            display: "block",
            position: "absolute",
            fontSize: "14px",
            background: "white",
            top: "-12px",
            paddingRight: "4px"
          }}
        >
          {placeholder}
        </span>
        <input
          className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          style={inputStyle}
          {...props}
        />
      </label>
    );
  }
);
