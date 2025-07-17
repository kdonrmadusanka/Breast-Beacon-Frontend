import { motion } from "framer-motion";
import {
  FiUpload,
  FiFileText,
  FiActivity,
  FiCalendar,
  FiBook,
} from "react-icons/fi";
import { Card } from "../../components/ui/Index";
import { Button } from "../../components/ui/Index";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    icon: FiUpload,
    title: "Upload Mammogram",
    path: "/upload",
    color: "primary",
  },
  {
    icon: FiFileText,
    title: "View Results",
    path: "/results",
    color: "secondary",
  },
  {
    icon: FiActivity,
    title: "Progress Tracking",
    path: "/progress",
    color: "accent",
  },
  {
    icon: FiCalendar,
    title: "Schedule Appointment",
    path: "/appointments",
    color: "primary",
  },
  {
    icon: FiBook,
    title: "Educational Resources",
    path: "/education",
    color: "secondary",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <Card
          title="Recent Scans"
          content="3"
          icon={FiFileText}
          color="primary"
          size="medium"
        />
        <Card
          title="Pending Results"
          content="1"
          icon={FiActivity}
          color="secondary"
          size="medium"
        />
        <Card
          title="Upcoming Appointments"
          content="2"
          icon={FiCalendar}
          color="accent"
          size="medium"
        />
        <Card
          title="Treatment Plans"
          content="1"
          icon={FiBook}
          color="primary"
          size="medium"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                text={action.title}
                icon={action.icon}
                variant="outlined"
                color={action.color as "primary" | "secondary" | "accent"}
                size="large"
                className="w-full h-32 flex-col gap-4"
                onClick={() => navigate(action.path)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Activity</h2>
        <div className="space-y-2">
          {[
            {
              date: "2023-11-15",
              action: "New mammogram uploaded",
              status: "Pending Analysis",
            },
            {
              date: "2023-11-10",
              action: "Follow-up appointment scheduled",
              status: "Confirmed",
            },
            {
              date: "2023-11-05",
              action: "Treatment plan updated",
              status: "Completed",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="hover:bg-accent/50"
                hoverEffect={true}
                onClick={() => {}}
                content={
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.action}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.status === "Pending Analysis"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
