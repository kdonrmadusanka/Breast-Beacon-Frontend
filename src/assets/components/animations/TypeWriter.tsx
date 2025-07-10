import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface TypeWriterProps {
  texts?: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  cursorSpeed?: number;
  textClassName?: string;
  cursorClassName?: string;
  className?: string;
  textColor?: string;
  highlightColor?: string;
  highlightWidth?: number;
  onComplete?: () => void;
  onCycle?: (index: number) => void;
  characterAnimation?: boolean;
  characterAnimationType?: "jump" | "fade" | "scale";
  containerAnimation?: boolean;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  texts = [
    "Empowering Early Detection",
    "AI-Powered Breast Cancer Analysis",
    "Your Health, Our Priority",
  ],
  typingSpeed = 80,
  deleteSpeed = 40,
  delay = 1200,
  loop = true,
  cursor = true,
  cursorChar = "▋",
  cursorSpeed = 500,
  textClassName = "text-primary font-bold text-2xl md:text-3xl",
  cursorClassName = "text-primary",
  className = "",
  textColor = "",
  highlightColor = "rgba(74, 144, 226, 0.1)",
  highlightWidth = 4,
  onComplete,
  onCycle,
  characterAnimation = true,
  characterAnimationType = "jump",
  containerAnimation = true,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const characterVariants: Variants = {
    jump: {
      y: [0, -10, 0],
      opacity: [0, 1, 1],
      transition: { duration: 0.3 },
    },
    fade: {
      opacity: [0, 1],
      transition: { duration: 0.2 },
    },
    scale: {
      scale: [0.8, 1.2, 1],
      opacity: [0, 1, 1],
      transition: { duration: 0.3 },
    },
  };

  const cursorVariants: Variants = {
    blink: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: cursorSpeed / 1000,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: cursorSpeed / 1000,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  // Typing effect logic
  useEffect(() => {
    let timeout: number;

    const currentText = texts[currentTextIndex];
    const isComplete = displayText === currentText;
    const isEmpty = displayText === "";

    if (isPaused) {
      timeout = setTimeout(() => setIsPaused(false), delay);
    } else if (!isDeleting && !isComplete) {
      // Typing phase
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (isComplete && !isDeleting) {
      // Pause before deleting
      setIsTypingComplete(true);
      timeout = setTimeout(() => {
        setIsDeleting(true);
        setIsTypingComplete(false);
      }, delay);
    } else if (isDeleting && !isEmpty) {
      // Deleting phase
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1));
      }, deleteSpeed);
    } else if (isDeleting && isEmpty) {
      // Move to next text or loop
      setIsDeleting(false);
      setIsPaused(true);
      const nextIndex = loop
        ? (currentTextIndex + 1) % texts.length
        : Math.min(currentTextIndex + 1, texts.length - 1);

      if (loop || currentTextIndex < texts.length - 1) {
        onCycle?.(nextIndex);
        timeout = setTimeout(() => setCurrentTextIndex(nextIndex), delay / 2);
      } else {
        onComplete?.();
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    isPaused,
    currentTextIndex,
    texts,
    typingSpeed,
    deleteSpeed,
    delay,
    loop,
    onComplete,
    onCycle,
  ]);

  // Accessibility updates
  useEffect(() => {
    if (textRef.current) {
      textRef.current.setAttribute("aria-label", texts[currentTextIndex]);
    }
  }, [currentTextIndex, texts]);

  // Render animated characters
  const renderAnimatedText = () => {
    return displayText.split("").map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        variants={characterAnimation ? characterVariants : undefined}
        initial={characterAnimation ? "hidden" : undefined}
        animate={characterAnimation ? "visible" : undefined}
        custom={index}
        style={{
          display: "inline-block",
          color: textColor || undefined,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      aria-live="polite"
      initial={containerAnimation ? "hidden" : undefined}
      animate={containerAnimation ? "visible" : undefined}
      variants={containerAnimation ? containerVariants : undefined}
    >
      {/* Text content */}
      <div
        ref={textRef}
        className={`relative ${textClassName}`}
        style={{ color: textColor || undefined }}
      >
        {renderAnimatedText()}
      </div>

      {/* Cursor */}
      {cursor && (
        <AnimatePresence>
          <motion.span
            className={`inline-block ml-1 ${cursorClassName}`}
            variants={cursorVariants}
            animate={isTypingComplete ? "pulse" : "blink"}
            style={{ color: textColor || undefined }}
          >
            {cursorChar}
          </motion.span>
        </AnimatePresence>
      )}

      {/* Text highlight effect */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
        style={{
          backgroundColor: highlightColor,
          height: `${highlightWidth}px`,
          width: `${displayText.length * 0.6}em`,
        }}
        animate={{
          width: `${displayText.length * 0.6}em`,
          opacity: displayText.length > 0 ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
      />
    </motion.div>
  );
};

export default TypeWriter;
