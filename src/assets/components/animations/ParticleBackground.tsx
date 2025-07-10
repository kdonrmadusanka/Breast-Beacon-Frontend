import React, { useEffect, useMemo, useRef, useState } from "react";
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

interface ParticleBackgroundProps {
  count?: number;
  shape?: "circle" | "hexagon" | "cell" | "triangle" | "star" | "custom";
  customShape?: React.ReactNode;
  sizeRange?: [number, number];
  speedRange?: [number, number];
  opacityRange?: [number, number];
  colors?: string[];
  glow?: number;
  glowColor?: string;
  pulsate?: boolean;
  pulsateIntensity?: number;
  cluster?: boolean;
  clusterIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
  viewport?: { once?: boolean; margin?: string; amount?: number };
  easing?:
    | keyof typeof MotionEasingPresets
    | { type: string; [key: string]: any };
  movementType?: "float" | "orbit" | "wave";
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 25,
  shape = "circle",
  customShape = null,
  sizeRange = [5, 25],
  speedRange = [10, 25],
  opacityRange = [0.05, 0.3],
  colors = ["#4A90E2", "#F4A261", "#E76F51"],
  glow = 4,
  glowColor,
  pulsate = true,
  pulsateIntensity = 0.5,
  cluster = false,
  clusterIntensity = 0.7,
  className = "",
  style,
  viewport = { once: true, margin: "-20%" },
  easing = "easeInOut",
  movementType = "float",
  onAnimationStart,
  onAnimationComplete,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewport);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Generate random particles with memoization
  const particles = useMemo(() => {
    const generateParticle = (index: number) => {
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const speed =
        Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0];
      const opacity =
        Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Cluster particles towards center if enabled
      const clusterFactor = cluster ? clusterIntensity : 0;
      const initialX =
        Math.random() * (100 - clusterFactor * 50) + clusterFactor * 25;
      const initialY =
        Math.random() * (100 - clusterFactor * 50) + clusterFactor * 25;

      // Different movement patterns
      const angle = Math.random() * 2 * Math.PI;
      const distance =
        movementType === "orbit"
          ? size * 0.5
          : Math.random() * 100 * (1 - clusterFactor * 0.7);

      const rotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 2;

      return {
        id: index,
        size,
        speed,
        opacity,
        color,
        initialX,
        initialY,
        angle,
        distance,
        rotation,
        rotationSpeed,
        pulsateScale: 1 + Math.random() * pulsateIntensity,
      };
    };

    return Array.from({ length: count }).map((_, index) =>
      generateParticle(index)
    );
  }, [
    count,
    sizeRange,
    speedRange,
    opacityRange,
    colors,
    cluster,
    clusterIntensity,
    movementType,
    pulsateIntensity,
  ]);

  // Get transition config
  const getTransition = (particle: (typeof particles)[0]) => {
    const baseTransition = {
      duration: particle.speed,
      repeat: Infinity,
      repeatType: "loop" as const,
    };

    if (typeof easing === "string") {
      return { ...baseTransition, ...MotionEasingPresets[easing] };
    }
    return { ...baseTransition, ...easing };
  };

  // Particle animation variants based on movement type
  const particleVariants = (particle: (typeof particles)[0]): Variants => {
    const baseVariants = {
      hidden: {
        x: particle.initialX,
        y: particle.initialY,
        opacity: 0,
        scale: 0.5,
        rotate: 0,
      },
      visible: {
        opacity: particle.opacity,
        transition: getTransition(particle),
      },
    };

    switch (movementType) {
      case "orbit":
        return {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            x: [
              particle.initialX,
              particle.initialX + Math.cos(particle.angle) * particle.distance,
              particle.initialX,
            ],
            y: [
              particle.initialY,
              particle.initialY + Math.sin(particle.angle) * particle.distance,
              particle.initialY,
            ],
            rotate: [0, 180, 360],
            scale: pulsate ? [1, particle.pulsateScale, 1] : [1],
          },
        };
      case "wave":
        return {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            x: [
              particle.initialX,
              particle.initialX +
                Math.cos(particle.angle) * particle.distance * 0.5,
              particle.initialX,
            ],
            y: [
              particle.initialY,
              particle.initialY +
                Math.sin(particle.angle * 2) * particle.distance,
              particle.initialY,
            ],
            rotate: [0, particle.rotationSpeed * 90, 0],
            scale: pulsate ? [1, particle.pulsateScale, 1] : [1],
          },
        };
      case "float":
      default:
        return {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            x: [
              particle.initialX,
              particle.initialX + Math.cos(particle.angle) * particle.distance,
              particle.initialX,
            ],
            y: [
              particle.initialY,
              particle.initialY + Math.sin(particle.angle) * particle.distance,
              particle.initialY,
            ],
            rotate: [0, particle.rotationSpeed * 180, 0],
            scale: pulsate ? [1, particle.pulsateScale, 1] : [1],
          },
        };
    }
  };

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

  // Render particle based on shape
  const renderParticle = (particle: (typeof particles)[0]) => {
    const baseStyle = {
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      filter:
        glow > 0
          ? `drop-shadow(0 0 ${glow}px ${glowColor || particle.color})`
          : undefined,
    };

    switch (shape) {
      case "circle":
        return (
          <motion.div
            className="rounded-full"
            style={{ ...baseStyle, backgroundColor: particle.color }}
          />
        );
      case "hexagon":
        return (
          <motion.div className="relative" style={baseStyle}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon
                points="50,5 95,25 95,75 50,95 5,75 5,25"
                fill={particle.color}
                opacity={particle.opacity}
              />
            </svg>
          </motion.div>
        );
      case "cell":
        return (
          <motion.div className="relative" style={baseStyle}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path
                d="M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10 Z"
                fill={particle.color}
                opacity={particle.opacity}
              />
              <circle
                cx="50"
                cy="50"
                r="15"
                fill={particle.color}
                opacity={particle.opacity * 1.5}
              />
            </svg>
          </motion.div>
        );
      case "triangle":
        return (
          <motion.div className="relative" style={baseStyle}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon
                points="50,5 95,95 5,95"
                fill={particle.color}
                opacity={particle.opacity}
              />
            </svg>
          </motion.div>
        );
      case "star":
        return (
          <motion.div className="relative" style={baseStyle}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path
                d="M50 5 L61 40 L98 40 L68 60 L79 95 L50 75 L21 95 L32 60 L2 40 L39 40 Z"
                fill={particle.color}
                opacity={particle.opacity}
              />
            </svg>
          </motion.div>
        );
      case "custom":
        return customShape ? (
          <motion.div style={baseStyle}>{customShape}</motion.div>
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
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            zIndex: Math.floor(particle.size),
          }}
          variants={particleVariants(particle)}
          initial="hidden"
          animate={controls}
        >
          {renderParticle(particle)}
          {/* Subtle aura effect */}
          {glow > 0 && (
            <motion.div
              className="absolute inset-0 rounded-full opacity-0"
              style={{
                background: `radial-gradient(circle at center, ${
                  glowColor || particle.color
                } 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0, particle.opacity * 0.3, 0],
                scale: [1, 2, 1],
                transition: {
                  duration: particle.speed * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleBackground;
