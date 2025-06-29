import { Link } from "react-router-dom";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { memo, useCallback, useState, useEffect, useRef, useMemo } from "react";
import logo from "../images/logo.png";

// Error Boundary Component
const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("ErrorBoundary caught:", error);
      setHasError(true);
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError)
    return (
      fallback || (
        <div className="text-red-500 text-center">Something went wrong.</div>
      )
    );
  return <>{children}</>;
};

// Animation Variants
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      type: "spring",
      stiffness: 100,
    },
  },
  hover: {
    y: -5,
    transition: { duration: 0.3 },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      type: "spring",
      stiffness: 120,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 20px rgba(219, 39, 119, 0.2)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  tap: { scale: 0.95 },
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Search Bar Component
const SearchBar = memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLFormElement | null>(null);
  const isSearchInView = useInView(searchRef, { once: false, amount: 0.1 });

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        console.log("Search triggered:", searchQuery);
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          searchQuery + " site:breastcancer.org"
        )}`;
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    console.log("SearchBar rendered, isSearchInView:", isSearchInView);
  }, [isSearchInView]);

  return (
    <motion.form
      ref={searchRef}
      onSubmit={handleSearch}
      className="w-full flex justify-center mb-12 sm:mb-16"
      initial="hidden"
      animate={isSearchInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.4,
            duration: 0.8,
            ease: "easeOut",
          },
        },
      }}
    >
      <motion.div
        className="relative w-full max-w-xl"
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 25px rgba(219, 39, 119, 0.1)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for breast cancer information..."
          className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-full bg-white text-gray-900 border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-base sm:text-lg shadow-lg"
        />
        <motion.button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-600 hover:text-pink-700"
          whileHover={{
            scale: 1.2,
            rotate: 10,
          }}
          whileTap={{
            scale: 0.9,
            rotate: -5,
          }}
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
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
        </motion.button>
      </motion.div>
    </motion.form>
  );
});

// Stat Card Component
const StatCard = memo(
  ({
    stat,
    index,
  }: {
    stat: { value: string; label: string };
    index: number;
  }) => {
    const statsRef = useRef<HTMLDivElement>(null);
    const isStatsInView = useInView(statsRef, { once: false, amount: 0.1 });

    useEffect(() => {
      console.log(`StatCard ${index} rendered`);
    }, [index]);

    return (
      <motion.div
        ref={statsRef}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 text-center"
        variants={fadeIn}
        initial="hidden"
        animate={isStatsInView ? "visible" : "hidden"}
        custom={index}
        whileHover={{
          y: -10,
          scale: 1.03,
          boxShadow: "0 15px 30px rgba(219, 39, 119, 0.15)",
          transition: { duration: 0.3 },
        }}
      >
        <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-2 sm:mb-3">
          {stat.value}
        </div>
        <div className="text-gray-600 text-sm sm:text-base">{stat.label}</div>
      </motion.div>
    );
  }
);

// Animated Ribbon Component
const BreastAwarenessGraphic = memo(() => {
  useEffect(() => {
    console.log("BreastAwarenessGraphic rendered");
  });

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto my-12 sm:my-16"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="relative flex justify-center items-center h-64 sm:h-80">
        <motion.div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-pink-100/20 border-4 border-pink-300/50 shadow-lg"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="relative z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="text-pink-500 drop-shadow-md"
          >
            <path
              d="M100,30 C120,30 140,50 140,70 C140,90 120,110 100,110 C80,110 60,90 60,70 C60,50 80,30 100,30 Z"
              fill="currentColor"
            />
            <path
              d="M100,110 C120,110 140,130 140,150 C140,170 120,190 100,190 C80,190 60,170 60,150 C60,130 80,110 100,110 Z"
              fill="currentColor"
            />
            <motion.path
              d="M100,80 C90,70 70,60 70,80 C70,100 100,120 100,120 C100,120 130,100 130,80 C130,60 110,70 100,80 Z"
              fill="#fff"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.5,
              }}
            />
          </svg>
        </motion.div>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-${i}00/30 border-2 border-pink-${i}00/50 shadow-sm`}
            style={{
              left: `${Math.random() * 60 + 20}%`,
              top: `${Math.random() * 60 + 20}%`,
            }}
            animate={{
              y: [0, 10, 0],
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controls = useAnimation();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const preventionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.1 });
  const isInfoInView = useInView(infoRef, { once: false, amount: 0.1 });
  const isPreventionInView = useInView(preventionRef, {
    once: false,
    amount: 0.1,
  });
  const isCtaInView = useInView(ctaRef, { once: false, amount: 0.1 });

  // Particle initialization
  const particlesInit = useCallback(async (engine: any) => {
    try {
      console.log("Initializing particles with loadFull");
      await loadFull(engine);
      console.log("Particles initialized successfully");
    } catch (error) {
      console.error("Failed to initialize particles:", error);
    }
  }, []);

  // Memoized particle options
  const particleOptions = useMemo(
    () => ({
      background: { color: { value: "#f9fafb" } },
      fpsLimit: 120,
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 1000,
          },
        },
        color: {
          value: ["#f472b6", "#db2777", "#ec4899"],
        },
        shape: {
          type: ["circle", "triangle"],
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
        },
        move: {
          enable: true,
          speed: { min: 0.2, max: 0.5 },
          direction: "none" as const,
          random: true,
          outModes: "out" as const,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
          push: {
            quantity: 4,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  useEffect(() => {
    if (
      isHeroInView ||
      isStatsInView ||
      isInfoInView ||
      isPreventionInView ||
      isCtaInView
    ) {
      controls.start("visible");
      console.log("Section in view, triggering animations");
    }
  }, [
    isHeroInView,
    isStatsInView,
    isInfoInView,
    isPreventionInView,
    isCtaInView,
    controls,
  ]);

  // Data
  const breastCancerStats = [
    { value: "1 in 8", label: "women will develop breast cancer" },
    {
      value: "85%",
      label: "of breast cancers occur in women with no family history",
    },
    { value: "99%", label: "5-year survival rate for localized cases" },
    { value: "2.3M", label: "new cases diagnosed worldwide each year" },
  ];

  const preventionTips = [
    "Maintain a healthy weight",
    "Exercise regularly (150+ minutes/week)",
    "Limit alcohol consumption",
    "Breastfeed if possible",
    "Know your family history",
    "Get regular screenings",
  ];

  useEffect(() => {
    console.log("Home component rendered");
  });

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 overflow-x-hidden">
        {/* Particle Background */}
        <ErrorBoundary
          fallback={
            <div className="text-red-500 text-center">
              Failed to load particles
            </div>
          }
        >
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={particleOptions}
            className="absolute inset-0 z-0"
          />
        </ErrorBoundary>

        {/* Navigation */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg py-4 px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-gray-200/50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
        >
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={logo}
                alt="Breast Beacon Logo"
                className="h-10 sm:h-12 w-auto"
                onError={() => console.error("Failed to load logo.png")}
              />
            </motion.div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-pink-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </motion.svg>
          </button>

          {/* Navigation Links */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row absolute md:static top-16 left-0 right-0 bg-white/90 md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-8`}
          >
            {[
              "Home",
              "About",
              "Services",
              "Resources",
              "Contact",
              "Validity",
            ].map((tab, i) => (
              <Link
                key={tab}
                to={`/${tab.toLowerCase()}`}
                className="relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.span
                  className="text-gray-700 hover:text-pink-600 text-base sm:text-lg font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {tab}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"></span>
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.nav>

        {/* Main Content */}
        <div className="relative z-10 pt-20 sm:pt-24 px-4 sm:px-6 pb-16 mx-auto max-w-7xl">
          {/* Hero Section */}
          <section
            ref={heroRef}
            className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
          >
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="w-full max-w-6xl mx-auto"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-700 tracking-tight"
                variants={itemVariants}
                whileHover={{
                  backgroundPosition: "100% 50%",
                  transition: { duration: 1.5, ease: "easeInOut" },
                }}
                style={{
                  backgroundSize: "200% auto",
                }}
              >
                Breast Beacon
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
                variants={itemVariants}
                whileHover={{
                  color: "#db2777",
                  transition: { duration: 0.3 },
                }}
              >
                Empowering{" "}
                <span className="text-pink-600 font-semibold">
                  early detection
                </span>{" "}
                and{" "}
                <span className="text-pink-600 font-semibold">
                  personalized care
                </span>{" "}
                through innovative breast cancer solutions.
              </motion.p>

              <ErrorBoundary
                fallback={
                  <div className="text-red-500 text-center">
                    Failed to load search bar
                  </div>
                }
              >
                <SearchBar />
              </ErrorBoundary>

              <ErrorBoundary
                fallback={
                  <div className="text-red-500 text-center">
                    Failed to load graphic
                  </div>
                }
              >
                <BreastAwarenessGraphic />
              </ErrorBoundary>
            </motion.div>
          </section>

          {/* Stats Section */}
          <section ref={statsRef} className="py-12 sm:py-16 px-4">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
              initial="hidden"
              animate={isStatsInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {breastCancerStats.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </motion.div>
          </section>

          {/* Information Sections */}
          <section ref={infoRef} className="py-12 sm:py-16 px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 mb-12 sm:mb-16 max-w-6xl mx-auto"
              initial="hidden"
              animate={isInfoInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              <motion.div
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
                variants={fadeIn}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 sm:mb-6">
                  Understanding Breast Cancer
                </h3>
                <div className="space-y-4 text-gray-700 text-sm sm:text-base">
                  <p>
                    Breast cancer occurs when cells in the breast grow
                    abnormally and form a tumor. While it can occur in both
                    women and men, it's much more common in women.
                  </p>
                  <p>
                    Early detection through regular screenings like mammograms
                    can increase survival rates to over 90%. Not all lumps are
                    cancerous, but all should be checked by a doctor.
                  </p>
                  <p>
                    Modern treatments have significantly improved outcomes, with
                    personalized approaches based on the specific type of breast
                    cancer.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
                variants={fadeIn}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 sm:mb-6">
                  Risk Factors
                </h3>
                <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-start">
                    <span className="text-pink-500 text-lg sm:text-xl mr-3">
                      •
                    </span>
                    <span>
                      <strong>Age:</strong> Risk increases after 50, though
                      younger women can be affected
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 text-lg sm:text-xl mr-3">
                      •
                    </span>
                    <span>
                      <strong>Genetics:</strong> BRCA1/BRCA2 mutations
                      significantly increase risk
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 text-lg sm:text-xl mr-3">
                      •
                    </span>
                    <span>
                      <strong>Family History:</strong> Especially if close
                      relatives were diagnosed young
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 text-lg sm:text-xl mr-3">
                      •
                    </span>
                    <span>
                      <strong>Dense Breast Tissue:</strong> Makes detection more
                      difficult
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 text-lg sm:text-xl mr-3">
                      •
                    </span>
                    <span>
                      <strong>Lifestyle Factors:</strong> Alcohol, obesity, and
                      physical inactivity
                    </span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </section>

          {/* Prevention Section */}
          <section ref={preventionRef} className="py-12 sm:py-16 px-4">
            <motion.div
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 mb-12 sm:mb-16 max-w-6xl mx-auto"
              initial="hidden"
              animate={isPreventionInView ? "visible" : "hidden"}
              variants={fadeIn}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 sm:mb-6 text-center">
                Prevention & Early Detection
              </h3>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                variants={containerVariants}
              >
                {preventionTips.map((tip, i) => (
                  <motion.div
                    key={i}
                    className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 flex items-start hover:bg-white hover:shadow-md transition-all"
                    variants={fadeIn}
                    whileHover={{ y: -5, scale: 1.03 }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <span className="text-pink-600 text-base sm:text-lg">
                        ✓
                      </span>
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">
                      {tip}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Call to Action */}
          <section ref={ctaRef} className="py-12 sm:py-16 px-4 text-center">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 sm:p-8 rounded-2xl shadow-xl max-w-6xl mx-auto"
              initial="hidden"
              animate={isCtaInView ? "visible" : "hidden"}
              variants={fadeIn}
              whileHover={{
                scale: 1.005,
                boxShadow: "0 20px 40px rgba(219, 39, 119, 0.2)",
              }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Take Action?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-pink-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
                Whether you're a patient, doctor, or clinician, we have
                resources tailored to your needs.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6"
                variants={containerVariants}
              >
                {[
                  { path: "/signup/patient", label: "Patient Signup" },
                  { path: "/signup/doctor", label: "Doctor Signup" },
                  { path: "/signup/clinician", label: "Clinician Signup" },
                  { path: "/login", label: "Login" },
                ].map((button, i) => (
                  <Link to={button.path} key={button.path}>
                    <motion.button
                      className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 transition-all duration-300 ${
                        button.label === "Login"
                          ? "bg-white text-pink-600 border-white hover:bg-pink-50 hover:text-pink-700"
                          : "bg-pink-700 text-white border-pink-700 hover:bg-pink-800 hover:border-pink-800"
                      }`}
                      variants={buttonVariants}
                      initial="hidden"
                      animate={[
                        "visible",
                        button.label === "Clinician Signup" ? "pulse" : "",
                      ]}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {button.label}
                    </motion.button>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
