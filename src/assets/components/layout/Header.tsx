import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, User, Bell, MessageSquare } from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import Logo from "../logo/Logo";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Add dropdown component

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  theme?: string;
}

const Header = ({
  sidebarOpen,
  toggleSidebar,
  toggleTheme,
  theme,
}: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasMessages, setHasMessages] = useState(false);
  const navigate = useNavigate(); // Added for navigation

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New test results available",
      read: false,
      link: "/patient/results",
    },
    {
      id: 2,
      text: "Appointment reminder",
      read: false,
      link: "/patient/dashboard",
    },
  ]);

  // Mock messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Dr. Smith: Your biopsy is scheduled",
      read: false,
      link: "/messages/1",
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setHasNotifications(notifications.some((n) => !n.read && n.id !== id));
  };

  const markMessageAsRead = (id: number) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    setHasMessages(messages.some((m) => !m.read && m.id !== id));
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-sm border-border/10"
          : "bg-background border-border/0",
        theme === "dark" ? "dark" : ""
      )}
    >
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-4">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="sr-only">Open sidebar</span>
            {sidebarOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BreastCare AI
            </span>
          </Link>
        </div>

        <div className="flex flex-1 justify-end gap-x-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <div className="px-2 py-1.5 text-sm font-semibold">
                Notifications
              </div>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "cursor-pointer",
                      !notification.read && "bg-gray-100 dark:bg-gray-800"
                    )}
                    onClick={() => {
                      markNotificationAsRead(notification.id);
                      navigate(notification.link);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{notification.text}</span>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-sm">
                  No new notifications
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-sm text-center text-primary cursor-pointer"
                onClick={() => navigate("/notifications")}
              >
                View all
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {hasMessages && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <div className="px-2 py-1.5 text-sm font-semibold">Messages</div>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <DropdownMenuItem
                    key={message.id}
                    className={cn(
                      "cursor-pointer",
                      !message.read && "bg-gray-100 dark:bg-gray-800"
                    )}
                    onClick={() => {
                      markMessageAsRead(message.id);
                      navigate(message.link);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{message.text}</span>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-sm">
                  No new messages
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-sm text-center text-primary cursor-pointer"
                onClick={() => navigate("/messages")}
              >
                View all
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User profile"
              >
                <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/logout")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
