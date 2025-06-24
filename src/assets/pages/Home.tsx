import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useState } from "react";
import Mammogram from "../components/Mammogram";
import logo from "../images/logo.png";

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
  initial: {
    scale: 0.95,
    opacity: 0,
    y: 10,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    rotate: 2,
    boxShadow: "0px 8px 24px rgba(236, 72, 153, 0.5)", // Glow effect with breast-pink-500
    backgroundColor: "#DB2777", // breast-pink-600
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    rotate: -2,
    boxShadow: "0px 4px 12px rgba(236, 72, 153, 0.3)",
    transition: { duration: 0.2 },
  },
};

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

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
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#EC4899" },
            shape: { type: "circle" },
            opacity: { value: 0.2, random: true },
            size: { value: 2, random: true },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              random: true,
              out_mode: "out",
            },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { particles_nb: 4 },
            },
          },
          retina_detect: true,
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
        {/* Logo */}
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

        {/* Navigation Tabs */}
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
        className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 px-4 pb-5 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-md mb-12"
          variants={itemVariants}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for breast cancer info..."
              className="w-full py-3 px-4 rounded-full bg-dark-accent text-white border border-gray-700 focus:border-breast-pink-500 focus:ring-2 focus:ring-breast-pink-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-breast-pink-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </motion.form>

        {/* Hero Section */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 text-breast-pink-500 tracking-tight text-center"
          variants={itemVariants}
        >
          Breast Beacon
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl text-center"
          variants={itemVariants}
        >
          Empowering early detection and care for breast cancer through
          innovative healthcare solutions.
        </motion.p>

        {/* Mammogram Graphic */}
        <motion.div variants={itemVariants} className="mb-12">
          <Mammogram />
        </motion.div>

        {/* Breast Cancer Info */}
        <motion.div
          className="max-w-3xl text-center mb-12 px-4"
          variants={itemVariants}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Understanding Breast Cancer
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Breast cancer is one of the most common cancers worldwide, but early
            detection through regular mammograms can significantly improve
            outcomes. At Breast Beacon, we provide tools and resources to
            support patients, doctors, and clinicians in the fight against
            breast cancer. Stay informed, stay proactive, and prioritize your
            health.
          </p>
        </motion.div>

        {/* Signup Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6"
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

export default Home;
