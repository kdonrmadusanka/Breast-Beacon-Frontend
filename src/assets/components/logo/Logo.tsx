import { motion } from "framer-motion";
import React from "react";

interface FlatLogoProps {
  width?: number | string;
  height?: number | string;
  animate?: boolean;
  rotationDuration?: number;
  className?: string;
}

export const FlatLogo: React.FC<FlatLogoProps> = ({
  width = 64,
  height = 64,
  animate = true,
  rotationDuration = 20,
  className = "",
}) => {
  // Convert numeric values to pixel strings if needed
  const formattedWidth = typeof width === "number" ? `${width}px` : width;
  const formattedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: formattedWidth, height: formattedHeight }}
      animate={animate ? { rotate: 360 } : {}}
      transition={{
        duration: rotationDuration,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-label="Breast cancer awareness ribbon logo"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Gradient Ribbon */}
        <path
          d="M100,20 C150,40 180,100 100,150 C20,100 50,40 100,20 Z"
          fill="url(#ribbonGradient)"
          stroke="#fff"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id="ribbonGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff66b2" />
            <stop offset="100%" stopColor="#e91e63" />
          </linearGradient>

          {/* Glow Effect */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const radius = 70;
          const variation = Math.random() * 0.2 + 0.9; // 0.9-1.1 variation
          const sparkleSize = 3 + Math.random() * 2;

          return (
            <motion.circle
              key={i}
              cx={100 + Math.cos(angle) * radius * variation}
              cy={100 + Math.sin(angle) * radius * variation}
              r={sparkleSize}
              fill="#fff"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
};

export default FlatLogo;
