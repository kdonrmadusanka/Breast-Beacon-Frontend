import React from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy", path: "/privacy" },
  ];

  const socialLinks = [
    { icon: FiGithub, url: "https://github.com" },
    { icon: FiTwitter, url: "https://twitter.com" },
    { icon: FiLinkedin, url: "https://linkedin.com" },
  ];

  const contactInfo = [
    { icon: FiMail, text: "support@breastbeacon.com" },
    { icon: FiPhone, text: "+1 (555) 123-4567" },
    { icon: FiMapPin, text: "123 Medical Drive, Boston, MA" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16V16.01M12 8V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Breast Beacon
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Empowering early detection with AI-driven breast cancer screening.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Newsletter
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe for updates on breast cancer research.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Breast Beacon AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
