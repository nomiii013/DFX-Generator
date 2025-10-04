import React from "react";
import { motion } from "framer-motion";

const InputField = ({ label, type = "text", value, onChange, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-5"
    >
      <div className="relative">
        {/* Icon on left side */}
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </span>
        )}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={label} // 👈 Direct placeholder, floating nahi
          className={`w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white 
                     border border-gray-600 focus:border-blue-500 focus:ring-2 
                     focus:ring-blue-400 focus:outline-none transition-all 
                     placeholder-gray-400 ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </motion.div>
  );
};

export default InputField;
