"use client";

import { forwardRef } from "react";
import { ClipLoader } from "react-spinners";

import { useFormStatus } from "react-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      placeholder,
      type,
      required,
      disabled,
      errors,
      className,
      defaultValue,
      onBlur,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <>
        <div className=" space-y-2">
          <div className=" space-y-1">
            {label ? (
              <div>
                <Label
                  htmlFor={id}
                  className="text-xs font-semibold text-neutral-700"
                >
                  {label}
                </Label>
              </div>
            ) : null}
            <Input
              onBlur={onBlur}
              ref={ref}
              id={id}
              type={type}
              placeholder={placeholder}
              required={required}
              disabled={disabled || pending}
              className={cn("text-sm px-2 py-1 h-7", className)}
              defaultValue={defaultValue}
              name={id}
              aria-describedby={`${id}-error`}
            />
          </div>
          <FormErrors errors={errors} id={id} />
          {pending && (
            <div className="flex justify-center items-center">
              <ClipLoader size={24} color="#008080" />
            </div>
          )}
        </div>
      </>
    );
  }
);

FormInput.displayName = "FormInput";
