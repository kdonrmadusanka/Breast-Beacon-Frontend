import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";

// Updated easing presets with proper type safety
const MotionEasingPresets = {
  easeInOut: { ease: "easeInOut" },
  easeIn: { ease: "easeIn" },
  easeOut: { ease: "easeOut" },
  linear: { ease: "linear" },
  spring: { type: "spring", stiffness: 100, damping: 10 },
  bounce: { type: "spring", bounce: 0.5 },
} as const;

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  easing?:
    | keyof typeof MotionEasingPresets
    | { type: string; [key: string]: any };
  scale?: boolean | number;
  rotate?: number;
  opacity?: number;
  viewport?: { once?: boolean; margin?: string; amount?: number };
  className?: string;
  style?: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = "up",
  distance = 50,
  duration = 0.6,
  delay = 0,
  staggerChildren = 0,
  easing = "easeInOut",
  scale = false,
  rotate = 0,
  opacity = 1,
  viewport = { once: true, margin: "-20%" },
  className = "",
  style,
  onAnimationStart,
  onAnimationComplete,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewport);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Safely get transition config
  const getTransition = () => {
    const baseTransition = {
      duration,
      delay,
      when: staggerChildren ? "beforeChildren" : undefined,
      staggerChildren,
    };

    if (typeof easing === "string") {
      return { ...baseTransition, ...MotionEasingPresets[easing] };
    }
    return { ...baseTransition, ...easing };
  };

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      x:
        direction === "left" ? distance : direction === "right" ? -distance : 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      scale: typeof scale === "number" ? scale : scale ? 0.9 : 1,
      rotate: rotate,
    },
    visible: {
      opacity: opacity,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: getTransition(),
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration * 0.8,
        ease: "easeOut",
      },
    },
  };

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible").then(() => {
        setHasAnimated(true);
        onAnimationComplete?.();
      });
      onAnimationStart?.();
    }
  }, [isInView, controls, hasAnimated, onAnimationStart, onAnimationComplete]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      aria-hidden={!hasAnimated}
      style={style}
    >
      {/* Animated border gradient (only visible during animation) */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 pointer-events-none"
        initial={{ opacity: 0.3, scale: 1.05 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{
          duration: duration * 1.5,
          ease: "easeOut",
        }}
      />

      {/* Content with optional stagger */}
      {staggerChildren ? (
        <motion.div
          variants={{
            visible: {
              transition: {
                staggerChildren: staggerChildren,
              },
            },
          }}
          className="contents"
        >
          {React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={childVariants} custom={index}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default FadeIn;
