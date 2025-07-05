import React from "react";
import { motion } from "framer-motion";
import { type IconType } from "react-icons";
import { type SvgIconTypeMap } from "@mui/material";
import { type OverridableComponent } from "@mui/material/OverridableComponent";

// Define types for props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?:
    | IconType
    | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string });
  variant?: "filled" | "outlined";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
  loading?: boolean; // optional if you need loading prop
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  icon: Icon,
  variant = "filled",
  size = "medium",
  color = "primary",
  loading = false,
  onClick,
  disabled = false,
  className = "",
}) => {
  // Size configurations
  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  // Color configurations
  const colorStyles = {
    primary: {
      filled: "bg-primary text-white",
      outlined: "border-primary text-primary hover:bg-primary hover:text-white",
    },
    secondary: {
      filled: "bg-secondary text-white",
      outlined:
        "border-secondary text-black hover:bg-secondary hover:text-white",
    },
    accent: {
      filled: "bg-accent text-white",
      outlined: "border-accent text-accent hover:bg-accent hover:text-white",
    },
  };

  // Base styles
  const baseStyles = `relative font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
    ${sizeStyles[size]}
    ${
      variant === "filled"
        ? colorStyles[color].filled
        : colorStyles[color].outlined
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}`;

  // Animation variants for Framer Motion
  const motionVariants = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.button
      className={baseStyles}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      variants={motionVariants}
      initial="rest"
      animate="rest"
      aria-label={text}
    >
      {/* Circling Border Effect */}
      <span
        className={`absolute inset-0 rounded-lg p-1 -z-10 ${
          variant === "outlined" ? "block" : "hidden"
        }`}
      >
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent animate-circle-border"></span>
      </span>

      {/* Button Content */}
      <span className="flex items-center justify-center gap-2">
        {Icon && (
          <Icon
            className={`${
              size === "small"
                ? "w-4 h-4"
                : size === "large"
                ? "w-6 h-6"
                : "w-5 h-5"
            }`}
          />
        )}
        {text}
      </span>
    </motion.button>
  );
};

export default Button;
