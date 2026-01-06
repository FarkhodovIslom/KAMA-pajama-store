import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", fullWidth, children, ...props }, ref) => {
        const baseStyles = "btn";

        const variantStyles = {
            primary: "btn-primary",
            secondary: "btn-secondary",
            ghost: "btn-ghost",
        };

        const sizeStyles = {
            sm: "text-sm py-2 px-4 min-h-[44px]",
            md: "text-base py-3 px-6",
            lg: "text-lg py-4 px-8",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
