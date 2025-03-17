// src/components/pages/Step2.js
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Step2.css'; // Import CSS for styling

function Step2({ onNext, onPrevious, onSave }) {
    const [wordsOpen, setWordsOpen] = useState(false);
    const [sentencesOpen, setSentencesOpen] = useState(false);
    const [paragraphsOpen, setParagraphsOpen] = useState(false);
    const [essayOpen, setEssayOpen] = useState(false);

    useEffect(() => {
        // Load data from localStorage when the component mounts
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedWordsOpen = localStorage.getItem('step2WordsOpen' + essayTitle);
            const storedSentencesOpen = localStorage.getItem('step2SentencesOpen' + essayTitle);
            const storedParagraphsOpen = localStorage.getItem('step2ParagraphsOpen' + essayTitle);
            const storedEssayOpen = localStorage.getItem('step2EssayOpen' + essayTitle);

            if (storedWordsOpen) setWordsOpen(storedWordsOpen === 'true');
            if (storedSentencesOpen) setSentencesOpen(storedSentencesOpen === 'true');
            if (storedParagraphsOpen) setParagraphsOpen(storedParagraphsOpen === 'true');
            if (storedEssayOpen) setEssayOpen(storedEssayOpen === 'true');
        }
    }, []);

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
                localStorage.setItem('step2WordsOpen' + essayTitle, wordsOpen);
                localStorage.setItem('step2SentencesOpen' + essayTitle, sentencesOpen);
                localStorage.setItem('step2ParagraphsOpen' + essayTitle, paragraphsOpen);
                localStorage.setItem('step2EssayOpen' + essayTitle, essayOpen);
                
                // Update the current step for this specific essay
                localStorage.setItem('currentStep-' + essayTitle, '2');
                
                // Make sure the essay is registered in the system
                localStorage.setItem('essay-' + essayTitle, essayTitle);
                
                resolve(); // Resolve the promise to indicate success
            } catch (error) {
                console.error("Error saving data:", error);
                reject(error); // Reject the promise to indicate failure
            }
        });
    };

    return (
        <div className="step2-container">
            <h2>Step 2: Levels of Resolution</h2>
            <p>
                An essay exists at multiple levels of resolution: words, sentences, paragraphs, and the overall essay.
                Each level contributes to the overall effectiveness of your writing.
            </p>

            <div className="resolution-section">
                <button onClick={() => setWordsOpen(!wordsOpen)}>
                    Words {wordsOpen ? '▲' : '▼'}
                </button>
                {wordsOpen && (
                    <div className="explanation">
                        <p>
                            Words are the fundamental building blocks. Choose them carefully, paying attention to
                            their precise meaning and connotations.
                        </p>
                    </div>
                )}
            </div>

            <div className="resolution-section">
                <button onClick={() => setSentencesOpen(!sentencesOpen)}>
                    Sentences {sentencesOpen ? '▲' : '▼'}
                </button>
                {sentencesOpen && (
                    <div className="explanation">
                        <p>
                            Sentences combine words to express complete thoughts. Aim for clarity and conciseness.
                            Ensure proper grammar and vary sentence structure to maintain reader engagement.
                        </p>
                    </div>
                )}
            </div>

            <div className="resolution-section">
                <button onClick={() => setParagraphsOpen(!paragraphsOpen)}>
                    Paragraphs {paragraphsOpen ? '▲' : '▼'}
                </button>
                {paragraphsOpen && (
                    <div className="explanation">
                        <p>
                            Paragraphs group related sentences to develop a single idea.
                            As a rule of thumb, <b>a paragraph should be made up of at least 10 sentences or 100 words</b>.
                            This may seem arbitrary, but it's a good starting point.
                            Master the rules before you break them.
                        </p>
                    </div>
                )}
            </div>

            <div className="resolution-section">
                <button onClick={() => setEssayOpen(!essayOpen)}>
                    Essay {essayOpen ? '▲' : '▼'}
                </button>
                {essayOpen && (
                    <div className="explanation">
                        <p>
                            The essay is the highest level, encompassing all elements. Ensure a coherent argument, a
                            clear structure, and a consistent tone. While originality is important, focus on
                            mastering the fundamentals first.
                        </p>
                    </div>
                )}
            </div>
            <div className="button-container">
                <Button onClick={onPrevious}>Previous</Button>
                <Button onClick={() => onSave(saveData)}>Save Progress</Button>
                <Button onClick={onNext}>Next</Button>
            </div>
        </div>
    );
}

export default Step2;