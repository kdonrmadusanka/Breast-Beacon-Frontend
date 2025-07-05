import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiBookOpen,
  FiSettings,
  FiActivity,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiAlertCircle,
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import type { IconType } from "react-icons";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

interface SocialLink {
  label: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LayoutProps {
  headerNavItems?: NavItem[];
  sidebarNavItems?: NavItem[];
  footerQuickLinks?: NavItem[];
  footerSocialLinks?: SocialLink[];
  className?: string;
}

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      setHasError(true);
      console.error("Error caught by boundary:", error);
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <div className="flex justify-center text-red-500 mb-4">
            <FiAlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We've encountered an unexpected error. Please try refreshing the
            page or contact our support team.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const Layout: React.FC<LayoutProps> = ({
  headerNavItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload", path: "/upload" },
    { label: "Results", path: "/results" },
    { label: "Education", path: "/education" },
  ],
  sidebarNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: FiHome },
    { label: "Upload Scan", path: "/upload", icon: FiUpload },
    { label: "Results", path: "/results", icon: FiFileText },
    { label: "Education", path: "/education", icon: FiBookOpen },
    { label: "Progress", path: "/progress", icon: FiActivity },
    { label: "Settings", path: "/settings", icon: FiSettings },
  ],
  footerQuickLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy", path: "/privacy" },
  ],
  footerSocialLinks = [
    { label: "GitHub", url: "https://github.com", icon: FiGithub },
    { label: "Twitter", url: "https://twitter.com", icon: FiTwitter },
    { label: "LinkedIn", url: "https://linkedin.com", icon: FiLinkedin },
  ],
  className = "",
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${className}`}
    >
      <Header
        navItems={headerNavItems}
        onMenuToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(!isMobile || sidebarOpen) && (
            <Sidebar
              navItems={sidebarNavItems}
              isMobile={isMobile}
              onClose={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 max-w-7xl mx-auto w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

      <Footer quickLinks={footerQuickLinks} socialLinks={footerSocialLinks} />
    </div>
  );
};

export default Layout;
