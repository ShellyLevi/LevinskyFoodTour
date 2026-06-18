import React, { createContext, useContext, useState, useEffect } from 'react';

const TourContext = createContext(null);

// Session ID — unique per browser tab, persists across refreshes within the tab
const SESSION_ID = (() => {
  let id = sessionStorage.getItem('tourSessionId');
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    sessionStorage.setItem('tourSessionId', id);
  }
  return id;
})();

const PHOTOS_KEY = `foodtour_photos_${SESSION_ID}`;
const META_KEY = `foodtour_meta_${SESSION_ID}`;
const SESSIONS_KEY = 'foodtour_all_sessions';

function saveSessionMeta(groupType) {
  try {
    const meta = { id: SESSION_ID, date: new Date().toISOString(), groupType };
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    const raw = localStorage.getItem(SESSIONS_KEY);
    const sessions = raw ? JSON.parse(raw) : [];
    if (!sessions.includes(SESSION_ID)) {
      sessions.push(SESSION_ID);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  } catch {}
}

function loadPhotos() {
  try {
    const raw = localStorage.getItem(PHOTOS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function persistPhotos(photos) {
  try {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  } catch {}
}

export function TourProvider({ children }) {
  const [photos, setPhotos] = useState(() => loadPhotos());
  const [collageUrl, setCollageUrl] = useState(null);
  const [groupType, setGroupTypeState] = useState(null); // 'couple' | 'friends'
  const [personalPhotos, setPersonalPhotos] = useState([]); // user-uploaded personal photos

  // Persist photos to localStorage whenever they change
  useEffect(() => {
    persistPhotos(photos);
  }, [photos]);

  const setGroupType = (type) => {
    setGroupTypeState(type);
    saveSessionMeta(type);
  };

  const addPhoto = (stationId, photoUrl) => {
    setPhotos(prev => ({
      ...prev,
      [stationId]: [...(prev[stationId] || []), photoUrl]
    }));
  };

  const removePhoto = (stationId, index) => {
    setPhotos(prev => ({
      ...prev,
      [stationId]: (prev[stationId] || []).filter((_, i) => i !== index)
    }));
  };

  const getPhotos = (stationId) => photos[stationId] || [];
  const getAllPhotos = () => Object.values(photos).flat();
  // Station photos only (keys that are numbers, not "mission_X" strings)
  const getStationPhotos = () =>
    Object.entries(photos)
      .filter(([key]) => !String(key).startsWith('mission_'))
      .flatMap(([, arr]) => arr);
  const hasPhotos = (stationId) => (photos[stationId] || []).length > 0;
  const getTotalCount = () => Object.values(photos).flat().length;

  const addPersonalPhoto = (photoUrl) => {
    setPersonalPhotos(prev => [...prev, photoUrl]);
  };

  const removePersonalPhoto = (index) => {
    setPersonalPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <TourContext.Provider value={{
      photos, addPhoto, removePhoto, getPhotos, getAllPhotos, getStationPhotos, hasPhotos, getTotalCount,
      collageUrl, setCollageUrl,
      groupType, setGroupType,
      personalPhotos, addPersonalPhoto, removePersonalPhoto,
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}
