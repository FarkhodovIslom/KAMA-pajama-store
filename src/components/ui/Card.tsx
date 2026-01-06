import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", interactive = false, padding = "md", children, ...props }, ref) => {
        const baseStyles = "card";

        const paddingStyles = {
            none: "p-0",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${interactive ? "card-interactive" : ""} ${paddingStyles[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export default Card;
