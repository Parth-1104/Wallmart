import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import Home from './pages/Home.tsx';
import App from './App.tsx';
import './index.css';
import Homesecond from './pages/Homesecond.tsx';
import Chatbot from './components/chatbot/chat.tsx';

import React from 'react';

function RootLayout() {
  const location = useLocation();
  const hideChatbot = location.pathname === '/';

  return (
    <>
      {!hideChatbot && (
        <div className="fixed bottom-4 right-4 z-50">
          <Chatbot />
        </div>
      )}

      <Routes>
        <Route path="/home" element={<App />} />
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Homesecond />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout />
    </BrowserRouter>
  </StrictMode>
);
