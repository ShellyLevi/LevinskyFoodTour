import React, { createContext, useContext, useState } from 'react';

const TourContext = createContext(null);

export function TourProvider({ children }) {
  const [photos, setPhotos] = useState({});

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
  const hasPhotos = (stationId) => (photos[stationId] || []).length > 0;
  const getTotalCount = () => Object.values(photos).flat().length;

  return (
    <TourContext.Provider value={{ photos, addPhoto, removePhoto, getPhotos, getAllPhotos, hasPhotos, getTotalCount }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}
