import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';
import mammogram from '../images/1.Breast Memmogram.jpeg'; // Import mammogram image
import lesionZoom from '../images/2.Zoom Lesion.png'; // Import zoomed lesion image
import logo from '../images/logo.png'; // Import logo

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
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const About: React.FC = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#1A1A1A' } },
          fpsLimit: 60,
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#EC4899' },
            shape: { type: 'circle' },
            opacity: { value: 0.2, random: true },
            size: { value: 2, random: true },
            move: {
              enable: true,
              speed: 0.3,
              direction: 'none',
              random: true,
              out_mode: 'out',
            },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
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
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
          {['Home', 'About', 'Services', 'Resources', 'Contact', 'Validity'].map((tab) => (
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
        className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 text-breast-pink-500 tracking-tight"
          variants={itemVariants}
        >
          About Breast Beacon
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl text-center"
          variants={itemVariants}
        >
          Empowering early detection and personalized care for breast cancer through cutting-edge technology.
        </motion.p>

        {/* Importance of Breast Beacon */}
        <motion.section
          className="max-w-4xl text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Why Breast Beacon Matters</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Breast cancer is one of the most prevalent cancers globally, affecting millions of lives each year. Early detection is critical for improving survival rates and treatment outcomes. Breast Beacon is a revolutionary platform designed to bridge the gap between patients, doctors, and clinicians by providing accessible, accurate, and AI-assisted tools for breast cancer screening and diagnosis. Our application empowers individuals to take control of their health through regular screenings, personalized risk assessments, and educational resources, while supporting healthcare professionals with advanced diagnostic tools.
          </p>
        </motion.section>

        {/* Mammogram Analysis */}
        <motion.section
          className="max-w-4xl text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-4">How We Analyze Mammograms</h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-6">
            Breast Beacon leverages state-of-the-art AI algorithms to analyze mammogram images, identifying potential abnormalities with high accuracy. Our process includes:
          </p>
          <ul className="text-lg text-gray-400 list-disc list-inside text-left">
            <li><strong>Image Acquisition</strong>: High-resolution mammograms are uploaded securely by patients or clinicians.</li>
            <li><strong>Pre-Processing</strong>: Images are enhanced to improve clarity and reduce noise, ensuring accurate analysis.</li>
            <li><strong>AI Analysis</strong>: Our proprietary AI model, trained on thousands of mammograms, detects lesions, calcifications, and other abnormalities, highlighting areas of concern.</li>
            <li><strong>Zoomed Visualization</strong>: Suspicious areas are magnified for detailed inspection, with clear annotations for clinicians.</li>
            <li><strong>Reporting</strong>: Results are presented in an easy-to-understand format, with recommendations for further action, shared securely with healthcare providers.</li>
          </ul>
        </motion.section>

        {/* Mammogram Graphic with Zoomed Lesion */}
        <motion.div
          className="max-w-4xl mb-16 flex flex-col md:flex-row items-center justify-center gap-8"
          variants={itemVariants}
        >
          <div className="relative w-full md:w-1/2">
            <img
              src={mammogram}
              alt="Mammogram Image"
              className="w-full rounded-lg shadow-xl border-2 border-dark-accent"
            />
            <div className="absolute top-1/4 left-2/3 w-8 h-8 border-4 border-yellow-100 rounded-md animate-pulse" />
          </div>
          <div className="relative w-full md:w-1/2">
            <img
              src={lesionZoom}
              alt="Zoomed Lesion Area"
              className="w-full rounded-lg shadow-xl border-4 border-yellow-400"
            />
            <span className="absolute top-2 left-2 bg-yellow-400 text-dark-bg px-2 py-1 rounded text-sm font-semibold">
              Zoomed Lesion
            </span>
          </div>
        </motion.div>

        {/* About Breast Cancer */}
        <motion.section
          className="max-w-4xl text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Understanding Breast Cancer</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Breast cancer occurs when cells in the breast tissue grow uncontrollably, forming tumors that can be benign (non-cancerous) or malignant (cancerous). Malignant tumors can spread to other parts of the body if not treated early. Key facts about breast cancer include:
          </p>
          <ul className="text-lg text-gray-400 list-disc list-inside text-left mt-4">
            <li><strong>Prevalence</strong>: It’s the second most common cancer in women worldwide, though men can also develop it.</li>
            <li><strong>Risk Factors</strong>: Include age, family history, genetic mutations (e.g., BRCA1/BRCA2), and lifestyle factors like alcohol consumption.</li>
            <li><strong>Symptoms</strong>: Lumps, changes in breast shape, skin dimpling, or nipple discharge. Regular self-exams and screenings are crucial.</li>
            <li><strong>Diagnosis</strong>: Mammograms, ultrasounds, and biopsies are used to detect and confirm cancer.</li>
            <li><strong>Treatment</strong>: Options include surgery, radiation, chemotherapy, and targeted therapies, depending on the cancer’s stage and type.</li>
          </ul>
          <p className="text-lg text-gray-400 mt-4">
            Early detection through regular mammograms can increase survival rates to over 90% for localized cancers. Breast Beacon is committed to making screening accessible and accurate, empowering everyone to fight breast cancer effectively.
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;