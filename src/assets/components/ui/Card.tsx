import React from "react";
import { motion } from "framer-motion";
import { type IconType } from "react-icons";
import { type SvgIconTypeMap } from "@mui/material";
import { type OverridableComponent } from "@mui/material/OverridableComponent";

// Define types for props
interface CardProps {
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  icon?:
    | IconType
    | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string });
  actions?: React.ReactNode;
  color?: "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  children?: React.ReactNode; // Add this line
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  content,
  icon: Icon,
  actions,
  color = "primary",
  size = "medium",
  className = "",
  onClick,
  hoverEffect = true,
}) => {
  // Size configurations
  const sizeStyles = {
    small: "p-4 text-sm",
    medium: "p-6 text-base",
    large: "p-8 text-lg",
  };

  // Color configurations
  const colorStyles = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
  };

  // Base styles
  const baseStyles = `relative bg-white rounded-lg shadow-md border overflow-hidden
    ${sizeStyles[size]}
    ${colorStyles[color]}
    ${onClick ? "cursor-pointer" : ""}
    ${className}`;

  // Animation variants for Framer Motion
  const motionVariants = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: hoverEffect ? 1.03 : 1,
      boxShadow: hoverEffect
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    tap: { scale: hoverEffect ? 0.98 : 1 },
  };

  return (
    <motion.div
      className={baseStyles}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hoverEffect ? "hover" : undefined}
      whileTap={hoverEffect ? "tap" : undefined}
      variants={motionVariants}
      role={onClick ? "button" : "region"}
      aria-label={title || "Card"}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Dynamic Border Animation */}
      <span
        className={`absolute inset-0 rounded-lg p-0.5 -z-10 ${
          hoverEffect ? "block" : "hidden"
        }`}
      >
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent animate-circle-border"></span>
      </span>

      {/* Card Content */}
      <div className="flex flex-col gap-4">
        {(title || Icon) && (
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                className={`${
                  size === "small"
                    ? "w-5 h-5"
                    : size === "large"
                    ? "w-8 h-8"
                    : "w-6 h-6"
                } text-${color}`}
              />
            )}
            {title && (
              <h3
                className={`font-bold ${
                  size === "small"
                    ? "text-base"
                    : size === "large"
                    ? "text-2xl"
                    : "text-xl"
                } text-gray-800`}
              >
                {title}
              </h3>
            )}
          </div>
        )}
        {subtitle && (
          <p
            className={`text-gray-600 ${
              size === "small"
                ? "text-xs"
                : size === "large"
                ? "text-base"
                : "text-sm"
            }`}
          >
            {subtitle}
          </p>
        )}
        {content && <div className="text-gray-700">{content}</div>}
        {actions && <div className="flex gap-2 justify-end">{actions}</div>}
      </div>
    </motion.div>
  );
};

export default Card;
