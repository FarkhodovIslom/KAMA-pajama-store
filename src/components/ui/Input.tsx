import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, helperText, id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--kama-gray-700)] mb-1.5"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <input
                        id={inputId}
                        ref={ref}
                        className={`
                            w-full px-4 py-3 rounded-xl border appearance-none outline-none transition-colors
                            bg-white text-[var(--kama-gray-900)] placeholder-[var(--kama-gray-400)]
                            focus:border-[var(--kama-gold)] focus:ring-1 focus:ring-[var(--kama-gold)]
                            disabled:bg-[var(--kama-gray-50)] disabled:text-[var(--kama-gray-500)] disabled:border-[var(--kama-gray-200)]
                            ${error
                                ? "border-[var(--kama-error)] focus:border-[var(--kama-error)] focus:ring-[var(--kama-error)]"
                                : "border-[var(--kama-gray-300)]"
                            }
                            ${className}
                        `}
                        {...props}
                    />
                </div>

                {(error || helperText) && (
                    <p className={`mt-1.5 text-sm ${error ? "text-[var(--kama-error)]" : "text-[var(--kama-gray-500)]"}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
