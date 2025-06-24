import { motion } from "framer-motion";
import memmogram from "../images/3.Dense Breast.jpg";

const Mammogram: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-64 h-64"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Simplified mammogram outline */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="#EC4899"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.path
          d="M30 50 A20 20 0 0 1 70 50 A20 20 0 0 1 30 50"
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </svg>
      {/* Optional image overlay */}
      {/* Uncomment and place mammogram.jpg in client/src/assets/images/ */}
      <img
        src={memmogram}
        alt="Mammogram"
        className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-full"
      />
    </motion.div>
  );
};

export default Mammogram;
