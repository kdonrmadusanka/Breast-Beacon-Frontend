import React, { useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";
import { registerDoctor } from "../utils/api";
import logo from "../images/logo.png";

// Define interface for form values
interface DoctorFormValues {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
  specialty: string;
}

// Doctor Signup Schema
const DoctorSignupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .test("is-valid-date", "Invalid date or future date", (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    }),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  specialty: Yup.string()
    .required("Specialty is required")
    .oneOf(
      ["Oncology", "Radiology", "General Practice", "Surgery"],
      "Please select a valid specialty"
    ),
});

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
    transition: { duration: 0.5, ease: "easeOut" as const },
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
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 8px 24px rgba(236, 72, 153, 0.5)",
    backgroundColor: "#DB2777",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 4px 12px rgba(236, 72, 153, 0.3)",
    transition: { duration: 0.2 },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

// Animated Error Message Component
const AnimatedErrorMessage: React.FC<{ name: string }> = ({ name }) => (
  <AnimatePresence>
    <ErrorMessage
      name={name}
      render={(msg) => (
        <motion.div
          key={name}
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-red-400 text-sm mt-1"
        >
          {msg}
        </motion.div>
      )}
    />
  </AnimatePresence>
);

export const DoctorSignup: React.FC = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: { color: { value: "#1A1A1A" } },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#EC4899" },
        move: {
          direction: "none" as const,
          enable: true,
          outModes: { default: "out" as const },
          random: true,
          speed: { min: 0.2, max: 0.4 },
        },
        number: {
          density: {
            enable: true,
            value_area: 800,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
          anim: { enable: true, speed: 1, sync: false },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 3 },
          anim: { enable: true, speed: 1, sync: false },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="relative min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-dark-accent bg-opacity-80 backdrop-blur-md py-4 px-6 flex items-center justify-between"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
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
        className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-dark-accent p-10 rounded-2xl border border-breast-pink-500 w-full max-w-lg"
          variants={itemVariants}
        >
          <motion.h2
            className="text-3xl font-extrabold mb-8 text-center text-breast-pink-500"
            variants={itemVariants}
          >
            Doctor Signup
          </motion.h2>
          <Formik<DoctorFormValues>
            initialValues={{
              name: "",
              email: "",
              dateOfBirth: "",
              password: "",
              specialty: "",
            }}
            validationSchema={DoctorSignupSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                const response = await registerDoctor(values);

                if (response.status === 201) {
                  alert("Doctor registration successful!");
                  navigate("/login");
                }
              } catch (error: any) {
                if (error.response?.data?.message === "Email already exists") {
                  setErrors({
                    email:
                      "This email is already registered. Please use a different email.",
                  });
                } else {
                  setErrors({
                    email:
                      error.response?.data?.message ||
                      "Registration failed. Please try again.",
                  });
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 p-3 w-full bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-breast-pink-500 focus:border-breast-pink-500 transition duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                  <AnimatedErrorMessage name="name" />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 p-3 w-full bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-breast-pink-500 focus:border-breast-pink-500 transition duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                  <AnimatedErrorMessage name="email" />
                  {errors.email &&
                    errors.email.includes("already registered") && (
                      <motion.p
                        className="text-sm mt-2 text-breast-pink-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Already have an account?{" "}
                        <Link to="/login" className="underline">
                          Login here
                        </Link>
                      </motion.p>
                    )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Date of Birth
                  </label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    className="mt-1 p-3 w-full bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-breast-pink-500 focus:border-breast-pink-500 transition duration-200 text-white"
                  />
                  <AnimatedErrorMessage name="dateOfBirth" />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="specialty"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Specialty
                  </label>
                  <Field
                    as="select"
                    name="specialty"
                    className="mt-1 p-3 w-full bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-breast-pink-500 focus:border-breast-pink-500 transition duration-200 text-white"
                  >
                    <option value="" disabled>
                      Select your specialty
                    </option>
                    <option value="Oncology">Oncology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Surgery">Surgery</option>
                  </Field>
                  <AnimatedErrorMessage name="specialty" />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="mt-1 p-3 w-full bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-breast-pink-500 focus:border-breast-pink-500 transition duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <AnimatedErrorMessage name="password" />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-dark-accent text-white p-3 rounded-lg border-2 border-breast-pink-500 animate-border-cycle hover:bg-breast-pink-600 disabled:bg-gray-600 disabled:border-gray-600 transition duration-300 font-semibold"
                  variants={buttonVariants}
                  initial="initial"
                  animate={["visible", "pulse"]}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label={isSubmitting ? "Submitting" : "Sign Up"}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </motion.button>
              </Form>
            )}
          </Formik>

          <motion.p
            className="mt-6 text-center text-sm text-gray-400"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <Link to="/login" className="text-breast-pink-500 hover:underline">
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorSignup;
