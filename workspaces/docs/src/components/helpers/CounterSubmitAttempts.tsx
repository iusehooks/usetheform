import React from "react";
import { useForm } from "@usetheform";

export const CounterSubmitAttempts = () => {
  const { submitAttempts } = useForm();
  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md shadow-sm">
      <span>Submission Attempts:</span>
      <span className="font-semibold text-blue-600">{submitAttempts}</span>
    </div>
  );
};
