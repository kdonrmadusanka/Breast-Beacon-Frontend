import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim"; // Use slim preset
import { useCallback } from "react";
import logo from "../images/logo.png";
import demoVideo from "../videos/demo.mp4";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonVariants: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.05,
    boxShadow: "0px 8px 24px rgba(236, 72, 153, 0.5)", // Glow with breast-pink-500
    backgroundColor: "#DB2777", // breast-pink-600
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 4px 12px rgba(236, 72, 153, 0.3)",
    transition: { duration: 0.2 },
  },
};

const cardVariants: Variants = {
  hover: {
    scale: 1.03,
    boxShadow: "0px 12px 24px rgba(236, 72, 153, 0.2)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const videoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const Services: React.FC = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine); // Use loadSlim
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#1A1A1A" } },
          fpsLimit: 60,
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { value: "#EC4899" },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.3 }, random: true },
            size: { value: { min: 1, max: 3 }, random: true },
            move: {
              enable: true,
              speed: { min: 0.2, max: 0.4 },
              direction: "none",
              random: true,
              outModes: { default: "out" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-dark-accent bg-opacity-80 backdrop-blur-md py-4 px-6 flex items-center justify-between"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link to="/">
          <motion.img
            src={logo}
            alt="Breast Beacon Logo"
            className="h-12 w-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </Link>
        <div className="flex space-x-8">
          {[
            "Home",
            "About",
            "Services",
            "Resources",
            "Contact",
            "Validity",
          ].map((tab) => (
            <Link
              key={tab}
              to={`/${tab.toLowerCase()}`}
              className="text-gray-300 hover:text-breast-pink-500 relative group text-lg font-medium"
            >
              {tab}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-breast-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 px-6 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 text-breast-pink-500 tracking-tight"
          variants={itemVariants}
        >
          Our Services
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl text-center"
          variants={itemVariants}
        >
          Discover how Breast Beacon transforms breast cancer screening with
          AI-driven technology and user-friendly tools.
        </motion.p>

        {/* How It Works Section */}
        <motion.section
          className="max-w-5xl text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            How Breast Beacon Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Image Acquisition",
                description:
                  "Patients or clinicians securely upload high-resolution mammogram images through our platform.",
              },
              {
                step: 2,
                title: "Pre-Processing",
                description:
                  "Images are enhanced to improve clarity and reduce noise, ensuring optimal analysis conditions.",
              },
              {
                step: 3,
                title: "AI Analysis",
                description:
                  "Our AI model, trained on thousands of mammograms, detects lesions and abnormalities with high accuracy.",
              },
              {
                step: 4,
                title: "Zoomed Visualization",
                description:
                  "Suspicious areas are magnified and annotated for detailed inspection by healthcare professionals.",
              },
              {
                step: 5,
                title: "Reporting",
                description:
                  "Results are delivered in a clear, actionable format, shared securely with providers for next steps.",
              },
            ].map(({ step, title, description }) => (
              <motion.div
                key={step}
                className="bg-dark-accent p-6 rounded-lg shadow-xl border-2 border-breast-pink-500 animate-border-cycle"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-xl font-semibold text-breast-pink-500 mb-2">
                  Step {step}: {title}
                </h3>
                <p className="text-gray-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Video Demo Section */}
        <motion.section
          className="max-w-5xl text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            See Breast Beacon in Action
          </h2>
          <motion.div
            className="relative max-w-3xl mx-auto rounded-lg overflow-hidden border-4 border-breast-pink-500 animate-pulse"
            variants={videoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <video
              src={demoVideo}
              controls
              autoPlay
              loop
              muted
              className="w-full h-auto"
              poster="../images/1.Breast Memmogram.jpeg"
            >
              Your browser does not support the video tag. Please download the
              video <a href={demoVideo}>here</a>.
            </video>
          </motion.div>
          <p className="text-lg text-gray-400 mt-4">
            Watch how our platform streamlines mammogram analysis and empowers
            users with actionable insights.
          </p>
        </motion.section>

        {/* Signup Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-16"
          variants={containerVariants}
        >
          <Link to="/signup/patient">
            <motion.button
              className="bg-dark-accent text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-breast-pink-500 animate-border-cycle hover:bg-breast-pink-600 transition-colors duration-300"
              variants={buttonVariants}
              initial="initial"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Patient Signup
            </motion.button>
          </Link>
          <Link to="/signup/doctor">
            <motion.button
              className="bg-dark-accent text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-breast-pink-500 animate-border-cycle hover:bg-breast-pink-600 transition-colors duration-300"
              variants={buttonVariants}
              initial="initial"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Doctor Signup
            </motion.button>
          </Link>
          <Link to="/signup/clinician">
            <motion.button
              className="bg-dark-accent text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-breast-pink-500 animate-border-cycle hover:bg-breast-pink-600 transition-colors duration-300"
              variants={buttonVariants}
              initial="initial"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Clinician Signup
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              className="bg-dark-accent text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-breast-pink-500 animate-border-cycle hover:bg-breast-pink-600 transition-colors duration-300"
              variants={buttonVariants}
              initial="initial"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Login
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;
