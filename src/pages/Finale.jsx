import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, Download, Image } from 'lucide-react';
import { useTour } from '@/lib/tourContext';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { tourConfig, groupPhotos } from '@/lib/tourConfig';

export default function Finale() {
  const { getAllPhotos } = useTour();
  const allPhotos = getAllPhotos();

  const canvasRef = useRef(null);
  const [collageState, setCollageState] = useState('idle'); // idle | joke | generating | done
  const [collageUrl, setCollageUrl] = useState(null);
  const [error, setError] = useState(null);

  const generateCollage = async () => {
    if (allPhotos.length === 0) {
      setError('אין תמונות לקולאז׳ — צלמו קודם!');
      return;
    }
    setCollageState('generating');
    setError(null);

    try {
      const photos = allPhotos;
      const TILE = 280;
      const GAP = 12;
      const HEADER = 70;
      const FOOTER = 50;

      // בחירת עמודות חכמה — ללא חלקים ריקים:
      // 1→1, 2→2, 3→3, 4→2×2, 5→3+2, 6→3×2, 7→3+3+1, וכו'
      const cols = photos.length === 1 ? 1
                 : photos.length === 2 ? 2
                 : photos.length === 4 ? 2
                 : 3;
      const rows = Math.ceil(photos.length / cols);

      // כמה תמונות בשורה האחרונה
      const lastRowCount = photos.length % cols === 0 ? cols : photos.length % cols;

      const W = cols * TILE + (cols + 1) * GAP;
      const H = rows * TILE + (rows + 1) * GAP + HEADER + FOOTER;

      const canvas = canvasRef.current;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#fce7f3');
      grad.addColorStop(0.5, '#fef3c7');
      grad.addColorStop(1, '#fed7aa');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${tourConfig.tourName} 🍽️`, W / 2, HEADER / 2);

      for (let i = 0; i < photos.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const isLastRow = row === rows - 1;
        // מרכז את השורה האחרונה אם לא מלאה
        const rowOffsetX = isLastRow ? (cols - lastRowCount) * (TILE + GAP) / 2 : 0;
        const x = GAP + rowOffsetX + col * (TILE + GAP);
        const y = HEADER + GAP + row * (TILE + GAP);

        await new Promise((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, TILE, TILE, 14);
            ctx.clip();
            const scale = Math.max(TILE / img.width, TILE / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = x + (TILE - dw) / 2;
            const dy = y + (TILE - dh) / 2;
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x, y, TILE, TILE, 14);
            ctx.stroke();
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          if (!photos[i].startsWith('data:')) img.crossOrigin = 'anonymous';
          img.src = photos[i];
        });
      }

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`© כל הזכויות שמורות לשלי לוי`, W / 2, H - FOOTER / 2);

      const url = canvas.toDataURL('image/jpeg', 0.93);
      setCollageUrl(url);
      setCollageState('done');
    } catch (err) {
      console.error(err);
      setError('אופס, משהו השתבש. נסו שוב.');
      setCollageState('idle');
    }
  };

  const downloadCollage = () => {
    if (!collageUrl) return;
    const link = document.createElement('a');
    link.download = 'food-tour-collage.jpg';
    link.href = collageUrl;
    link.click();
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `סיימנו סיור אוכל מטורף! 🍕🌮🍔🍪 ${tourConfig.endingTitle} — ${tourConfig.creatorName}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-amber-100">
      <FoodEmojiBg />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-10 gap-4 safe-top">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-6xl"
        >
          🎉🥂🎉
        </motion.div>

        {/* כרטיס חגיגה */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center border border-white/50"
        >
          <h1 className="text-2xl font-black text-foreground mb-3 leading-relaxed">
            {tourConfig.endingTitle}
          </h1>
          <h2 className="text-xl font-bold text-primary mb-2">
            {tourConfig.endingSubtitle}
          </h2>
          <p className="text-lg text-foreground/80 font-medium mb-4">
            {tourConfig.endingMessage}
          </p>

          {groupPhotos.length > 0 && (
            <div className="mb-4">
              <p className="font-bold text-foreground mb-2 text-sm">💕 אנחנו ביחד:</p>
              <div className="grid grid-cols-2 gap-2">
                {groupPhotos.map((url, i) => (
                  <motion.div key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-center text-3xl mb-2">
            {['🍕', '🥨', '🌮', '🍔', '🍪', '🍣', '🧆'].map((e, i) => (
              <motion.span key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* קולאז' */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center border border-white/50"
        >
          <div className="text-4xl mb-3">🏆🎊🏆</div>
          <h2 className="text-xl font-black text-foreground mb-2">סיימתם את כל התחנות!</h2>
          <p className="text-sm text-foreground/70 mb-1">
            יש לכם {allPhotos.length} תמונות מהסיור 📸
          </p>

          {error && (
            <p className="text-destructive text-sm font-bold mb-3">{error}</p>
          )}

          {/* כפתור ראשוני — צור קולאז' */}
          {collageState === 'idle' && (
            <Button
              size="lg"
              onClick={() => setCollageState('joke')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full w-full py-5 text-base font-bold shadow-lg gap-2 mt-3"
            >
              <Image className="w-5 h-5" />
              צור קולאז׳ למזכרת 🖼️
            </Button>
          )}

          {/* ה-Easter Egg 😂 */}
          {collageState === 'joke' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 space-y-3"
            >
              <img
                src="/images/marriage jpg.png"
                alt="הפתעה"
                className="w-full rounded-2xl shadow-lg border-2 border-white"
              />
              <Button
                size="lg"
                onClick={generateCollage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full py-4 text-sm font-bold shadow-lg"
              >
                אופס... זה לא הקולאז׳ הנכון 😅
                <br />
                לחץ כאן ליצירת קולאז׳ אמיתי!
              </Button>
            </motion.div>
          )}

          {/* יוצר קולאז' */}
          {collageState === 'generating' && (
            <p className="text-primary font-bold mt-4 animate-pulse">יוצר קולאז׳... ✨</p>
          )}

          {/* קולאז' מוכן */}
          {collageState === 'done' && collageUrl && (
            <div className="space-y-3 mt-3">
              <img src={collageUrl} alt="קולאז' הסיור" className="w-full rounded-2xl shadow-lg border-2 border-white" />
              <Button
                size="lg"
                onClick={downloadCollage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full py-5 text-base font-bold shadow-lg gap-2"
              >
                <Download className="w-5 h-5" />
                הורד קולאז׳ 📥
              </Button>
              <Button
                size="lg"
                onClick={shareOnWhatsApp}
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-full py-5 text-base font-bold shadow-lg gap-2"
              >
                <Share2 className="w-5 h-5" />
                שתף בוואטסאפ 💬
              </Button>
            </div>
          )}
        </motion.div>

        {collageState === 'done' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-sm w-full"
          >
            <Link to="/still-hungry">
              <Button
                size="lg"
                className="bg-white/85 hover:bg-white text-foreground border border-white/50 rounded-full w-full py-5 text-base font-bold shadow-lg"
              >
                עוד קצת רעבים? 🍽️
              </Button>
            </Link>
          </motion.div>
        )}

        <p className="text-xs text-foreground/40 mt-2 text-center">
          © כל הזכויות שמורות לשלי לוי
        </p>
      </div>
    </div>
  );
}
