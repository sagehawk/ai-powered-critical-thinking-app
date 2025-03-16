// src/components/pages/Step1.js
import React, { useState } from 'react';
import './Step1.css'; // Import CSS for styling

function Step1() {
  const [goal, setGoal] = useState(''); // State for the user's writing goal

  const handleChange = (event) => {
    setGoal(event.target.value);
  };

  return (
    <div className="step1-container">
      <h2>Step 1: Introduction and Goal Setting</h2>
      <p>
        Welcome to Step 1! In this step, you'll reflect on your writing goals.  Thinking carefully about what you want to achieve is an important step towards better articulation.
      </p>

      <div className="goal-input">
        <label htmlFor="goal">My Writing Goal:</label>
        <textarea
          id="goal"
          value={goal}
          onChange={handleChange}
          placeholder="What do you hope to achieve with your writing?"
        />
      </div>

      {goal && (
        <div className="goal-display">
          <h3>Your Goal:</h3>
          <p>{goal}</p>
        </div>
      )}

      <p>
        (Remember, this is just a starting point. You can always adjust your goal as you progress.)
      </p>
    </div>
  );
}

export default Step1;