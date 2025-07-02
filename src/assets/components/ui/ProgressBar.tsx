import React from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { FiCheck, FiAlertTriangle, FiAward } from "react-icons/fi";

type ProgressBarSize = "xs" | "sm" | "md" | "lg" | "xl";
type ProgressBarColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "gradient";
type ProgressBarVariant = "standard" | "rounded" | "pill" | "glass" | "neon";

interface ProgressBarProps {
  progress: number; // 0-100
  size?: ProgressBarSize;
  color?: ProgressBarColor;
  variant?: ProgressBarVariant;
  label?: string;
  showPercentage?: boolean;
  animatedPercentage?: boolean;
  pulseOnComplete?: boolean;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  labelClassName?: string;
  percentageClassName?: string;
  indicator?: "check" | "triangle" | "award" | "none";
  transition?: {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  onComplete?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = "md",
  color = "primary",
  variant = "standard",
  label,
  showPercentage = true,
  animatedPercentage = true,
  pulseOnComplete = true,
  className = "",
  trackClassName = "",
  fillClassName = "",
  labelClassName = "",
  percentageClassName = "",
  indicator = "none",
  transition = { duration: 1, ease: "easeOut", delay: 0 },
  onComplete,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const controls = useAnimation();
  const isComplete = clampedProgress >= 100;

  // Size configurations
  const sizeStyles = {
    xs: { height: "0.5rem", text: "text-xs", icon: 14 },
    sm: { height: "0.75rem", text: "text-sm", icon: 16 },
    md: { height: "1rem", text: "text-base", icon: 18 },
    lg: { height: "1.25rem", text: "text-lg", icon: 20 },
    xl: { height: "1.5rem", text: "text-xl", icon: 24 },
  };

  // Color configurations
  const colorStyles = {
    primary: "from-blue-500 to-blue-600",
    secondary: "from-purple-500 to-purple-600",
    accent: "from-pink-500 to-pink-600",
    success: "from-green-500 to-green-600",
    danger: "from-red-500 to-red-600",
    warning: "from-yellow-500 to-yellow-600",
    info: "from-cyan-500 to-cyan-600",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
  };

  // Variant configurations
  const variantStyles = {
    standard: "rounded",
    rounded: "rounded-lg",
    pill: "rounded-full",
    glass: "rounded-lg backdrop-blur-sm bg-opacity-20",
    neon: "rounded-lg shadow-glow",
  };

  // Animation variants
  const fillVariants = {
    initial: { width: 0 },
    animate: {
      width: `${clampedProgress}%`,
      transition,
    },
    complete: {
      width: "100%",
      transition: {
        ...transition,
        duration: transition.duration ? transition.duration * 0.8 : 0.8,
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.02, 1],
      transition: { duration: 0.8, repeat: Infinity },
    },
  };

  const percentageVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
  };

  // Handle completion
  React.useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Get indicator icon
  const getIndicatorIcon = () => {
    switch (indicator) {
      case "check":
        return <FiCheck size={sizeStyles[size].icon} />;
      case "triangle":
        return <FiAlertTriangle size={sizeStyles[size].icon} />;
      case "award":
        return <FiAward size={sizeStyles[size].icon} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <motion.span
              className={`${sizeStyles[size].text} text-gray-600 ${labelClassName}`}
              initial="initial"
              animate="animate"
              variants={percentageVariants}
            >
              {label}
            </motion.span>
          )}
          {showPercentage && (
            <motion.div
              className={`flex items-center gap-1 ${sizeStyles[size].text} font-medium ${percentageClassName}`}
              initial="initial"
              animate="animate"
              variants={percentageVariants}
            >
              {animatedPercentage ? (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={clampedProgress}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {clampedProgress}%
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span>{clampedProgress}%</span>
              )}
              {indicator !== "none" && isComplete && (
                <motion.span
                  animate={pulseOnComplete ? "pulse" : "initial"}
                  variants={pulseVariants}
                  className="ml-1"
                >
                  {getIndicatorIcon()}
                </motion.span>
              )}
            </motion.div>
          )}
        </div>
      )}

      <motion.div
        className={`relative w-full overflow-hidden ${variantStyles[variant]} bg-gray-200 dark:bg-gray-700 ${trackClassName}`}
        style={{ height: sizeStyles[size].height }}
        initial="initial"
        animate={isComplete ? "complete" : "animate"}
        variants={pulseVariants}
      >
        {/* Track */}
        <div className="absolute inset-0 w-full h-full" />

        {/* Fill */}
        <motion.div
          className={`absolute top-0 left-0 h-full ${variantStyles[variant]} bg-gradient-to-r ${colorStyles[color]} ${fillClassName}`}
          variants={fillVariants}
          initial="initial"
          animate="animate"
        >
          {/* Animated shimmer effect */}
          {variant === "neon" && (
            <motion.div
              className="absolute inset-0 bg-white opacity-20"
              animate={{
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* Subtle texture for glass variant */}
          {variant === "glass" && (
            <div className="absolute inset-0 bg-white bg-opacity-10" />
          )}
        </motion.div>

        {/* Completion indicator */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 bg-white bg-opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: transition.duration, duration: 0.5 }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ProgressBar;
