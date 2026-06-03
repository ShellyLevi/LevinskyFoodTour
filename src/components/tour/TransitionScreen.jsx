import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { transitionImages } from '@/lib/tourConfig';

export default function TransitionScreen({ nextPath }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const fromStation = parseInt(id) - 1; // id is the NEXT station, so from = id-1

  // Find if there's an image configured for this transition
  const transitionImage = transitionImages.find(t => t.fromStation === fromStation);

  useEffect(() => {
    const delay = transitionImage ? 4000 : 2500;
    const timer = setTimeout(() => navigate(nextPath), delay);
    return () => clearTimeout(timer);
  }, [nextPath, navigate, transitionImage]);

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-100 via-orange-100 to-rose-100 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full max-w-sm">

        {transitionImage ? (
          /* With image */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="w-full"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-4">
              <img
                src={transitionImage.image}
                alt="תמונה מהסיור"
                className="w-full object-cover max-h-72"
              />
            </div>
            {transitionImage.caption && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold text-foreground mb-6 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2"
              >
                {transitionImage.caption}
              </motion.p>
            )}
            <p className="text-foreground/60 text-sm font-medium">בדרך למקום הבא... 🏃‍♀️</p>
          </motion.div>
        ) : (
          /* Without image — animated footsteps */
          <>
            <p className="text-2xl font-bold text-foreground mb-8">בדרך למקום הבא... 🏃‍♀️</p>
            <div className="flex flex-col items-center gap-4">
              {['👣', '👣', '👣', '👣', '👣'].map((step, i) => (
                <motion.span
                  key={i}
                  className="text-4xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.4 }}
                  style={{ transform: i % 2 === 0 ? 'scaleX(-1)' : 'none' }}
                >
                  {step}
                </motion.span>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
