import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { tourConfig } from '@/lib/tourConfig';

// ============================================================
// ✏️ ערוך את תוכן הדף הזה — מידע על מיקום הסיור
// ============================================================
const introContent = {
  title: "שוק לוינסקי",
  subtitle: "תל אביב-יפו 🌴",
  emoji: "🏪",
  paragraphs: [
    "<strong>שוק לוינסקי</strong> הוא אחד השווקים האייקוניים של תל אביב, הממוקם בשכונת פלורנטין. הרחוב נקרא על שם הסופר הציוני <strong>אלחנן ליב לוינסקי</strong>. 📚",
    "השוק הוקם רשמית ב-<strong>1964</strong>, אך כבר בשנות ה-30 היו כאן דוכני מזון. יהודי סלוניקי שביוון הביאו איתם תרבות קולינרית עשירה. 🇬🇷",
    "לאורך השנים הפך השוק למוקד של תרבויות – עיראקים, תימנים, טורקים, יוונים ועוד – שכולם הביאו את המטבח שלהם. היום השוק הוא גן עדן קולינרי! 🍽️",
    "השוק הוא לא רק מקום לקנות אוכל – הוא חוויה תרבותית של ריחות, טעמים וצבעים שמספרים את הסיפור של תל אביב. 🌈✨",
  ],
};

export default function Intro() {
  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100">
      <FoodEmojiBg />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-10 safe-top">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-white/50"
        >
          <div className="text-center mb-4">
            <span className="text-5xl">{introContent.emoji}</span>
            <h1 className="text-2xl font-black mt-3 text-foreground">{introContent.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{introContent.subtitle}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 mb-4 text-sm leading-relaxed text-foreground/90 border border-amber-200/50 space-y-3">
            {introContent.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>

          <Link to="/transition/1">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-full py-6 text-lg font-bold shadow-lg"
            >
              יאללה מתחילים! 🚀
            </Button>
          </Link>
        </motion.div>

        <p className="text-xs text-foreground/40 mt-6 text-center">
          © כל הזכויות שמורות לשלי לוי
        </p>
      </div>
    </div>
  );
}
