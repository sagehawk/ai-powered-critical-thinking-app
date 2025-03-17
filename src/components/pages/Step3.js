// src/components/pages/Step3.js
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Step3.css'; // Import CSS for styling

function Step3({ onNext, onPrevious, onSave }) {
    const [topicQuestions, setTopicQuestions] = useState(Array(10).fill(''));
    const [readings, setReadings] = useState(Array(5).fill({ title: '', notes: '' }));

    // Load data from localStorage on component mount
    useEffect(() => {
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedTopicQuestions = localStorage.getItem('step3TopicQuestions' + essayTitle);
            const storedReadings = localStorage.getItem('step3Readings' + essayTitle);

            if (storedTopicQuestions) {
                setTopicQuestions(JSON.parse(storedTopicQuestions));
            }
            if (storedReadings) {
                setReadings(JSON.parse(storedReadings));
            }
        }
    }, []);

    const handleTopicChange = (index, event) => {
        const newTopicQuestions = [...topicQuestions];
        newTopicQuestions[index] = event.target.value;
        setTopicQuestions(newTopicQuestions);
    };

    const handleReadingTitleChange = (index, event) => {
        const newReadings = [...readings];
        newReadings[index] = { ...newReadings[index], title: event.target.value };
        setReadings(newReadings);
    };

    const handleReadingNotesChange = (index, event) => {
        const newReadings = [...readings];
        newReadings[index] = { ...newReadings[index], notes: event.target.value };
        setReadings(newReadings);
    };

    const saveData = () => {
        return new Promise((resolve, reject) => {
            try {
                // Get the current essay title
                const essayTitle = localStorage.getItem('essayTitle');
                
                if (!essayTitle) {
                    reject(new Error("No essay title found"));
                    return;
                }
                
                // Save step-specific data
                localStorage.setItem('step3TopicQuestions' + essayTitle, JSON.stringify(topicQuestions));
                localStorage.setItem('step3Readings' + essayTitle, JSON.stringify(readings));
                
                // Update the current step for this specific essay
                localStorage.setItem('currentStep-' + essayTitle, '3');
                
                // Make sure the essay is registered in the system
                localStorage.setItem('essay-' + essayTitle, essayTitle);
                
                resolve();
            } catch (error) {
                console.error("Error saving data:", error);
                reject(error);
            }
        });
    };

    return (
        <div className="step3-container">
            <h2>Step 3: Topic and Reading List</h2>
            <p>Brainstorm topic questions and create a reading list. Remember to take active notes in your own words.</p>

            <div className="topic-questions">
                <h3>Topic Questions:</h3>
                <ol>
                    {topicQuestions.map((question, index) => (
                        <li key={index}>
                            <textarea
                                value={question}
                                onChange={(event) => handleTopicChange(index, event)}
                                placeholder={`Topic Question ${index + 1}`}
                            />
                        </li>
                    ))}
                </ol>
            </div>

            <div className="reading-list">
                <h3>Reading List:</h3>
                {readings.map((reading, index) => (
                    <div key={index} className="reading-item">
                        <label htmlFor={`reading-title-${index}`}>Reading {index + 1}:</label>
                        <input
                            type="text"
                            id={`reading-title-${index}`}
                            value={reading.title}
                            onChange={(event) => handleReadingTitleChange(index, event)}
                            placeholder="Title"
                        />
                        <label htmlFor={`reading-notes-${index}`}>Notes:</label>
                        <textarea
                            id={`reading-notes-${index}`}
                            value={reading.notes}
                            onChange={(event) => handleReadingNotesChange(index, event)}
                            placeholder="Your notes on this reading"
                        />
                    </div>
                ))}
            </div>

            <p>Start with whichever feels more natural to you: topics or readings.</p>
            <p>Don't copy verbatim! Rephrase in your own words.</p>

            <div className="button-container">
                <Button onClick={onPrevious}>Previous</Button>
                <Button onClick={() => onSave(saveData)}>Save Progress</Button>
                <Button onClick={onNext}>Next</Button>
            </div>
        </div>
    );
}

export default Step3;