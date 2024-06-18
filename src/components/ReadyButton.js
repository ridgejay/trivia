import React from "react";
import { motion } from "framer-motion";

export default function ReadyButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-gray-500 bg-opacity-30 hover:bg-gray-700 text-white font-bold py-2 px-8 rounded border"
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
    >
      Ready to Rock
    </motion.button>
  );
}
