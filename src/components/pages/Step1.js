// src/components/pages/Step1.jscam
import React, { useState, useEffect } from 'react';
import { listAvailableModels } from '../../services/aiService';

function Step1() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const data = await listAvailableModels();
        setModels(data.data); // Assuming the API returns models in a 'data' array
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  if (loading) {
    return <p>Loading models...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Step 1: Introduction and Goal Setting</h2>
      <p>Here, you'll reflect on your writing goals and learn about the essay writing process.</p>
      <h3>Available Models:</h3>
      <ul>
        {models.map((model) => (
          <li key={model.id}>{model.id}</li>
        ))}
      </ul>
      {/* Add input fields for goals and reflection later */}
    </div>
  );
}

export default Step1;