import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { stations, missions } from '@/lib/tourConfig';
import { useTour } from '@/lib/tourContext';
import PhotoCapture from '@/components/tour/PhotoCapture';
import PhotoGrid from '@/components/tour/PhotoGrid';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import MissionScreen from '@/components/tour/MissionScreen';

export default function Station() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stationIndex = parseInt(id) - 1;
  const station = stations[stationIndex];
  const { getPhotos, removePhoto } = useTour();

  const [phase, setPhase] = useState('arrive');
  const [showNoPhotoWarning, setShowNoPhotoWarning] = useState(false);
  const [imgSrc, setImgSrc] = useState(station?.image);

  if (!station) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <p className="text-2xl mb-4">תחנה לא נמצאה 😕</p>
        <Link to="/"><Button>חזרה להתחלה</Button></Link>
      </div>
    </div>
  );

  const isLast = stationIndex === stations.length - 1;
  const nextPath = isLast ? '/finale' : `/transition/${stationIndex + 2}`;
  const stationMission = missions?.find(m => m.stationId === station.id);
  const stationPhotos = getPhotos(station.id);

  const handleNextStation = () => {
    if (stationPhotos.length === 0) {
      setShowNoPhotoWarning(true);
      return;
    }
    if (stationMission) {
      setPhase('mission');
    } else {
      navigate(nextPath);
    }
  };

  if (phase === 'mission' && stationMission) {
    return (
      <MissionScreen
        mission={stationMission}
        stationId={station.id}
        isLast={isLast}
        onComplete={() => navigate(nextPath)}
      />
    );
  }

  const gradients = [
    'from-rose-200 via-pink-100 to-amber-100',
    'from-amber-200 via-yellow-100 to-lime-100',
    'from-sky-200 via-blue-100 to-indigo-100',
    'from-emerald-200 via-teal-100 to-cyan-100',
    'from-orange-200 via-amber-100 to-yellow-100',
    'from-purple-200 via-pink-100 to-rose-100',
  ];
  const gradient = gradients[stationIndex % gradients.length];

  return (
    <div dir="rtl" className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      <FoodEmojiBg />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8 safe-top">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/90 rounded-full px-4 py-1.5 shadow-lg mb-4 text-sm font-bold text-foreground"
        >
          תחנה {station.id} מתוך {stations.length} {station.emoji}
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl max-w-sm w-full border border-white/50 overflow-hidden"
        >
          <div className="relative">
            <img
              src={imgSrc}
              alt={station.name}
              className="w-full aspect-square object-cover"
              loading="lazy"
              onError={() => {
                if (station.imageFallback && imgSrc !== station.imageFallback) {
                  setImgSrc(station.imageFallback);
                }
              }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent h-20" />
            <div className="absolute bottom-3 right-4 text-white">
              <span className="text-3xl">{station.emoji}</span>
            </div>
          </div>

          <div className="p-5">
            <h1 className="text-2xl font-black text-foreground mb-1">{station.name}</h1>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${station.mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary font-medium text-sm mb-2 hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {station.address}
              <Navigation className="w-3 h-3" />
            </a>

            <div className="bg-muted/50 rounded-xl px-3 py-2 mb-4 text-sm text-muted-foreground font-medium">
              {station.steps}
            </div>

            <AnimatePresence mode="wait">
              {phase === 'arrive' && (
                <motion.div key="arrive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <Button
                    size="lg"
                    onClick={() => setPhase('info')}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-full py-6 text-lg font-bold shadow-lg"
                  >
                    הגענו! 🎯
                  </Button>
                </motion.div>
              )}

              {phase === 'info' && (
                <motion.div key="info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 mb-3 text-sm leading-relaxed text-foreground/90 border border-amber-200/50">
                    <p>{station.description}</p>
                  </div>

                  {station.recommendation && (
                    <div className="bg-green-50 rounded-xl px-3 py-2 mb-3 text-sm text-green-800 border border-green-200 whitespace-pre-line">
                      <span className="font-black">🍽️ המלצה: </span>
                      {station.recommendation}
                    </div>
                  )}

                  {station.funFact && (
                    <div className="bg-blue-50 rounded-xl px-3 py-2 mb-4 text-xs text-blue-700 border border-blue-200">
                      {station.funFact}
                    </div>
                  )}

                  <Button
                    size="lg"
                    onClick={() => setPhase('photo')}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full w-full py-6 text-lg font-bold shadow-lg"
                  >
                    קדימה אוכל! 🍽️
                  </Button>
                </motion.div>
              )}

              {phase === 'photo' && (
                <motion.div key="photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                  <div className="bg-gradient-to-r from-sky-100 to-indigo-100 rounded-2xl p-5 mb-4 border border-sky-200/50">
                    <p className="text-xl font-bold text-foreground mb-1">📸 לא לשכוח לתעד! 📸</p>
                    <p className="text-sm text-foreground/70 mb-4">צלמו כמה שתרצו! 🤳</p>
                    <PhotoCapture
                      stationId={station.id}
                      onPhotoAdded={() => setShowNoPhotoWarning(false)}
                      photoCount={stationPhotos.length}
                    />
                  </div>

                  <PhotoGrid
                    photos={stationPhotos}
                    onDelete={(i) => removePhoto(station.id, i)}
                  />

                  {showNoPhotoWarning && (
                    <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-destructive font-bold mt-3 text-sm">
                      ⚠️ חייבים לצלם לפחות תמונה אחת! 📷
                    </motion.p>
                  )}

                  <Button
                    size="lg"
                    onClick={handleNextStation}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full py-6 text-lg font-bold shadow-lg mt-4"
                  >
                    {isLast ? 'בייי בייי סיימנו! 🎊' : 'למקום הבא! ➡️'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
