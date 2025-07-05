import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiBookOpen,
  FiSettings,
  FiChevronRight,
  FiChevronLeft,
  FiPlus,
  FiActivity,
  FiUser,
} from "react-icons/fi";
import type { IconType } from "react-icons";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

interface SidebarProps {
  navItems: NavItem[];
  isMobile: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, isMobile, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  // Animation variants
  const containerVariants = {
    collapsed: { width: 80 },
    expanded: { width: 260 },
  };

  const logoVariants = {
    collapsed: { opacity: 0, x: -20 },
    expanded: { opacity: 1, x: 0 },
  };

  const navItemVariants = {
    collapsed: {
      justifyContent: "center",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
    },
    expanded: {
      justifyContent: "flex-start",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
  };

  const textVariants = {
    collapsed: { opacity: 0, x: -20 },
    expanded: { opacity: 1, x: 0 },
  };

  const newScanButtonVariants = {
    collapsed: {
      justifyContent: "center",
      padding: "0.75rem 0.5rem",
      borderRadius: "12px",
    },
    expanded: {
      justifyContent: "flex-start",
      padding: "0.75rem 1.25rem",
      borderRadius: "12px",
    },
  };

  return (
    <motion.aside
      className="flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 overflow-hidden"
      initial={isExpanded ? "expanded" : "collapsed"}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 h-16">
        <div className="flex items-center">
          {/* <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 16V16.01M12 8V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div> */}

          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className="ml-3 text-lg font-medium text-gray-800 dark:text-white whitespace-nowrap"
                variants={logoVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                Breast Beacon
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="collapse"
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 180 }}
                transition={{ duration: 0.15 }}
              >
                <FiChevronLeft className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="expand"
                initial={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FiChevronRight className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-2.5">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.div
                  className="flex items-center w-full h-10"
                  variants={navItemVariants}
                  animate={isExpanded ? "expanded" : "collapsed"}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        location.pathname === item.path ? "text-primary" : ""
                      }`}
                    />
                    {hoveredItem === item.path && (
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-full"
                        layoutId="navItemHover"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        className="ml-3 whitespace-nowrap overflow-hidden"
                        variants={textVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: 0.1,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {location.pathname === item.path && (
                    <motion.div
                      className="ml-auto h-5 w-1 bg-primary rounded-l-lg"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </motion.div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-4">
        <motion.button
          className={`flex items-center w-full gap-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors`}
          variants={newScanButtonVariants}
          animate={isExpanded ? "expanded" : "collapsed"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{
              rotate: isExpanded ? 0 : 360,
              transition: { type: "spring", stiffness: 300, damping: 15 },
            }}
          >
            <FiPlus className="h-5 w-5" />
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className="text-sm font-medium whitespace-nowrap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                New Scan
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.div
          className={`flex items-center p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
            isExpanded ? "justify-start gap-3" : "justify-center"
          }`}
          whileHover={{ x: isExpanded ? 2 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FiUser className="h-4 w-4" />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                  Dr. Sarah Johnson
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Radiologist
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
