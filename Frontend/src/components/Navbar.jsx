import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Generate DXF", path: "/generate" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-gray-900/70 backdrop-blur-xl border-b border-gray-800 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold tracking-wide"
        >
          <span className="text-blue-400">DXF</span> Tool
        </motion.h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10">
          {navLinks.map((link, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={link.path}
                className={`relative px-1 transition-all duration-300 
                ${
                  location.pathname === link.path
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                {link.name}

                {/* Active underline */}
                {location.pathname === link.path && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute left-0 bottom-[-4px] h-[2px] w-full bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6]"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col mt-2 bg-gray-800/95 text-center rounded-lg p-4 space-y-3"
        >
          {navLinks.map((link, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 rounded-md transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-blue-400 bg-gray-700/50"
                    : "text-gray-300 hover:text-blue-300 hover:bg-gray-700/30"
                }`}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.nav>
  );
};

export default Navbar;
