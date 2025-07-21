import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Disable all Sentry functionality
if (typeof window !== 'undefined') {
  window.__SENTRY__ = undefined;
  window.Sentry = undefined;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);