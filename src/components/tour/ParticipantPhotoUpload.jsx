import React, { useRef, useState } from 'react';
import { Camera, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// Store participant photos separately (not in tour context - these are selfies)
let participantPhotosStore = {};

export function getParticipantPhotos() {
  return Object.values(participantPhotosStore).flat();
}

export function getParticipantPhotosByStation(stationId) {
  return participantPhotosStore[stationId] || [];
}

export default function ParticipantPhotoUpload({ stationId, stationName }) {
  const fileRef = useRef(null);
  const [photos, setPhotos] = useState(participantPhotosStore[stationId] || []);
  const [uploading, setUploading] = useState(false);

  const handleCapture = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const updated = [...(participantPhotosStore[stationId] || []), dataUrl];
        participantPhotosStore[stationId] = updated;
        setPhotos([...updated]);
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => setUploading(false), 400);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="user"
        multiple
        onChange={handleCapture}
        className="hidden"
        aria-label="צלם סלפי"
      />

      {/* Show existing participant photos */}
      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-3 gap-1.5 mb-3"
          >
            {photos.map((url, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden border-2 border-rose-300 shadow-sm"
              >
                <img src={url} alt={`סלפי ${i + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="sm"
        variant="outline"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="rounded-full border-rose-300 text-rose-600 hover:bg-rose-50 gap-2 w-full text-sm font-bold"
      >
        <Camera className="w-4 h-4" />
        {uploading ? 'שומר...' : photos.length === 0 ? '📸 סלפי קבוצתי (אופציונלי)' : `📸 עוד סלפי (${photos.length} כבר)`}
      </Button>
    </div>
  );
}
