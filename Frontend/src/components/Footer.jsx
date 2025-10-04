import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 py-10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
        
        {/* 🏷️ Left Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            <span className="text-blue-400">DXF</span> Tool
          </h2>
          <p className="text-sm text-gray-400">
            Smart, Fast & AI-powered DXF generator for your designs.
          </p>
        </div>

        {/* 🔗 Middle Navigation Links */}
        <ul className="flex space-x-6 text-sm font-medium">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Generate DXF", path: "/generate" },
            { name: "Admin", path: "/admin" },
          ].map((link, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={link.path}
                className="relative group transition-all duration-300"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* 🌐 Social Icons */}
        <div className="flex space-x-6">
          {[
            { icon: <FaGithub />, link: "https://github.com", color: "hover:text-white" },
            { icon: <FaTwitter />, link: "https://twitter.com", color: "hover:text-blue-400" },
            { icon: <FaLinkedin />, link: "https://linkedin.com", color: "hover:text-blue-500" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`text-gray-400 ${item.color} transition duration-300`}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* 💬 Bottom Copyright */}
      <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()}{" "}
        <span className="text-blue-400 font-semibold">DXF Tool</span> — All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
