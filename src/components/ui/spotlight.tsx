"use client";

import { motion } from "framer-motion";

export function Spotlight({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-[120px] opacity-20 ${className}`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
