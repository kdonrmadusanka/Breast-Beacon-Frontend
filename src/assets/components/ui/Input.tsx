import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type IconType } from "react-icons";
import { type SvgIconTypeMap } from "@mui/material";
import { type OverridableComponent } from "@mui/material/OverridableComponent";

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
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
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
      required = false,
      name,
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

    // Base styles with date-specific adjustments
    const baseStyles = `relative w-full border rounded-lg bg-white focus:outline-none transition-all duration-300
      ${sizeStyles[size]}
      ${colorStyles[color]}
      ${error ? "border-red-500" : "border-gray-300"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
      ${type === "date" ? "text-gray-900 appearance-none pl-3" : ""}
      ${className}`;

    // Label animation variants
    const labelVariants = {
      rest: {
        top:
          size === "small" ? "0.5rem" : size === "large" ? "1rem" : "0.75rem",
        left: type === "date" ? "0.75rem" : "0.75rem",
        fontSize:
          size === "small" ? "0.75rem" : size === "large" ? "1rem" : "0.875rem",
        color: "#6b7280",
        opacity: type === "date" && !value ? 0 : 1, // Hide label for date input when no value
        zIndex: type === "date" ? 10 : 1,
      },
      active: {
        top:
          size === "small"
            ? "-0.75rem"
            : size === "large"
            ? "-1rem"
            : "-0.875rem",
        left: type === "date" ? "0.5rem" : "0.75rem",
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
        padding: type === "date" ? "0 2px" : "0 4px",
        opacity: 1, // Always visible when active
        zIndex: type === "date" ? 10 : 1,
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
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
            name={name}
            value={type !== "file" ? (value as string) || "" : undefined}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(!!value)}
            accept={accept}
            disabled={disabled}
            required={required}
            className={`w-full bg-transparent focus:outline-none
              ${Icon ? "pl-10" : type === "date" ? "pl-3" : "pl-3"}
              ${type === "file" ? "cursor-pointer" : ""}
              ${type === "date" ? "leading-normal" : ""}`}
            style={type === "date" ? { lineHeight: "1.5" } : undefined}
            aria-label={label}
          />

          {/* Floating Label */}
          <motion.label
            className="absolute px-1 pointer-events-none"
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

        {/* Date-specific CSS to handle browser quirks */}
        {type === "date" && (
          <style>
            {`
              #${label}::-webkit-date-and-time-value {
                text-align: left;
                color: #111827;
                height: auto;
                line-height: normal;
              }
              #${label}::-webkit-calendar-picker-indicator {
                background: transparent;
                cursor: pointer;
                padding: 0;
                margin-right: 8px;
                z-index: 10;
              }
              #${label}:focus::-webkit-calendar-picker-indicator {
                opacity: 0.7;
              }
            `}
          </style>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export default Input;
