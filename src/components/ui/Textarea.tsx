import { type TextareaHTMLAttributes, forwardRef, useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-semibold text-navy/80">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          className={`rounded-2xl border-2 bg-soft px-4 py-3 text-[0.95rem] text-navy placeholder:text-navy/35 transition-colors focus:outline-none focus:bg-white resize-y ${
            error ? "border-alert" : "border-transparent focus:border-teal"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-error`} className="text-sm text-alert">
            {error}
          </p>
        ) : hint ? (
          <p id={`${textareaId}-hint`} className="text-sm text-navy/55">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
