import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-mountain-pine text-white hover:bg-mountain-pine/90 active:bg-mountain-pine/80":
              variant === "primary",
            "bg-granite-100 text-granite-800 hover:bg-granite-200 active:bg-granite-300":
              variant === "secondary",
            "bg-transparent text-granite-700 hover:bg-granite-100 active:bg-granite-200":
              variant === "ghost",
            "border border-granite-300 bg-white text-granite-700 hover:bg-granite-50 active:bg-granite-100":
              variant === "outline",
            // Sizes
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
