import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// src/main.jsx
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // 引入 Bootstrap JS
import './assets/all.sass';
import React from 'react';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
