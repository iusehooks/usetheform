import React from "react";
import { Input } from "@usetheform";

const inputStyle = {
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: "4px"
};

export const InputLabel = ({ placeholder = "", ...restProps }) => {
  if (restProps.type === "radio") {
    return (
      <div className="flex items-center space-x-2 cursor-pointer">
        <Input
          {...restProps}
          id={placeholder}
          className="cursor-pointer w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <label
          htmlFor={placeholder}
          className="text-gray-700 font-medium cursor-pointer"
        >
          {placeholder}
        </label>
      </div>
    );
  }
  if (restProps.type === "checkbox") {
    return (
      <div className="flex items-center space-x-2 cursor-pointer">
        <Input
          {...restProps}
          id={placeholder}
          className="cursor-pointer w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        <label
          htmlFor={placeholder}
          className="text-gray-700 font-medium cursor-pointer"
        >
          {placeholder}
        </label>
      </div>
    );
  }

  return (
    <label
      style={{
        display: "flex",
        position: "relative",
        minWidth: "60px",
        minHeight: "40px",
        flex: 1,
        borderRadius: "4px"
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
          borderRadius: "4px",
          paddingRight: "4px"
        }}
      >
        {placeholder}
      </span>
      <Input
        className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        style={inputStyle}
        {...restProps}
      />
    </label>
  );
};
