import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';

const extras = [
  {
    name: "SWEET BOX",
    address: "החלוצים 12",
    emoji: "🍪",
    desc: "קינוחים, עוגיות ומאפים אמריקאיים מושחתים.",
    mapsQuery: "Sweet+Box+החלוצים+12+תל+אביב",
  },
  {
    name: "מעדניית יום טוב",
    address: "לוינסקי 43",
    emoji: "🧀",
    desc: "גבינות בוטיק, זיתים ומעדנים טורקיים.",
    mapsQuery: "מעדניית+יום+טוב+לוינסקי+43+תל+אביב",
  },
  {
    name: "סביח פרישמן",
    address: "לוינסקי 39",
    emoji: "🥚",
    desc: "הסביח המושלם והידוע.",
    mapsQuery: "סביח+פרישמן+לוינסקי+39+תל+אביב",
  },
  {
    name: "חומוס גרגר הזהב",
    address: "לוינסקי 30",
    emoji: "🫘",
    desc: "חומוסייה שכונתית מעולה.",
    mapsQuery: "חומוס+גרגר+הזהב+לוינסקי+30+תל+אביב",
  },
  {
    name: "הפסטה בלוינסקי",
    address: "לוינסקי 37",
    emoji: "🍝",
    desc: "מנות פסטה טרייה ואיכותית בעבודת יד במקום.",
    mapsQuery: "הפסטה+בלוינסקי+לוינסקי+37+תל+אביב",
  },
  {
    name: "באן מי 13",
    address: "לוינסקי 43",
    emoji: "🥖",
    desc: "כריכים וייטנאמיים בתוך בגט קריספי.",
    mapsQuery: "באן+מי+13+לוינסקי+43+תל+אביב",
  },
];

export default function StillHungry() {
  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-100">
      <FoodEmojiBg />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8 gap-4 safe-top">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-5xl mt-2"
        >
          🍽️😋
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center border border-white/50"
        >
          <h1 className="text-2xl font-black text-foreground mb-2">עוד רעבים? 😏</h1>
          <p className="text-base text-foreground/70 leading-relaxed">
            בא לכם עוד לנשנש משהו קטן?
          </p>
          <p className="text-sm font-bold text-primary mt-1">
            מקומות מומלצים נוספים שתוכלו להגיע אליהם:
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 max-w-sm w-full">
          {extras.map((place, i) => (
            <motion.a
              key={place.name}
              href={`https://www.google.com/maps/search/?api=1&query=${place.mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 flex items-start gap-3 hover:shadow-xl transition-shadow"
            >
              <span className="text-3xl mt-0.5">{place.emoji}</span>
              <div className="flex-1 text-right">
                <p className="font-black text-foreground text-base">{place.name}</p>
                <p className="text-xs text-primary font-medium flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3" />
                  {place.address}
                </p>
                <p className="text-sm text-foreground/70 mt-0.5">{place.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <Link to="/finale" className="text-sm text-foreground/50 underline mt-2 mb-6">
          חזרה לעמוד הסיום
        </Link>
      </div>
    </div>
  );
}
