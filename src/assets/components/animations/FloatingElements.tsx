import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";

// Easing presets with proper type safety
const MotionEasingPresets = {
  easeInOut: { ease: "easeInOut" },
  easeIn: { ease: "easeIn" },
  easeOut: { ease: "easeOut" },
  linear: { ease: "linear" },
  spring: { type: "spring", stiffness: 100, damping: 10 },
  bounce: { type: "spring", bounce: 0.5 },
} as const;

interface FloatingElementsProps {
  count?: number;
  shape?: "circle" | "square" | "diamond" | "triangle" | "star" | "custom";
  customShape?: React.ReactNode;
  sizeRange?: [number, number];
  durationRange?: [number, number];
  opacityRange?: [number, number];
  colors?: string[];
  blur?: number;
  className?: string;
  style?: React.CSSProperties;
  viewport?: { once?: boolean; margin?: string; amount?: number };
  easing?:
    | keyof typeof MotionEasingPresets
    | { type: string; [key: string]: any };
  movementRange?: [number, number];
  rotationRange?: [number, number];
  scaleRange?: [number, number];
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 15,
  shape = "circle",
  customShape = null,
  sizeRange = [10, 30],
  durationRange = [10, 20],
  opacityRange = [0.1, 0.4],
  colors = ["#4A90E2", "#F4A261", "#E76F51"],
  blur = 2,
  className = "",
  style,
  viewport = { once: true, margin: "-20%" },
  easing = "easeInOut",
  movementRange = [50, 150],
  rotationRange = [0, 360],
  scaleRange = [0.8, 1.2],
  onAnimationStart,
  onAnimationComplete,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewport);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Generate random floating elements with memoization
  const elements = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const duration =
        Math.random() * (durationRange[1] - durationRange[0]) +
        durationRange[0];
      const opacity =
        Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      const movement =
        Math.random() * (movementRange[1] - movementRange[0]) +
        movementRange[0];
      const angle = Math.random() * Math.PI * 2;
      const deltaX = Math.cos(angle) * movement;
      const deltaY = Math.sin(angle) * movement;
      const rotation =
        Math.random() * (rotationRange[1] - rotationRange[0]) +
        rotationRange[0];
      const scale =
        Math.random() * (scaleRange[1] - scaleRange[0]) + scaleRange[0];

      return {
        id: index,
        size,
        duration,
        opacity,
        color,
        initialX,
        initialY,
        deltaX,
        deltaY,
        rotation,
        scale,
      };
    });
  }, [
    count,
    sizeRange,
    durationRange,
    opacityRange,
    colors,
    movementRange,
    rotationRange,
    scaleRange,
  ]);

  // Get transition config
  const getTransition = (duration: number) => {
    const baseTransition = { duration };

    if (typeof easing === "string") {
      return { ...baseTransition, ...MotionEasingPresets[easing] };
    }
    return { ...baseTransition, ...easing };
  };

  // Element animation variants
  const elementVariants = (element: (typeof elements)[0]): Variants => ({
    hidden: {
      x: element.initialX,
      y: element.initialY,
      opacity: 0,
      rotate: 0,
      scale: 0.5,
    },
    visible: {
      x: [
        element.initialX,
        element.initialX + element.deltaX,
        element.initialX,
      ],
      y: [
        element.initialY,
        element.initialY + element.deltaY,
        element.initialY,
      ],
      opacity: [0, element.opacity, element.opacity * 0.8],
      rotate: [0, element.rotation, 0],
      scale: [0.5, element.scale, 1],
      transition: {
        ...getTransition(element.duration),
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  });

  // Start animations when in view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible").then(() => {
        setHasAnimated(true);
        onAnimationComplete?.();
      });
      onAnimationStart?.();
    }
  }, [isInView, controls, hasAnimated, onAnimationStart, onAnimationComplete]);

  // Render shape based on type
  const renderShape = (element: (typeof elements)[0]) => {
    const baseStyle = {
      width: `${element.size}px`,
      height: `${element.size}px`,
      filter: `blur(${blur}px)`,
    };

    switch (shape) {
      case "circle":
        return (
          <motion.div
            className="rounded-full"
            style={{ ...baseStyle, backgroundColor: element.color }}
          />
        );
      case "square":
        return (
          <motion.div
            className="rounded-sm"
            style={{ ...baseStyle, backgroundColor: element.color }}
          />
        );
      case "diamond":
        return (
          <motion.div
            className="rotate-45 rounded-sm"
            style={{ ...baseStyle, backgroundColor: element.color }}
          />
        );
      case "triangle":
        return (
          <motion.div
            className="relative"
            style={{ width: element.size, height: element.size }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              style={{ filter: `blur(${blur}px)` }}
            >
              <polygon
                points="50,0 100,100 0,100"
                fill={element.color}
                opacity={element.opacity}
              />
            </svg>
          </motion.div>
        );
      case "star":
        return (
          <motion.div
            className="relative"
            style={{ width: element.size, height: element.size }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              style={{ filter: `blur(${blur}px)` }}
            >
              <path
                d="M50 0 L61 35 L98 35 L68 57 L79 92 L50 70 L21 92 L32 57 L2 35 L39 35 Z"
                fill={element.color}
                opacity={element.opacity}
              />
            </svg>
          </motion.div>
        );
      case "custom":
        return customShape ? (
          <motion.div
            style={{
              width: element.size,
              height: element.size,
              filter: `blur(${blur}px)`,
            }}
          >
            {customShape}
          </motion.div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.initialX}%`,
            top: `${element.initialY}%`,
          }}
          variants={elementVariants(element)}
          initial="hidden"
          animate={controls}
        >
          {renderShape(element)}
          {/* Subtle glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0"
            style={{
              background: `radial-gradient(circle at center, ${element.color} 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0, element.opacity * 0.3, 0],
              scale: [1, 1.5, 1],
              transition: {
                duration: element.duration * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
