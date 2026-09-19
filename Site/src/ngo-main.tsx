import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NgoApp } from './ngo/NgoApp';
import './index.css';

const container = document.getElementById('ngo-root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <NgoApp />
    </StrictMode>
  );
}
