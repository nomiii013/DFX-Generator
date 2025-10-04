// src/components/DXFForm.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { motion } from "framer-motion";
import PreviewPane from "./PreviewPane";

// List of fonts
const fontOptions = [
  "Arial", "Roboto", "Open Sans", "Lato", "Montserrat",
  "Poppins", "Oswald", "Raleway", "Ubuntu", "Orbitron",
  "Impact", "Georgia", "Courier New", "Trebuchet MS", "Verdana",
  "Noto Sans", "Playfair Display", "Rubik", "Quicksand", "Source Sans Pro",
  "Merriweather", "Work Sans", "Nunito", "Cabin", "Fira Sans",
  "Anton", "Barlow", "Exo", "Teko", "Baloo 2"
];

const DXFForm = () => {
  const [text, setText] = useState("");
  const [layout, setLayout] = useState("straight");
  const [font, setFont] = useState("Arial");
  const [template, setTemplate] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ AI Suggestion
  const handleAISuggest = async () => {
    if (!prompt.trim()) {
      alert("⚠️ Please enter a design idea!");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setFont(data.font);
      setLayout(data.layout);
      setTemplate(data.template);
      alert(`✨ Suggested: Font = ${data.font}, Layout = ${data.layout}, Template = ${data.template}`);
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      alert("❌ Failed to get AI suggestion. Check backend.");
    }
  };

  // ✅ DXF Generate
  const handleGenerate = async () => {
    if (!text.trim()) {
      alert("⚠️ Please enter some text first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/dxf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, layout, font, height: 20 }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Backend error:", err);
        alert("❌ Error generating DXF! Check backend logs.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${text || "output"}.dxf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert("✅ DXF file generated successfully!");
    } catch (error) {
      console.error("Fetch error:", error);
      alert("❌ Failed to generate DXF. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ Added `pt-28` for spacing below fixed Navbar
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-gray-900/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 border border-gray-700 relative overflow-hidden"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          Generate Your DXF File
        </h2>

        {/* Input */}
        <InputField label="Enter Text" value={text} onChange={(e) => setText(e.target.value)} />

        {/* Layout */}
        <div className="relative mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Select Layout</label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="straight">Straight</option>
            <option value="arched">Arched</option>
            <option value="circular">Circular</option>
            <option value="monogram">Monogram</option>
            <option value="stacked">Stacked</option>
          </select>
        </div>

        {/* Font */}
        <div className="relative mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Select Font</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            {fontOptions.map((f, idx) => (
              <option key={idx} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* AI Prompt */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">AI Prompt Mode (Optional)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your design idea..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400"
          />
          <div className="mt-3">
            <Button text="✨ Suggest with AI" onClick={handleAISuggest} />
          </div>
        </div>

        {/* Preview */}
        <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-800/60 text-center">
          <p className="text-gray-400 mb-2 text-sm">Live Preview:</p>
          <p style={{ fontFamily: font }} className="text-2xl text-white">
            {text || "Your text will appear here"}
          </p>
        </div>

        <PreviewPane text={text} layout={layout} font={font} template={template} height={20} />

        {/* Generate Button */}
        <div className="flex justify-center mt-6">
          <Button
            text={loading ? "⏳ Generating..." : "⚡ Generate DXF"}
            onClick={handleGenerate}
            loading={loading}
            disabled={loading}
            variant="primary"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DXFForm;
