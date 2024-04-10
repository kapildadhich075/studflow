"use client";

import { XCircle } from "lucide-react";

interface FormErrorsProps {
  errors?: Record<string, string[] | undefined>;
  id: string;
}

export const FormErrors = ({ errors, id }: FormErrorsProps) => {
  if (!errors) {
    return null;
  }

  return (
    <div
      id={`${id}-errors`}
      aria-live="polite"
      className="mt-2 text-xs text-red-500"
    >
      {errors?.[id]?.map((error: string) => (
        <div
          key={error}
          className="flex items-center font-medium p-2 border border-rose-500
          bg-rose-500/10 rounded-sm
          "
        >
          <XCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
};
