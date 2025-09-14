import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Create the root container
const container = document.getElementById('root');
const root = createRoot(container);

// Render the App component
root.render(<App />);
