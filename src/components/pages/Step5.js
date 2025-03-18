// src/components/pages/Step5.js
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Step5.css'; // Import CSS for styling

function Step5({ onNext, onPrevious, onSave }) {
    const [paragraphs, setParagraphs] = useState([]);
    const [outlineSentences, setOutlineSentences] = useState([]);

    // Load data from localStorage on component mount
    useEffect(() => {
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedOutlineSentences = localStorage.getItem('step4OutlineSentences' + essayTitle);
            if (storedOutlineSentences) {
                setOutlineSentences(JSON.parse(storedOutlineSentences));
            }
            // Load previously written paragraphs
            const storedParagraphs = localStorage.getItem('step5Paragraphs' + essayTitle);
            if (storedParagraphs) {
                setParagraphs(JSON.parse(storedParagraphs));
            } else {
                // Initialize paragraphs with empty strings based on outline sentences
                if (storedOutlineSentences) {
                    setParagraphs(Array(JSON.parse(storedOutlineSentences).length).fill(''));
                }
            }
        }
    }, []);

    useEffect(() => {
        // Update paragraphs if outline sentences change, keeping existing paragraph content
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedOutlineSentences = localStorage.getItem('step4OutlineSentences' + essayTitle);
            if (storedOutlineSentences) {
                const parsedOutline = JSON.parse(storedOutlineSentences);
                if (parsedOutline.length !== paragraphs.length) {
                    setParagraphs(prevParagraphs => {
                        const newParagraphs = Array(parsedOutline.length).fill('');
                        // Preserve existing content in matching indices
                        for (let i = 0; i < Math.min(parsedOutline.length, prevParagraphs.length); i++) {
                            newParagraphs[i] = prevParagraphs[i];
                        }
                        return newParagraphs;
                    });
                }
            }
        }
    }, [outlineSentences]);

    const handleParagraphChange = (index, event) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index] = event.target.value;
        setParagraphs(newParagraphs);
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
                localStorage.setItem('step5Paragraphs' + essayTitle, JSON.stringify(paragraphs));
                
                // Update the current step for this specific essay
                localStorage.setItem('currentStep-' + essayTitle, '5');
                
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
        <div className="step5-container">
            <h2>Step 5: Paragraph Drafting</h2>
            <p>Write ten to fifteen sentences per outline heading to complete your paragraphs.</p>

            {outlineSentences.length > 0 ? (
                <ol>
                    {outlineSentences.map((sentence, index) => (
                        <li key={index}>
                            <p><strong>Outline Sentence:</strong> {sentence}</p>
                            <textarea
                                value={paragraphs[index] || ''} // Use empty string if paragraph is undefined
                                onChange={(event) => handleParagraphChange(index, event)}
                                placeholder={`Write your paragraph for outline sentence ${index + 1}`}
                            />
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Please create an outline in Step 4 before drafting your paragraphs.</p>
            )}

            <div className="button-container">
                <Button onClick={onPrevious}>Previous</Button>
                <Button onClick={() => onSave(saveData)}>Save Progress</Button>
                <Button onClick={onNext}>Next</Button>
            </div>
        </div>
    );
}

export default Step5;