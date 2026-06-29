
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// 2026-05-20: capture UTM params on every initial page load. Snapshot
// persists 90d in localStorage so a slow funnel (TikTok view Tue →
// signup Sat) still attributes correctly. See `lib/utmTracking.js`.
import { captureUtms } from '@/lib/utmTracking';
// 2026-06-29: boot observability (Sentry always; GA4 only when consented).
// Both no-op cleanly if the corresponding env var is missing.
import { initObservability } from '@/lib/observability';

initObservability();
captureUtms();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
