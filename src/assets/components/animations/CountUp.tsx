import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";

// Animation easing presets
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  easing?: keyof typeof easingFunctions;
  loop?: boolean;
  loopInterval?: number;
  separator?: string;
  textClassName?: string;
  className?: string;
  onComplete?: () => void;
  onLoop?: () => void;
  highlightColor?: string;
  highlightWidth?: number;
  enableScrollTrigger?: boolean;
  formatValue?: (value: number) => string;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  easing = "easeOut",
  loop = false,
  loopInterval = 3000,
  separator = ",",
  textClassName = "text-primary font-bold text-3xl md:text-4xl",
  className = "",
  onComplete,
  onLoop,
  highlightColor = "rgba(74, 144, 226, 0.2)",
  highlightWidth = 3,
  enableScrollTrigger = true,
  formatValue,
}) => {
  const [count, setCount] = useState(start);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: !loop, margin: "0px 0px -50px 0px" });
  const animationRef = useRef<number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Format number with customization options
  const formatNumber = (value: number) => {
    if (formatValue) return formatValue(value);

    const numberValue = value.toFixed(decimals);
    const parts = numberValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return `${prefix}${parts.join(".")}${suffix}`;
  };

  // Animate the count
  const animateCount = (from: number, to: number, onDone?: () => void) => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    const range = to - from;
    const easeFunc = easingFunctions[easing];

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / (duration * 1000));
      const easedProgress = easeFunc(progress);
      const currentValue = from + easedProgress * range;

      setCount(currentValue);

      if (now < endTime) {
        animationRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(to);
        onDone?.();
      }
    };

    animationRef.current = requestAnimationFrame(updateCount);
  };

  // Handle animation lifecycle
  useEffect(() => {
    if (!enableScrollTrigger || isInView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, delay },
      });
      animateCount(start, end, () => {
        onComplete?.();
        if (loop) {
          timeoutRef.current = setTimeout(() => {
            setCount(start);
            onLoop?.();
            animateCount(start, end);
          }, loopInterval);
        }
      });
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    isInView,
    start,
    end,
    duration,
    delay,
    loop,
    loopInterval,
    controls,
    onComplete,
    onLoop,
    enableScrollTrigger,
  ]);

  // Accessibility
  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("aria-label", formatNumber(end));
    }
  }, [end, prefix, suffix, decimals, separator, formatValue]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-flex flex-col items-center relative ${className}`}
      variants={containerVariants}
      initial={enableScrollTrigger ? "hidden" : false}
      animate={enableScrollTrigger ? "visible" : false}
      aria-live="polite"
    >
      <div className={`relative ${textClassName}`}>{formatNumber(count)}</div>

      {/* Animated highlight */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 rounded-full"
        style={{
          backgroundColor: highlightColor,
          height: `${highlightWidth}px`,
          width: "100%",
        }}
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0],
          originX: 0,
        }}
        transition={{
          duration: duration * 1.5,
          repeat: Infinity,
          repeatDelay: loop ? loopInterval / 1000 : 1,
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${highlightColor} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatDelay: loop ? loopInterval / 1000 : 1,
        }}
      />
    </motion.div>
  );
};

export default CountUp;
