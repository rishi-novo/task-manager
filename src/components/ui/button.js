import React from 'react';

export const Button = ({ variant, size, className, children, ...props }) => {
    const baseStyles = "px-4 py-2 rounded focus:outline-none";
    const variantStyles = variant === "outline" ? "border border-gray-300" : "bg-blue-500 text-white";
    const sizeStyles = size === "icon" ? "p-2" : "text-sm";

    return (
        <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};