'use client'; // Wajib, karena animasi butuh akses browser

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} // Mulai: transparan & agak ke bawah
      whileInView={{ opacity: 1, y: 0 }} // Saat terlihat: muncul & naik ke posisi asli
      viewport={{ once: true, margin: "-100px" }} // Animasi jalan sekali saja saat di-scroll
      transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}