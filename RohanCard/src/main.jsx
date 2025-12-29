import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import BusinessCard from './BusinessCard.jsx'
import { initGA, trackPageView } from './analytics'

// Initialize Google Analytics
initGA();
trackPageView();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BusinessCard />
    <Analytics />
  </StrictMode>,
)