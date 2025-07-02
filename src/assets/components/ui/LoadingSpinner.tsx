import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiCircle, FiAperture } from "react-icons/fi";

type SpinnerType = "pulse" | "orbit" | "ripple" | "infinity" | "dots";
type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "info";

interface LoadingSpinnerProps {
  type?: SpinnerType;
  size?: SpinnerSize;
  color?: SpinnerColor;
  text?: string;
  className?: string;
  textClassName?: string;
  speed?: "slow" | "normal" | "fast";
  center?: boolean;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = "orbit",
  size = "md",
  color = "primary",
  text,
  className = "",
  textClassName = "",
  speed = "normal",
  center = false,
  overlay = false,
  overlayColor = "rgba(255, 255, 255, 0.8)",
  overlayOpacity = 0.8,
}) => {
  // Size configurations
  const sizeStyles = {
    xs: { container: "w-4 h-4", text: "text-xs" },
    sm: { container: "w-6 h-6", text: "text-sm" },
    md: { container: "w-8 h-8", text: "text-base" },
    lg: { container: "w-12 h-12", text: "text-lg" },
    xl: { container: "w-16 h-16", text: "text-xl" },
  };

  // Color configurations
  const colorStyles = {
    primary: "text-blue-500",
    secondary: "text-purple-500",
    accent: "text-pink-500",
    success: "text-green-500",
    danger: "text-red-500",
    warning: "text-yellow-500",
    info: "text-cyan-500",
  };

  // Speed configurations
  const speedStyles = {
    slow: { duration: 2.5, dotsDuration: 1.5 },
    normal: { duration: 1.5, dotsDuration: 1 },
    fast: { duration: 0.8, dotsDuration: 0.5 },
  };

  // Animation variants for different spinner types
  const spinnerVariants = {
    pulse: {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: speedStyles[speed].duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
    orbit: {
      animate: {
        rotate: 360,
        transition: {
          duration: speedStyles[speed].duration,
          repeat: Infinity,
          ease: "linear",
        },
      },
    },
    ripple: {
      initial: { scale: 0.5, opacity: 0 },
      animate: {
        scale: [0.5, 1, 1.2],
        opacity: [0, 1, 0],
        transition: {
          duration: speedStyles[speed].duration,
          repeat: Infinity,
          ease: "easeOut",
        },
      },
    },
    infinity: {
      animate: {
        rotate: [0, 180, 360],
        transition: {
          duration: speedStyles[speed].duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  // Dot animation variants for the "dots" type
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: speedStyles[speed].dotsDuration,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  // Render different spinner types
  const renderSpinner = () => {
    switch (type) {
      case "pulse":
        return (
          <motion.div
            className={`rounded-full ${colorStyles[color]} ${sizeStyles[size].container}`}
            variants={spinnerVariants.pulse}
            animate="animate"
          />
        );
      case "orbit":
        return (
          <motion.div
            className={`relative ${sizeStyles[size].container}`}
            variants={spinnerVariants.orbit}
            animate="animate"
          >
            <div className="absolute inset-0 border-2 border-t-transparent border-current rounded-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-current rounded-full" />
          </motion.div>
        );
      case "ripple":
        return (
          <motion.div
            className={`relative ${sizeStyles[size].container}`}
            initial="initial"
            animate="animate"
            variants={spinnerVariants.ripple}
          >
            <div className="absolute inset-0 border-2 border-current rounded-full" />
          </motion.div>
        );
      case "infinity":
        return (
          <motion.div
            className={`relative ${sizeStyles[size].container} ${colorStyles[color]}`}
            variants={spinnerVariants.infinity}
            animate="animate"
          >
            <FiAperture className="w-full h-full" />
          </motion.div>
        );
      case "dots":
        return (
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 ${colorStyles[color]} rounded-full`}
                custom={i}
                variants={dotVariants}
                animate="animate"
              />
            ))}
          </div>
        );
      default:
        return (
          <motion.div
            className={`${colorStyles[color]} ${sizeStyles[size].container}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiLoader className="w-full h-full" />
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div
        className={`${
          center
            ? "fixed inset-0 flex flex-col items-center justify-center"
            : "inline-flex flex-col items-center"
        } ${className}`}
      >
        {overlay && (
          <motion.div
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: overlayOpacity }}
            exit={{ opacity: 0 }}
          />
        )}
        <div
          className={`${center ? "z-50" : ""} flex flex-col items-center gap-3`}
        >
          {renderSpinner()}
          {text && (
            <motion.p
              className={`${colorStyles[color]} ${sizeStyles[size].text} ${textClassName}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default LoadingSpinner;
