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
};

const Resources: React.FC = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const resources = [
    {
      title: "Prevalence and Impact of Breast Cancer",
      url: "https://www.nature.com/articles/s41392-024-02108-4",
      description:
        "Details breast cancer’s global impact, accounting for one-third of female cancers, with varying incidence and mortality rates across populations, highlighting lifestyle and environmental risk factors.",
    },
    {
      title: "Breast Cancer Risk Factors",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8428369/",
      description:
        "Explores genetic (BRCA mutations, family history) and lifestyle (obesity, alcohol) risk factors for breast cancer, noting early menstruation and nulliparity as contributors.",
    },
    {
      title: "Types and Stages of Breast Cancer",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8428369/",
      description:
        "Describes breast cancer types (e.g., ductal carcinoma, inflammatory) and TNM staging, emphasizing hormone receptor and HER2 status for classification and prognosis.",
    },
    {
      title: "Breast Cancer Treatment Options",
      url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
      description:
        "Outlines breast cancer treatments (surgery, chemotherapy, hormone therapy) and emerging options like immunotherapy, with 670,000 global deaths in 2022.",
    },
    {
      title: "Early Detection of Breast Cancer",
      url: "https://www.mayoclinic.org/diseases-conditions/breast-cancer/symptoms-causes/syc-20352470",
      description:
        "Highlights mammography and self-exams for early breast cancer detection, improving survival rates by enabling more effective treatment at earlier stages.",
    },
    {
      title: "Ongoing Breast Cancer Research",
      url: "https://www.nature.com/subjects/breast-cancer",
      description:
        "Discusses research on molecular mechanisms, biomarkers, and targeted therapies, including KDM4C’s role in shielding breast cancer from histone scissor cathepsin L.",
    },
    {
      title: "Living with Breast Cancer",
      url: "https://www.canceraustralia.gov.au/cancer-types/breast-cancer-young-women/living-breast-cancer",
      description:
        "Addresses physical (e.g., osteoporosis risk) and emotional challenges for young women with breast cancer, emphasizing support systems for improved quality of life.",
    },
  ];

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
          Breast Cancer Resources
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl text-center"
          variants={itemVariants}
        >
          Explore articles from trusted sources on breast cancer prevalence,
          risk factors, treatment, early detection, research, and living with
          the disease to stay informed.
        </motion.p>

        {/* Resources Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
          variants={containerVariants}
        >
          {resources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dark-accent rounded-lg p-6 border border-gray-700 hover:border-breast-pink-500 transition-all duration-300"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <h3 className="text-xl font-semibold text-breast-pink-500 mb-2">
                {resource.title}
              </h3>
              <p className="text-gray-400 text-base mb-4">
                {resource.description}
              </p>
              <motion.span
                className="inline-block text-breast-pink-500 font-medium hover:underline"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Read Article
              </motion.span>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Resources;
