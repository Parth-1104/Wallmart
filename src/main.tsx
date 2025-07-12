import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home.tsx';

import App from './App.tsx';
import './index.css';
import Homesecond from './pages/Homesecond.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<App />} />
        <Route path="/" element={<Home/>} />
        <Route path="/map" element={<Homesecond/>} />



      </Routes>
    </BrowserRouter>
  </StrictMode>
);
