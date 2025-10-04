// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-gray-900/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 border border-gray-700 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          Welcome to DXF Tool 🚀
        </h2>

        <p className="text-gray-400 mb-8">
          Generate DXF files from your custom text in just a few clicks.
        </p>

        <Button
          text="⚡ Start Generating DXF"
          onClick={() => navigate("/generate")}
          variant="primary"
        />
      </motion.div>
    </div>
  );
};

export default Home;
