import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div>
                {label && <label> {label} </label>}
                <input
                    ref={ref}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors
                        ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}
                        ${className}`}
                    {...props}
                />
                {error && <p> {error} </p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;