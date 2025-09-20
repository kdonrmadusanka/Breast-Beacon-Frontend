import React from "react";

type ButtonVariant = "Primary" | "Secondary" | "Danger";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: ()=>void;
    variant?: ButtonVariant;
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant= "Primary",
    disabled= false,
    className= "",
}) => {
    const variantStyles: Record<ButtonVariant, string> = {
        Primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500",
        Secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500",
        Danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
    }

    return (
        <button
        onClick={onClick}
        disabled={disabled}
        className={`${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    )

}

export default Button;