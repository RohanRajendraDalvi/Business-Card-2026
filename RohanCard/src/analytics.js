import ReactGA from 'react-ga4';

// Get tracking ID from environment variables
const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found. Add VITE_GA_TRACKING_ID to your .env file.');
    return;
  }
  ReactGA.initialize(TRACKING_ID);
};

// Track page views
export const trackPageView = (page) => {
  if (!TRACKING_ID) return;
  ReactGA.send({ 
    hitType: 'pageview', 
    page: page || window.location.pathname 
  });
};

// Generic event tracking
export const trackEvent = (category, action, label, value) => {
  if (!TRACKING_ID) return;
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Custom events for your business card
export const trackCardFlip = () => {
  trackEvent('Card Interaction', 'Flip', 'User flipped the business card');
};

export const trackThemeToggle = (newTheme) => {
  trackEvent('Card Interaction', 'Theme Toggle', `Switched to ${newTheme} mode`);
};

export const trackCardRotate = () => {
  trackEvent('Card Interaction', 'Rotate', 'User rotated the card');
};

export const trackCardZoom = (direction) => {
  trackEvent('Card Interaction', 'Zoom', `User zoomed ${direction}`);
};

export const trackTimeSpent = (seconds) => {
  trackEvent('Engagement', 'Time Spent', 'Seconds on page', seconds);
};

// Track outbound link clicks (if you add clickable links)
export const trackOutboundLink = (url) => {
  trackEvent('Outbound Link', 'Click', url);
};

// Track QR code visibility (when back of card is shown)
export const trackQRVisible = () => {
  trackEvent('Card Interaction', 'QR Visible', 'User viewed QR code side');
};