import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PhotoCapture from '@/components/tour/PhotoCapture';
import PhotoGrid from '@/components/tour/PhotoGrid';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { missionConfig } from '@/lib/tourConfig';
import { useTour } from '@/lib/tourContext';

function isYouTubeUrl(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&playsinline=1`;
  return url;
}

export default function MissionScreen({ mission, stationId, isLast, onComplete }) {
  const [subPhase, setSubPhase] = useState(mission.isFirstMission ? 'envelope' : 'task');
  const [showPhotoWarning, setShowPhotoWarning] = useState(false);
  const audioRef = useRef(null);
  const missionKey = `mission_${stationId}`;
  const { getPhotos, removePhoto } = useTour();
  const missionPhotos = getPhotos(missionKey);

  const handleEnvelopeClick = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
    setSubPhase('intro');
  };

  const handleVideoConfirm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSubPhase('task');
  };

  const handleComplete = () => {
    if (mission.requiresPhoto && missionPhotos.length === 0) {
      setShowPhotoWarning(true);
      return;
    }
    onComplete();
  };

  const hasVideo = Boolean(missionConfig.proposalVideoUrl);

  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-300 via-purple-200 to-pink-200">
      <FoodEmojiBg />

      {/* מוזיקה של המירוץ למיליון */}
      {mission.isFirstMission && missionConfig.musicPath && (
        <audio ref={audioRef} src={missionConfig.musicPath} loop preload="auto" />
      )}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 safe-top">
        <AnimatePresence mode="wait">

          {/* ─── שלב 1: מעטפה ─── */}
          {subPhase === 'envelope' && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center max-w-xs w-full"
            >
              <motion.p
                className="text-xl font-black text-white drop-shadow-lg mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                רגע לפני שממשיכים... 👀
              </motion.p>

              {/* Amazing Race style envelope */}
              <motion.button
                onClick={handleEnvelopeClick}
                whileTap={{ scale: 0.93 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full cursor-pointer bg-transparent border-none p-0 block"
                aria-label="פתחו את המעטפה"
              >
                {/* Envelope body */}
                <div className="relative w-full rounded-lg overflow-hidden shadow-2xl border-4 border-black">
                  {/* Top flap (triangle) */}
                  <div className="bg-yellow-400 w-full" style={{ height: '60px', position: 'relative' }}>
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '175px solid transparent',
                        borderRight: '175px solid transparent',
                        borderTop: '60px solid #facc15',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
                      }}
                    />
                  </div>

                  {/* Main body */}
                  <div className="bg-yellow-400 px-4 pb-4 pt-2">
                    {/* Show title band */}
                    <div className="bg-black text-yellow-400 font-black text-center py-2 px-3 mb-3 tracking-widest text-base rounded">
                      המירוץ למיליון
                    </div>

                    {/* Press here button */}
                    <div className="bg-yellow-300 border-4 border-black rounded-lg py-3 px-4 mb-3 shadow-inner">
                      <p className="font-black text-black text-xl tracking-wide">PRESS HERE</p>
                    </div>

                    {/* Bottom yellow band */}
                    <div className="bg-yellow-500 text-black font-bold text-center py-1 text-sm rounded tracking-wider">
                      ✉ הודעה מיוחדת ✉
                    </div>
                  </div>
                </div>
              </motion.button>

              <motion.p
                className="text-base font-bold text-white/90 drop-shadow mt-6"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                לחצו על המעטפה ותפעילו סאונד 🔊
              </motion.p>
            </motion.div>
          )}

          {/* ─── שלב 2: אינטרו + סרטון ─── */}
          {subPhase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/50"
            >
              <div className="text-center mb-4">
                <span className="text-4xl">🏆</span>
                <h2 className="text-xl font-black mt-2 mb-1 text-foreground leading-snug">
                  לפני שנמשיך לתחנה הבאה...
                </h2>
                <p className="text-lg font-bold text-primary">
                  חשבתם שרק תאכלו כאן?? 😈
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 mb-4 border border-amber-200/50 text-center">
                <p className="font-bold text-foreground mb-1 leading-snug">
                  לפני כל תחנה תקבלו משימה שיהיה עליכם{' '}
                  <span className="text-primary">חובה</span> לבצע!
                </p>
                <p className="text-primary font-black text-lg mt-2">
                  מוכנים למשימה הראשונה? 🔥
                </p>
              </div>

              {hasVideo && isYouTubeUrl(missionConfig.proposalVideoUrl) && (
                <div className="bg-purple-50 rounded-2xl p-4 mb-4 border border-purple-200/50 text-center">
                  <iframe
                    src={getYouTubeEmbedUrl(missionConfig.proposalVideoUrl)}
                    className="w-full rounded-xl"
                    style={{ aspectRatio: '16/9' }}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title="סרטון הצעה"
                  />
                </div>
              )}

              <Button
                size="lg"
                onClick={handleVideoConfirm}
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black rounded-xl w-full py-5 text-lg font-black shadow-lg active:scale-95 transition-transform"
              >
                חחח יאלה! אנחנו איתך 🎉
              </Button>
            </motion.div>
          )}

          {/* ─── שלב 3: משימה ─── */}
          {subPhase === 'task' && (
            <motion.div
              key="task"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/50 text-center"
            >
              <motion.div
                className="text-5xl mb-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎯
              </motion.div>

              <h2 className="text-2xl font-black text-foreground mb-3">
                {mission.title}
              </h2>

              <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-4 mb-4 border border-violet-200/50 text-right">
                <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
                  {mission.description}
                </p>
              </div>

              {mission.requiresPhoto && (
                <div className="mb-4">
                  <p className="text-sm font-bold text-muted-foreground mb-2">
                    {mission.photoPrompt}
                  </p>
                  <PhotoCapture
                    stationId={missionKey}
                    onPhotoAdded={() => setShowPhotoWarning(false)}
                    photoCount={missionPhotos.length}
                  />
                  {missionPhotos.length > 0 && (
                    <div className="mt-3">
                      <PhotoGrid
                        photos={missionPhotos}
                        onDelete={(i) => removePhoto(missionKey, i)}
                      />
                    </div>
                  )}
                </div>
              )}

              {showPhotoWarning && (
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-destructive font-bold text-sm mb-3"
                >
                  ⚠️ חובה להעלות תמונה לפני שממשיכים! 📷
                </motion.p>
              )}

              <Button
                size="lg"
                onClick={handleComplete}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full py-5 text-base font-bold shadow-lg"
              >
                {isLast ? 'יאללה לסיום! 🎊' : 'יאללה לתחנה הבאה! ➡️'}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
