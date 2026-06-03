import React from 'react';
import { motion } from 'framer-motion';

const emojis = ['🍕', '🥨', '🌮', '🍔', '🍪', '🍣', '🧆', '🍙', '🫓', '🥟', '🍩', '🍰', '🍫', '🧁', '🍦'];

export default function FoodEmojiBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-20 select-none"
          style={{
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23 + 10) % 85}%`,
          }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
