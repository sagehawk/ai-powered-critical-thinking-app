// src/components/pages/Step4.js
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Step4.css'; // Import CSS for styling

function Step4({ onNext, onPrevious, onSave }) {
    const [outlineSentences, setOutlineSentences] = useState(Array(10).fill(''));

    // Load data from localStorage on component mount
    useEffect(() => {
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedOutlineSentences = localStorage.getItem('step4OutlineSentences' + essayTitle);
            if (storedOutlineSentences) {
                setOutlineSentences(JSON.parse(storedOutlineSentences));
            }
        }
    }, []);

    const handleOutlineChange = (index, event) => {
        const newOutlineSentences = [...outlineSentences];
        newOutlineSentences[index] = event.target.value;
        setOutlineSentences(newOutlineSentences);
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
                localStorage.setItem('step4OutlineSentences' + essayTitle, JSON.stringify(outlineSentences));
                
                // Update the current step for this specific essay
                localStorage.setItem('currentStep-' + essayTitle, '4');
                
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
        <div className="step4-container">
            <h2>Step 4: Outline Creation</h2>
            <p>Create a 10-15 sentence outline. This is the skeleton of your essay, providing its fundamental form and structure.</p>

            <div className="outline-sentences">
                <ol>
                    {outlineSentences.map((sentence, index) => (
                        <li key={index}>
                            <textarea
                                value={sentence}
                                onChange={(event) => handleOutlineChange(index, event)}
                                placeholder={`Outline Sentence ${index + 1}`}
                            />
                        </li>
                    ))}
                </ol>
            </div>

            <p>Each sentence in the outline should represent a paragraph in your essay. The outline is essentially your argument.</p>

            <div className="button-container">
                <Button onClick={onPrevious}>Previous</Button>
                <Button onClick={() => onSave(saveData)}>Save Progress</Button>
                <Button onClick={onNext}>Next</Button>
            </div>
        </div>
    );
}

export default Step4;