import React, { useRef, useState } from 'react';
import { useTour } from '@/lib/tourContext';

export default function PhotoCapture({ stationId, onPhotoAdded, photoCount }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { addPhoto } = useTour();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        addPhoto(stationId, ev.target.result);
        if (onPhotoAdded) onPhotoAdded(ev.target.result);
      };
      reader.readAsDataURL(file);
    });
    setTimeout(() => setUploading(false), 500);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFiles} className="hidden" />
      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />

      <div className="flex gap-3 w-full">
        <button
          onClick={() => cameraRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 font-bold text-base rounded-2xl py-4 shadow-md border border-gray-200 active:scale-95 transition-transform disabled:opacity-50"
        >
          📷 צלם
        </button>

        <button
          onClick={() => galleryRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 font-bold text-base rounded-2xl py-4 shadow-md border border-gray-200 active:scale-95 transition-transform disabled:opacity-50"
        >
          🖼️ גלריה
        </button>
      </div>

      {photoCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {photoCount} תמונות — אפשר להוסיף עוד ✨
        </p>
      )}
    </div>
  );
}
