import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { useTour } from '@/lib/tourContext';

export default function GroupSelect() {
  const navigate = useNavigate();
  const { setGroupType } = useTour();

  const choose = (type) => {
    setGroupType(type);
    navigate('/personal-photos');
  };

  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-200 via-pink-100 to-amber-100">
      <FoodEmojiBg />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8 safe-top">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center border border-white/50"
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🙋
          </motion.div>

          <h1 className="text-2xl font-black text-foreground mb-2 leading-relaxed">
            מי אנחנו? 😊
          </h1>
          <p className="text-base text-foreground/70 mb-8 font-medium">
            בחרו את הקטגוריה שלכם כדי לקבל את המשימות המתאימות
          </p>

          <div className="flex flex-col gap-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => choose('couple')}
              className="bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-2xl py-6 px-6 shadow-lg font-black text-xl flex flex-col items-center gap-2 w-full border-2 border-white/30"
            >
              <span className="text-4xl">💑</span>
              אנחנו זוג
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => choose('friends')}
              className="bg-gradient-to-br from-sky-400 to-indigo-500 text-white rounded-2xl py-6 px-6 shadow-lg font-black text-xl flex flex-col items-center gap-2 w-full border-2 border-white/30"
            >
              <span className="text-4xl">👫</span>
              אנחנו חברים טובים
            </motion.button>
          </div>
        </motion.div>

        <p className="text-xs text-foreground/40 mt-6 text-center">
          © כל הזכויות שמורות לשלי לוי
        </p>
      </div>
    </div>
  );
}
