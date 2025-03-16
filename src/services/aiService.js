// src/services/aiService.js
const API_KEY = process.env.REACT_APP_CABLYAI_API_KEY;
const API_BASE_URL = 'https://cablyai.com/v1';
const GPT4O_MINI_MODEL = "gpt-4o-mini"; // Define the model ID

async function getAIResponse(prompt, model = GPT4O_MINI_MODEL) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150, // Adjust as needed
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content; // Extract the AI response
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error; // Re-throw for handling in the component
  }
}


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

export { listAvailableModels, getAIResponse };