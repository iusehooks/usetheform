import React from "react";
import { useForm } from "@usetheform";

export const Submit = () => {
  const { isValid } = useForm();
  return (
    <button
      className="cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex justify-center items-center w-full sm:w-auto"
      disabled={!isValid}
      type="submit"
    >
      Submit
    </button>
  );
};
