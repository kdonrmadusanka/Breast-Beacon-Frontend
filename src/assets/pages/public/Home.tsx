import { motion } from "framer-motion";
import { Button } from "../../components/ui/Index";
import { useNavigate } from "react-router-dom";
import { FiUser, FiUpload } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center"
    >
      <div className="max-w-3xl space-y-6">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        >
          Advanced Breast Cancer Detection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          AI-powered analysis for early detection and personalized treatment
          planning
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-center pt-4"
        >
          <Button
            text="Patient Portal"
            icon={FiUser}
            variant="filled"
            size="large"
            onClick={() => navigate("/dashboard")}
          />
          <Button
            text="Upload Scan"
            icon={FiUpload}
            variant="outlined"
            size="large"
            onClick={() => navigate("/upload")}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
