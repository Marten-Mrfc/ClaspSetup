import React from 'react';
import { createRoot } from 'react-dom/client';
import HelloWorld from './components/HelloWorld';
import './styles.css';

// Only run in browser context
function initApp() {
  // Mount the React app
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<HelloWorld />);
  } else {
    console.error('Root element not found');
  }
}

// Check if we're in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}

// Export the init function for manual initialization if needed
if (typeof window !== 'undefined') {
  (window as any).initExampleApp = initApp;
}
