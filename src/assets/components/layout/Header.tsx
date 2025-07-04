import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { Button } from "../ui/Index";
import { Logo } from "../logo/index"; // Import the 3D logo component

// Define types for navigation items
interface NavItem {
  label: string;
  path: string;
}

// Define types for props
interface HeaderProps {
  navItems?: NavItem[];
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/patient/dashboard" },
    { label: "Upload", path: "/patient/upload" },
    { label: "Results", path: "/patient/results" },
    { label: "Education", path: "/patient/education" },
  ],
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, height: 0 },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: { opacity: 0, scale: 0.8, y: -10 },
  };

  return (
    <header
      className={`bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 ${className}`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo with 3D animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="h-12 w-48 flex items-center">
            <Logo />
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative px-2 py-1 text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors
                ${isActive ? "text-primary font-semibold" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle with enhanced animation */}
          <motion.button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiSun className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiMoon className="w-5 h-5" />
              </motion.div>
            )}
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="User profile"
            >
              <FiUser className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  variants={profileVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <div className="p-2 space-y-1">
                    <motion.div whileHover={{ x: 5 }}>
                      <Button
                        text="Profile"
                        variant="outlined"
                        color="primary"
                        size="small"
                        className="w-full justify-start"
                        onClick={() => navigate("/patient/profile")}
                      />
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }}>
                      <Button
                        text="Logout"
                        icon={FiLogOut}
                        variant="outlined"
                        color="accent"
                        size="small"
                        className="w-full justify-start"
                        onClick={() => navigate("/auth/logout")}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="container mx-auto px-4 py-3 space-y-3">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={navItemVariants}
                  whileHover={{ x: 5 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                      ${
                        isActive
                          ? "text-primary font-semibold bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
