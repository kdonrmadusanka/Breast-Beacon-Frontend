import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "diagonal-up-left"
  | "diagonal-up-right"
  | "diagonal-down-left"
  | "diagonal-down-right"
  | "zoom-in"
  | "zoom-out"
  | "spin";

type EasingPreset =
  | "easeInOut"
  | "easeIn"
  | "easeOut"
  | "linear"
  | "anticipate"
  | "bounce"
  | "springy"
  | "smooth";

interface SlideInProps {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  easing?: EasingPreset;
  rotation?: number;
  bounce?: boolean;
  className?: string;
  viewport?: { once?: boolean; margin?: string };
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const easingMap: Record<EasingPreset, any> = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  linear: [0, 0, 1, 1],
  anticipate: [0.36, 0, 0.66, -0.56],
  bounce: { type: "spring", bounce: 0.6 },
  springy: { type: "spring", stiffness: 300, damping: 15 },
  smooth: { type: "spring", stiffness: 100, damping: 20 },
};

const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "left",
  distance = 100,
  duration = 0.8,
  delay = 0,
  staggerChildren = 0,
  easing = "easeInOut",
  rotation = 0,
  bounce = false,
  className = "",
  viewport = { once: true, margin: "-20%" },
  onAnimationStart,
  onAnimationComplete,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewport);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Get transform values based on direction
  const getTransformValues = () => {
    const base = { x: 0, y: 0, scale: 1, rotate: 0 };

    if (direction.includes("zoom")) {
      return {
        ...base,
        scale: direction === "zoom-in" ? 0.5 : 1.5,
        opacity: 0,
      };
    }

    if (direction === "spin") {
      return {
        ...base,
        rotate: 180,
        opacity: 0,
      };
    }

    return {
      ...base,
      x: direction.includes("left")
        ? distance
        : direction.includes("right")
        ? -distance
        : 0,
      y: direction.includes("up")
        ? distance
        : direction.includes("down")
        ? -distance
        : 0,
      rotate: rotation,
      opacity: 0,
    };
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: getTransformValues(),
    visible: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: typeof easingMap[easing] === "object" ? undefined : duration,
        delay,
        ease:
          typeof easingMap[easing] === "object" ? undefined : easingMap[easing],
        ...(typeof easingMap[easing] === "object" ? easingMap[easing] : {}),
        when: staggerChildren ? "beforeChildren" : undefined,
        staggerChildren,
        bounce: bounce ? 0.5 : undefined,
      },
    },
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration * 0.7,
        ease: easingMap.easeOut,
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
    >
      {/* Animated glow effect */}
      {direction.includes("diagonal") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasAnimated ? 0 : 0.3 }}
          transition={{ duration: duration * 0.5 }}
        />
      )}

      {/* Content with optional stagger */}
      {staggerChildren ? (
        <motion.div
          variants={{
            visible: {
              transition: {
                staggerChildren: staggerChildren / 2,
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

      {/* Animated border (for non-zoom/spin effects) */}
      {!direction.includes("zoom") && direction !== "spin" && (
        <motion.div
          className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none"
          initial={{
            borderColor: "transparent",
            opacity: 0.8,
            scale: 1.05,
          }}
          animate={{
            borderColor: hasAnimated
              ? "transparent"
              : "rgba(99, 102, 241, 0.3)",
            opacity: 0,
            scale: 1,
          }}
          transition={{
            duration: duration * 1.2,
            ease: "easeOut",
          }}
        />
      )}
    </motion.div>
  );
};

export default SlideIn;
