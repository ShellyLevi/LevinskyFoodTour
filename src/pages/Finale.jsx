import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, Download, Image } from 'lucide-react';
import { useTour } from '@/lib/tourContext';
import FoodEmojiBg from '@/components/tour/FoodEmojiBg';
import { tourConfig, groupPhotos } from '@/lib/tourConfig';

function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Finale() {
  const { getAllPhotos, getStationPhotos, collageUrl, setCollageUrl } = useTour();
  const allPhotos = getAllPhotos();       // for individual download (includes missions)
  const stationPhotos = getStationPhotos(); // for collage only

  const canvasRef = useRef(null);
  const [collageState, setCollageState] = useState(collageUrl ? 'done' : 'idle'); // idle | generating | done
  const [error, setError] = useState(null);

  const generateCollage = async () => {
    if (stationPhotos.length === 0) {
      setError('אין תמונות מהתחנות לקולאז׳ — צלמו קודם!');
      return;
    }
    setCollageState('generating');
    setError(null);

    try {
      const photos = stationPhotos;
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

  const downloadPhoto = (photoUrl, index) => {
    const link = document.createElement('a');
    link.download = `food-tour-photo-${index + 1}.jpg`;
    link.href = photoUrl;
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
            {stationPhotos.length} תמונות מהתחנות 📸
            {allPhotos.length > stationPhotos.length && (
              <span className="text-xs text-foreground/50"> + {allPhotos.length - stationPhotos.length} ממשימות</span>
            )}
          </p>

          {error && (
            <p className="text-destructive text-sm font-bold mb-3">{error}</p>
          )}

          {/* כפתור ראשוני — צור קולאז' */}
          {collageState === 'idle' && (
            <Button
              size="lg"
              onClick={generateCollage}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full w-full py-5 text-base font-bold shadow-lg gap-2 mt-3"
            >
              <Image className="w-5 h-5" />
              צור קולאז׳ למזכרת 🖼️
            </Button>
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

        {/* תמונות בנפרד */}
        {allPhotos.length > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center border border-white/50"
          >
            <h2 className="text-lg font-black text-foreground mb-3">הורד תמונות בנפרד 📸</h2>
            <div className="grid grid-cols-3 gap-2">
              {allPhotos.map((photo, i) => (
                <div key={i} className="relative">
                  <img
                    src={photo}
                    alt={`תמונה ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl border-2 border-white shadow"
                  />
                  <button
                    onClick={() => downloadPhoto(photo, i)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors"
                    title={`הורד תמונה ${i + 1}`}
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* כרטיס פידבק */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center border border-white/50"
        >
          <div className="text-3xl mb-2">🥰</div>
          <h2 className="text-lg font-black text-foreground mb-1">נהנתם מהסיור??</h2>
          <p className="text-base font-bold text-foreground/80 mb-1">רוצים לפרגן לי?</p>
          <p className="text-sm text-foreground/60 mb-4">מוזמנים לכתוב לי איך היה כאן בוואטסאפ 💬</p>
          <a
            href="https://wa.me/972543101179?text=%D7%A9%D7%9C%D7%99%D7%99%D7%99%D7%99"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-full py-5 text-base font-bold shadow-lg gap-2"
            >
              <WhatsAppIcon className="w-5 h-5" />
              כתבו לי בוואטסאפ
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
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

        <p className="text-xs text-foreground/40 mt-2 text-center">
          © כל הזכויות שמורות לשלי לוי
        </p>
      </div>
    </div>
  );
}
