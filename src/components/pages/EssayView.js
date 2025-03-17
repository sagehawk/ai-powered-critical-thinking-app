// src/components/pages/EssayView.js
import React from 'react';
import { useParams } from 'react-router-dom';

function EssayView() {
  const { essayTitle } = useParams();

  return (
    <div className="essay-view-container">
      <h2>Essay: {essayTitle}</h2>
      {/* Add content and logic here to load and display the essay */}
      <p>Content of {essayTitle} goes here.</p>
    </div>
  );
}

export default EssayView;