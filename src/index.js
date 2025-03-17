import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // <-- Add this import
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Wrap App with Router */}
      <App />
    </Router>
  </React.StrictMode>
);

// Keep the web vitals reporting unchanged
reportWebVitals();