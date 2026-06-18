import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { TourProvider } from '@/lib/tourContext';
import Welcome from '@/pages/Welcome';
import GroupSelect from '@/pages/GroupSelect';
import PersonalPhotos from '@/pages/PersonalPhotos';
import Intro from '@/pages/Intro';
import Station from '@/pages/Station';
import Transition from '@/pages/Transition';
import Finale from '@/pages/Finale';
import StillHungry from '@/pages/StillHungry';
import Admin from '@/pages/Admin';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" dir="rtl">
      <p className="text-4xl">😕</p>
      <p className="text-xl font-bold">דף לא נמצא</p>
      <a href="/" className="text-primary underline">חזרה לדף הבית</a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <TourProvider>
        <Routes>
          <Route path="/" element={<GroupSelect />} />
          <Route path="/personal-photos" element={<PersonalPhotos />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/station/:id" element={<Station />} />
          <Route path="/transition/:id" element={<Transition />} />
          <Route path="/finale" element={<Finale />} />
          <Route path="/still-hungry" element={<StillHungry />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TourProvider>
    </Router>
  );
}

export default App;
