import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type IconType } from "react-icons";
import { type SvgIconTypeMap } from "@mui/material";
import { type OverridableComponent } from "@mui/material/OverridableComponent";

// Define types for props
interface InputProps {
  label: string;
  type?: string;
  icon?:
    | IconType
    | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string });
  value?: string | File | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
  error?: string;
  className?: string;
  accept?: string; // For file inputs
  disabled?: boolean;
  required?: boolean; // ✅ <-- Added
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      icon: Icon,
      value,
      onChange,
      size = "medium",
      color = "primary",
      error,
      className = "",
      accept,
      disabled = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Size configurations
    const sizeStyles = {
      small: "px-2 py-1 text-sm",
      medium: "px-3 py-2 text-base",
      large: "px-4 py-3 text-lg",
    };

    // Color configurations
    const colorStyles = {
      primary: "focus:border-primary focus:ring-primary",
      secondary: "focus:border-secondary focus:ring-secondary",
      accent: "focus:border-accent focus:ring-accent",
    };

    // Base styles
    const baseStyles = `relative w-full border rounded-lg bg-white focus:outline-none transition-all duration-300
      ${sizeStyles[size]}
      ${colorStyles[color]}
      ${error ? "border-red-500" : "border-gray-300"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
      ${className}`;

    // Label animation variants
    const labelVariants = {
      rest: {
        top:
          size === "small" ? "0.5rem" : size === "large" ? "1rem" : "0.75rem",
        fontSize:
          size === "small" ? "0.75rem" : size === "large" ? "1rem" : "0.875rem",
        color: "#6b7280",
      },
      active: {
        top:
          size === "small"
            ? "-0.75rem"
            : size === "large"
            ? "-1rem"
            : "-0.875rem",
        fontSize:
          size === "small"
            ? "0.65rem"
            : size === "large"
            ? "0.875rem"
            : "0.75rem",
        color:
          color === "primary"
            ? "#4A90E2"
            : color === "secondary"
            ? "#F4A261"
            : "#E76F51",
        backgroundColor: "#ffffff",
        padding: "0 4px",
      },
    };

    // Error animation
    const errorVariants = {
      initial: { x: 0 },
      shake: { x: [-10, 10, -5, 5, 0], transition: { duration: 0.3 } },
    };

    return (
      <motion.div
        className="relative"
        animate={error ? "shake" : "initial"}
        variants={errorVariants}
      >
        <div
          className={`relative ${baseStyles}`}
          onClick={() => {
            if (!disabled) {
              const input = document.getElementById(label) as HTMLInputElement;
              input?.focus();
            }
          }}
        >
          {/* Dynamic Border Animation */}
          <span
            className={`absolute inset-0 rounded-lg p-0.5 -z-10 ${
              isFocused ? "block" : "hidden"
            }`}
          >
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent animate-circle-border"></span>
          </span>

          {/* Icon */}
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon
                className={`${
                  size === "small"
                    ? "w-4 h-4"
                    : size === "large"
                    ? "w-6 h-6"
                    : "w-5 h-5"
                } text-gray-500`}
              />
            </span>
          )}

          {/* Input */}
          <input
            id={label}
            ref={ref}
            type={type}
            value={type !== "file" ? (value as string) || "" : undefined}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(!!value)}
            accept={accept}
            disabled={disabled}
            required={false} // ✅ <-- Added
            className={`w-full bg-transparent focus:outline-none ${
              Icon ? "pl-10" : "pl-3"
            } ${type === "file" ? "cursor-pointer" : ""}`}
            aria-label={label}
          />

          {/* Floating Label */}
          <motion.label
            className="absolute left-3 px-1 pointer-events-none"
            variants={labelVariants}
            animate={isFocused || value ? "active" : "rest"}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export default Input;
