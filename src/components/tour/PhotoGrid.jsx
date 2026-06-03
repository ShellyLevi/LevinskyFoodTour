import React from 'react';
import { motion } from 'framer-motion';

export default function PhotoGrid({ photos, onDelete }) {
  if (!photos.length) return null;

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {photos.map((url, i) => (
        <motion.div
          key={url}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: i * 0.05, type: 'spring', bounce: 0.4 }}
          className="relative aspect-square rounded-xl overflow-hidden shadow-md border-2 border-white group"
        >
          <img
            src={url}
            alt={`תמונה ${i + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {onDelete && (
            <button
              onClick={() => onDelete(i)}
              className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs font-black flex items-center justify-center shadow-md leading-none"
              aria-label="מחק תמונה"
            >
              ✕
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
