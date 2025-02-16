// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import Step1 from './components/pages/Step1';
import Step2 from './components/pages/Step2';
import Step3 from './components/pages/Step3';
import Step4 from './components/pages/Step4';
import Step5 from './components/pages/Step5';
import Step6 from './components/pages/Step6';
import Step7 from './components/pages/Step7';
import Step8 from './components/pages/Step8';
import Button from './components/common/Button';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Articulate & Refine</h1>

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/step1">Step 1: Introduction</Link>
            </li>
            <li>
              <Link to="/step2">Step 2: Levels of Resolution</Link>
            </li>
            <li>
              <Link to="/step3">Step 3: Topic and Reading List</Link>
            </li>
            <li>
              <Link to="/step4">Step 4: Outline Creation</Link>
            </li>
            <li>
              <Link to="/step5">Step 5: Paragraphs</Link>
            </li>
            <li>
              <Link to="/step6">Step 6: Sentence Editing</Link>
            </li>
            <li>
              <Link to="/step7">Step 7: Paragraph Reordering</Link>
            </li>
            <li>
              <Link to="/step8">Step 8: New Outline Generation</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/step1" element={<Step1 />} />
          <Route path="/step2" element={<Step2 />} />
          <Route path="/step3" element={<Step3 />} />
          <Route path="/step4" element={<Step4 />} />
          <Route path="/step5" element={<Step5 />} />
          <Route path="/step6" element={<Step6 />} />
          <Route path="/step7" element={<Step7 />} />
          <Route path="/step8" element={<Step8 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;