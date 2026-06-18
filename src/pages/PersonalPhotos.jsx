import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { useTour } from '@/lib/tourContext';

const MAX_PHOTOS = 5; // one per transition between 6 stations

export default function PersonalPhotos() {
  const navigate = useNavigate();
  const { personalPhotos, addPersonalPhoto, removePersonalPhoto } = useTour();
  const inputRef = useRef(null);
  const canAddMore = personalPhotos.length < MAX_PHOTOS;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - personalPhotos.length;
    files.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => addPersonalPhoto(ev.target.result);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-200 via-orange-100 to-rose-100">
      <FoodEmojiBg />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8 safe-top">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center border border-white/50"
        >
          <div className="text-5xl mb-3">🖼️</div>
          <h1 className="text-2xl font-black text-foreground mb-2">
            הוסיפו תמונות אישיות
          </h1>
          <p className="text-sm text-foreground/70 mb-1 leading-relaxed">
            התמונות יופיעו כעיגולים עיצוביים<br />בשקפי המעבר בין התחנות ✨
          </p>
          <p className="text-xs text-foreground/50 mb-5">
            עד {MAX_PHOTOS} תמונות (אחת לכל מעבר) — אופציונלי
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-5">
            {Array.from({ length: MAX_PHOTOS }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < personalPhotos.length
                    ? 'bg-primary scale-110'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Upload button */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {canAddMore && (
            <Button
              size="lg"
              onClick={() => inputRef.current?.click()}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full w-full py-5 text-base font-bold shadow-lg mb-4"
            >
              📷 העלו תמונות מהגלריה ({personalPhotos.length}/{MAX_PHOTOS})
            </Button>
          )}
          {!canAddMore && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4 text-sm text-green-700 font-bold">
              ✅ הגעתם למקסימום ({MAX_PHOTOS} תמונות)!
            </div>
          )}

          {/* Photo grid preview */}
          {personalPhotos.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2">
                {personalPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative aspect-square"
                  >
                    <img
                      src={photo}
                      alt={`תמונה אישית ${i + 1}`}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                    />
                    <button
                      onClick={() => removePersonalPhoto(i)}
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 rounded-full p-0.5 shadow transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            onClick={() => navigate('/welcome')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full py-5 text-base font-bold shadow-lg"
          >
            {personalPhotos.length > 0 ? 'מעולה! בואו נתחיל 🚀' : 'דלגו — בואו נתחיל 🚀'}
          </Button>
        </motion.div>

        <p className="text-xs text-foreground/40 mt-6 text-center">
          © כל הזכויות שמורות לשלי לוי
        </p>
      </div>
    </div>
  );
}
