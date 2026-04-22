"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "brightness(2) contrast(1.5)" }}
      animate={{ opacity: 1, y: 0, filter: "brightness(1) contrast(1)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="template-wrapper"
    >
      {children}
    </motion.div>
  );
}
