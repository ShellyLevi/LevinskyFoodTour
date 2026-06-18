import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const ADMIN_PASSWORD = 'shelly2024';
const SESSIONS_KEY = 'foodtour_all_sessions';

function loadAllSessions() {
  try {
    const ids = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    return ids.map(id => {
      const meta = JSON.parse(localStorage.getItem(`foodtour_meta_${id}`) || 'null');
      const photos = JSON.parse(localStorage.getItem(`foodtour_photos_${id}`) || '{}');
      const allPhotos = Object.values(photos).flat();
      return { id, meta, photos, allPhotos };
    }).filter(s => s.meta);
  } catch { return []; }
}

function downloadPhoto(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

function clearSession(id) {
  localStorage.removeItem(`foodtour_meta_${id}`);
  localStorage.removeItem(`foodtour_photos_${id}`);
  const ids = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]').filter(s => s !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(ids));
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setSessions(loadAllSessions());
    } else {
      setError('סיסמה שגויה');
    }
  };

  const handleClear = (id) => {
    clearSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  if (!authed) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl"
        >
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-xl font-black mb-4">כניסת מנהל</h1>
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-3 text-center text-lg font-bold focus:outline-none focus:border-primary"
          />
          {error && <p className="text-red-500 text-sm mb-3 font-bold">{error}</p>}
          <Button onClick={handleLogin} size="lg" className="w-full rounded-full font-bold">
            כניסה
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-gray-800 mb-2">📊 נתוני סיורים</h1>
        <p className="text-sm text-gray-500 mb-6">
          תמונות נשמרות על המכשיר שבו בוצע הסיור. {sessions.length} סשן/ים נמצאו.
        </p>

        {sessions.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center shadow">
            <p className="text-gray-400 font-bold">אין נתונים שמורים עדיין</p>
          </div>
        )}

        {sessions.map((session, si) => {
          const dateStr = session.meta?.date
            ? new Date(session.meta.date).toLocaleString('he-IL')
            : 'לא ידוע';
          const typeLabel = session.meta?.groupType === 'couple' ? '💑 זוג' : session.meta?.groupType === 'friends' ? '👫 חברים' : '—';

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow mb-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-black text-gray-800">{typeLabel}</p>
                  <p className="text-xs text-gray-400">{dateStr}</p>
                  <p className="text-sm text-gray-600 mt-1">{session.allPhotos.length} תמונות</p>
                </div>
                <button
                  onClick={() => handleClear(session.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-bold underline"
                >
                  מחק סשן
                </button>
              </div>

              {session.allPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {session.allPhotos.map((photo, pi) => (
                    <div key={pi} className="relative aspect-square">
                      <img
                        src={photo}
                        alt={`תמונה ${pi + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        onClick={() => downloadPhoto(photo, `session${si + 1}_photo${pi + 1}.jpg`)}
                        className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-2">אין תמונות בסשן זה</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
