import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="pt-28 pb-20 px-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* 👆 pt-28 = space below navbar, pb-20 = space above footer */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl bg-gray-900/70 backdrop-blur-lg shadow-2xl rounded-2xl p-10 border border-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          About DXF Generator Tool
        </h2>

        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          Welcome to the <span className="text-blue-400 font-semibold">DXF Generator Tool</span> — 
          your smart companion for creating <span className="text-teal-400 font-semibold">CAD-ready text designs</span> 
          within seconds. Whether you're a student, engineer, or designer, our platform empowers you 
          to generate <span className="text-blue-400">DXF (Drawing Exchange Format)</span> files 
          with precision and creativity — no complex software required.
        </p>

        <h3 className="text-2xl font-bold text-teal-400 mt-8 mb-3">✨ Key Features</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>🎨 <span className="text-blue-400 font-semibold">Multiple Layouts</span> — Straight, Arched, Circular, Monogram, and Stacked styles.</li>
          <li>🔠 <span className="text-blue-400 font-semibold">Custom Font Library</span> — Choose from 30+ modern and industrial fonts.</li>
          <li>⚙️ <span className="text-blue-400 font-semibold">AI-Powered Suggestions</span> — Get design ideas instantly.</li>
          <li>⚡ <span className="text-blue-400 font-semibold">Instant DXF Export</span> — One click to download your file.</li>
          <li>🌐 <span className="text-blue-400 font-semibold">Fully Online</span> — Works from any device, no installation needed.</li>
        </ul>

        <h3 className="text-2xl font-bold text-teal-400 mt-10 mb-3">🚀 Why Choose DXF Tool?</h3>
        <p className="text-gray-300 leading-relaxed">
          Traditional CAD tools are complex. The DXF Generator simplifies everything by combining 
          <span className="text-blue-400"> speed</span>, <span className="text-teal-400">accuracy</span>, 
          and <span className="text-blue-400">creativity</span>. Perfect for:
        </p>

        <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3">
          <li>🪚 Laser Cutting & CNC Machining</li>
          <li>🏗️ Architectural Lettering & Signage</li>
          <li>🎁 Branding, Logos & Decorative Designs</li>
          <li>📘 Educational & Engineering Projects</li>
        </ul>

        <h3 className="text-2xl font-bold text-teal-400 mt-10 mb-3">🧠 Powered By</h3>
        <p className="text-gray-300 leading-relaxed">
          Built on a <span className="text-blue-400 font-semibold">Flask backend</span> and 
          <span className="text-teal-400 font-semibold"> React + TailwindCSS</span> frontend, 
          with animations by <span className="text-blue-400 font-semibold">Framer Motion</span> 
          — ensuring speed, clarity, and beauty in every interaction.
        </p>

        <p className="text-lg text-center mt-10 italic text-gray-400">
          "Design faster. Cut smarter. Create freely — with DXF Generator Tool."
        </p>
      </motion.div>
    </div>
  );
};

export default About;
