import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Particles } from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    boxShadow: "0px 8px 24px rgba(236, 72, 153, 0.5)", // breast-pink-500 glow
    transition: { duration: 0.3, ease: "easeOut" },
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
    boxShadow: "0px 8px 24px rgba(236, 72, 153, 0.5)",
    backgroundColor: "#DB2777", // breast-pink-600
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 4px 12px rgba(236, 72, 153, 0.3)",
    transition: { duration: 0.2 },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

const Contact: React.FC = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
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
            number: {
              value: 80,
              density: { enable: true, area: 800 },
            },
            color: { value: "#EC4899" },
            shape: { type: "circle" },
            opacity: {
              value: { min: 0.1, max: 0.3 },
              animation: { enable: true, speed: 1, sync: false },
            },
            size: {
              value: { min: 1, max: 3 },
              animation: { enable: true, speed: 1, sync: false },
            },
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
        className="relative z-10 flex flex-col items-center min-h-screen pt-24 px-4 sm:px-6 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 text-breast-pink-500 tracking-tight text-center"
          variants={itemVariants}
        >
          Contact Us
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl text-center"
          variants={itemVariants}
        >
          Reach out to Breast Beacon for personalized support, breast cancer
          information, appointment scheduling, or inquiries about our services.
          Our team is here to assist you with care and compassion.
        </motion.p>

        {/* Contact Details */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12"
          variants={containerVariants}
        >
          <motion.div
            className="bg-dark-accent rounded-lg p-6 border border-gray-700 hover:border-breast-pink-500 transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3 className="text-xl font-semibold text-breast-pink-500 mb-2">
              Phone
            </h3>
            <a
              href="tel:+94725846987"
              className="text-gray-400 text-base hover:text-breast-pink-500 transition-colors duration-300"
            >
              +94 725 846 987
            </a>
          </motion.div>
          <motion.div
            className="bg-dark-accent rounded-lg p-6 border border-gray-700 hover:border-breast-pink-500 transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3 className="text-xl font-semibold text-breast-pink-500 mb-2">
              Email
            </h3>
            <a
              href="mailto:breastbeacon@gmail.com"
              className="text-gray-400 text-base hover:text-breast-pink-500 transition-colors duration-300"
            >
              breastbeacon@gmail.com
            </a>
          </motion.div>
          <motion.div
            className="bg-dark-accent rounded-lg p-6 border border-gray-700 hover:border-breast-pink-500 transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3 className="text-xl font-semibold text-breast-pink-500 mb-2">
              Location
            </h3>
            <p className="text-gray-400 text-base">Colombo, Sri Lanka</p>
          </motion.div>
        </motion.div>

        {/* Opening Hours */}
        <motion.div
          className="bg-dark-accent rounded-lg p-6 border border-gray-700 w-full max-w-md mb-12"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <h3 className="text-xl font-semibold text-breast-pink-500 mb-2">
            Opening Hours
          </h3>
          <p className="text-gray-400 text-base">
            8:00 AM – 10:00 PM (Indian Standard Time)
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.a
          href="mailto:breastbeacon@gmail.com"
          className="bg-dark-accent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-breast-pink-500 animate-border-cycle hover:bg-breast-pink-600 transition-colors duration-300"
          variants={buttonVariants}
          initial="initial"
          animate={["visible", "pulse"]}
          whileHover="hover"
          whileTap="tap"
        >
          Get in Touch
        </motion.a>
      </motion.div>
    </div>
  );
};

export default Contact;
