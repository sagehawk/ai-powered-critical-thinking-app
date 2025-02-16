// src/services/aiService.js
const API_KEY = process.env.REACT_APP_CABLYAI_API_KEY;
const API_BASE_URL = 'https://cablyai.com/v1';

async function listAvailableModels() {
  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing models:', error);
    throw error; // Re-throw the error to be handled elsewhere
  }
}

export { listAvailableModels };