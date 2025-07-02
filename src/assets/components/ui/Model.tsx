import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

// Define types for props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
  className?: string;
  closeOnBackdropClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  actions,
  size = "medium",
  color = "primary",
  className = "",
  closeOnBackdropClick = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trapping
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Size configurations
  const sizeStyles = {
    small: "w-full max-w-md p-4",
    medium: "w-full max-w-lg p-6",
    large: "w-full max-w-3xl p-8",
  };

  // Color configurations
  const colorStyles = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
  };

  // Animation variants for modal content
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  // Animation variants for backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.3 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            role="none"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className={`fixed inset-0 m-auto bg-white rounded-lg shadow-xl z-50 overflow-auto
              ${sizeStyles[size]}
              ${colorStyles[color]}
              ${className}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
            role="dialog"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-modal="true"
            tabIndex={-1}
          >
            {/* Dynamic Border Animation */}
            <span className="absolute inset-0 rounded-lg p-0.5 -z-10">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent animate-circle-border"></span>
            </span>

            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
              onClick={onClose}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6" />
            </motion.button>

            {/* Modal Content */}
            <div className="flex flex-col gap-4">
              {title && (
                <h2
                  id="modal-title"
                  className={`font-bold ${
                    size === "small"
                      ? "text-lg"
                      : size === "large"
                      ? "text-2xl"
                      : "text-xl"
                  } text-gray-800`}
                >
                  {title}
                </h2>
              )}
              {content && <div className="text-gray-700">{content}</div>}
              {actions && (
                <div className="flex gap-2 justify-end">{actions}</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
