import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTour } from '@/lib/tourContext';

export default function TransitionScreen({ nextPath }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const fromStation = parseInt(id) - 1;
  const { personalPhotos } = useTour();

  const photo = personalPhotos.length > 0
    ? personalPhotos[(fromStation % personalPhotos.length)]
    : null;

  useEffect(() => {
    const timer = setTimeout(() => navigate(nextPath), 3500);
    return () => clearTimeout(timer);
  }, [nextPath, navigate]);

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col bg-gradient-to-b from-amber-100 via-orange-100 to-rose-100 overflow-hidden ${
        photo ? 'items-center justify-between' : 'items-center justify-center'
      }`}
    >
      {/* ── Personal photo (only when one exists) ── */}
      {photo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
          className="w-full px-8 pt-6 flex flex-col items-center"
          style={{ maxHeight: '55vh' }}
        >
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white w-full"
            style={{ maxHeight: '52vh' }}
          >
            <img
              src={photo}
              alt="תמונה אישית"
              className="w-full h-full object-cover"
              style={{ maxHeight: '52vh' }}
            />
          </div>
        </motion.div>
      )}

      {/* ── Walking animation ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`w-full flex flex-col items-center ${photo ? 'pb-10 pt-4' : 'py-0'}`}
      >
        <p className="text-2xl font-bold text-foreground mb-8">
          בדרך לתחנה הבאה... 🏃‍♀️
        </p>
        <div className="flex flex-col items-center gap-4">
          {['👣', '👣', '👣', '👣', '👣'].map((step, i) => (
            <motion.span
              key={i}
              className="text-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.4, duration: 0.4 }}
              style={{ display: 'block', transform: i % 2 === 0 ? 'scaleX(-1)' : 'none' }}
            >
              {step}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
