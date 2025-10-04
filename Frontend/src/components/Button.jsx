import React from "react";
import { motion } from "framer-motion";

const Button = ({ text, onClick, loading = false, disabled = false, variant = "primary" }) => {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
  };

  const classes = `${base} ${variants[variant]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {text}
    </motion.button>
  );
};

export default Button;
