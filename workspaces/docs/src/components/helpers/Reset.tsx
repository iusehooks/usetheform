import React from "react";
import { useForm } from "@usetheform";

export const Reset = ({
  className = "cursor-pointer text-blue-600 hover:underline text-sm flex justify-center items-center"
}) => {
  const { reset, pristine } = useForm();
  return (
    <button
      className={className}
      disabled={pristine}
      type="button"
      onClick={reset}
    >
      Reset
    </button>
  );
};
