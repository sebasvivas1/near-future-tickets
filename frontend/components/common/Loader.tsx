import React from 'react';
import { motion } from 'framer-motion';

const loaderVariants = {
  animationOne: {
    x: [-20, 20],
    y: [0, -30],
    transition: {
      x: {
        yoyo: Infinity,
        duration: 0.5,
      },
      y: {
        yoyo: Infinity,
        duration: 0.25,
        ease: 'easeOut',
      },
    },
  },
};

export default function Loader() {
  return (
    <div className="min-h-screen w-full flex items-center">
      <motion.div variants={loaderVariants} animate="animationOne">
        <img src="/logo_vertical.png" alt="ASDFASDF" className="w-44" />
      </motion.div>
    </div>
  );
}
