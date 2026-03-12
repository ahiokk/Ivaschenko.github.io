"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingExperience() {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startedAt = Date.now();
    const duration = 1350;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t >= 1) {
        window.clearInterval(interval);
        setCompleted(true);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!completed) return;

    const timeout = window.setTimeout(() => setVisible(false), 720);
    return () => window.clearTimeout(timeout);
  }, [completed]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#060910]"
      initial={{ opacity: 1 }}
      animate={completed ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.21, 1, 0.32, 1] }}
    >
      <div className="w-[min(420px,88vw)]">
        <p className="section-kicker text-center">Initializing Structural Narrative</p>
        <p className="mt-4 text-center font-mono text-sm text-slate-300">{progress}%</p>
        <div className="mt-4 h-[2px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-slate-300/40 via-blue-200/90 to-slate-300/40"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
