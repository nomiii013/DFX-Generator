// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [fonts, setFonts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [file, setFile] = useState(null);

  // ✅ Fetch analytics on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => setUsageData(data))
      .catch((err) => console.error("Analytics Error:", err));
  }, []);

  // ✅ Handle font upload
  const handleFontUpload = async () => {
    if (!file) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/upload-font", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Font uploaded!");
    } catch (e) {
      alert("Upload failed!");
    }
  };

  // ✅ Handle export analytics
  const handleExport = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/admin/export");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24"> {/* ✅ Added pt-24 */}
      <motion.h1
        className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛠️ Admin Dashboard
      </motion.h1>

      {/* FONT UPLOAD SECTION */}
      <section className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">📂 Upload Fonts / Templates</h2>
        <input
          type="file"
          className="mb-4 text-gray-300"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleFontUpload}
          className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </section>

      {/* ANALYTICS SECTION */}
      <section className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">📊 Usage Data</h2>
        {usageData.length === 0 ? (
          <p className="text-gray-400">No data available yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2">Layout</th>
                <th className="border border-gray-600 p-2">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {usageData.map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-600 p-2">{row.layout}</td>
                  <td className="border border-gray-600 p-2">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={handleExport}
          className="mt-5 px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          📥 Export CSV
        </button>
      </section>

      {/* PRICING MANAGEMENT */}
      <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">💰 Manage Pricing Tiers</h2>
        <p className="text-gray-400 mb-4">
          (Coming soon) — You can define free vs. premium DXF options.
        </p>
        <button className="px-5 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
          Add Pricing Tier
        </button>
      </section>
    </div>
  );
};

export default AdminDashboard;
