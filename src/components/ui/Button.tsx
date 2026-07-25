import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "gradient-brand text-white shadow-[0_8px_20px_-6px_rgba(12,132,150,0.55)] hover:shadow-[0_12px_28px_-6px_rgba(12,132,150,0.7)] hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none",
  secondary:
    "bg-white text-navy border-2 border-navy/15 hover:border-teal hover:text-teal-deep disabled:opacity-40",
  ghost: "bg-transparent text-navy hover:bg-navy/5 disabled:opacity-40",
  danger: "bg-alert text-white hover:brightness-90 disabled:opacity-40",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-[0.95rem] px-6 py-3 gap-2",
  lg: "text-base px-8 py-4 gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`shine inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
