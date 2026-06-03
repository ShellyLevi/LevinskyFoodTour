import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { tourConfig } from '@/lib/tourConfig';

const floatingEmojis = ['🍕', '🥨', '🌮', '🍔', '🍪', '🍣', '🧆', '🍙', '🍩', '🍰'];

export default function Welcome() {
  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-200 via-amber-100 to-orange-200">
      <FoodEmojiBg />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between px-6 py-8 safe-top">
        <div className="flex-1 flex flex-col items-center justify-center w-full">

          {/* Top emoji row */}
          <motion.div
            className="flex gap-2 text-4xl mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {floatingEmojis.slice(0, 5).map((e, i) => (
              <motion.span key={i} animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
                {e}
              </motion.span>
            ))}
          </motion.div>

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center border border-white/50"
          >
            {/* Logo - small, top of card */}
            {tourConfig.logoPath && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
                className="flex justify-center mb-3"
              >
                <img
                  src={tourConfig.logoPath}
                  alt="Your Story Tour"
                  className="h-28 w-28 object-contain rounded-full shadow-md"
                />
              </motion.div>
            )}

            <h1 className="text-2xl font-black text-foreground leading-relaxed mb-2">
              {tourConfig.welcomeTitle}
            </h1>

            <div className="text-5xl my-4">🥂</div>

            <h2 className="text-xl font-bold text-primary mb-4">
              {tourConfig.welcomeSubtitle}
            </h2>

            <p className="text-lg text-foreground/80 leading-relaxed mb-4 font-medium">
              {tourConfig.welcomeMessage}
            </p>

            <div className="bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3 mb-6 text-sm text-foreground/80 text-right leading-relaxed">
              <span className="font-black">❤️ שימו לב — </span>
              מוזמנים לתעד ולצלם גם מטלפון נוסף לאורך הדרך!
            </div>

            <Link to="/intro">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-bold shadow-lg w-full gap-2"
              >
                <MapPin className="w-5 h-5" />
                איפה אנחנו נמצאים? 📍
              </Button>
            </Link>
          </motion.div>

          {/* Bottom emoji row */}
          <motion.div
            className="flex gap-2 text-4xl mt-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {floatingEmojis.slice(5).map((e, i) => (
              <motion.span key={i} animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2 + 0.5, repeat: Infinity }}>
                {e}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-xs text-foreground/40 mt-4 text-center">
          © כל הזכויות שמורות לשלי לוי
        </p>
      </div>
    </div>
  );
}
