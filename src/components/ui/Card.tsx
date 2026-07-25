import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  interactive?: boolean;
}

export function Card({ children, padded = true, interactive = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`${interactive ? "brand-card" : ""} bg-white border border-border/70 rounded-[20px] shadow-[var(--shadow-card)] ${padded ? "p-6" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
