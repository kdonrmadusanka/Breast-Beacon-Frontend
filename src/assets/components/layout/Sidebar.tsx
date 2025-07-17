import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  Activity,
  Calendar,
  BookOpen,
  Settings,
  Users,
  ClipboardList,
  MessageSquare,
  BarChart2,
  HelpCircle,
} from "lucide-react";
import Logo from "../logo/Logo";
import Lottie from "lottie-react";
import animationData from "../../animations/sidebar-animation.json";
import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Upload Mammogram", icon: Upload, path: "/upload" },
  { name: "View Results", icon: FileSearch, path: "/results" },
  { name: "Progress Tracking", icon: Activity, path: "/progress" },
  { name: "Appointments", icon: Calendar, path: "/appointments" },
  { name: "Education", icon: BookOpen, path: "/education" },
  { name: "Patient Cases", icon: Users, path: "/cases" },
  { name: "Treatment Plans", icon: ClipboardList, path: "/treatment" },
  { name: "Messaging", icon: MessageSquare, path: "/messages" },
  { name: "Analytics", icon: BarChart2, path: "/analytics" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Help", icon: HelpCircle, path: "/help" },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed inset-y-0 z-40 flex w-72 flex-col border-r bg-background",
          "transition-transform duration-300 ease-in-out",
          !open && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b">
          <div className="mr-2">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
              style={{ width: 32, height: 32 }}
            />
          </div>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            BreastCare AI
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    )
                  }
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: 24, height: 24 }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || "Guest User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role
                  ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
                  : "No role"}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
