// src/components/pages/Step6.js
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Step6.css';
import { getAIResponse } from '../../services/aiService';

function Step6({ onNext, onPrevious, onSave }) {
    const [paragraphs, setParagraphs] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [rewrittenSentences, setRewrittenSentences] = useState([]);
    const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(0);
    const [activeHintIndex, setActiveHintIndex] = useState(null);
    const [feedbackHighlights, setFeedbackHighlights] = useState([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [suggestions, setSuggestions] = useState({});
    const [feedbackType, setFeedbackType] = useState('improve');

    useEffect(() => {
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedParagraphs = localStorage.getItem('step5Paragraphs' + essayTitle);
            if (storedParagraphs) {
                const parsedParagraphs = JSON.parse(storedParagraphs);
                setParagraphs(parsedParagraphs);
                // Initialize sentences and rewritten sentences based on the first paragraph
                if (parsedParagraphs.length > 0) {
                    const initialSentences = splitIntoSentences(parsedParagraphs[0]);
                    setSentences(initialSentences);
                    setRewrittenSentences([...initialSentences]); // Initialize rewritten sentences with original sentences
                } else {
                    setSentences([]);
                    setRewrittenSentences([]);
                }
            }
        }
    }, []);

    useEffect(() => {
        // Update sentences when the selected paragraph changes
        if (paragraphs.length > 0 && selectedParagraphIndex < paragraphs.length) {
            const newSentences = splitIntoSentences(paragraphs[selectedParagraphIndex]);
            setSentences(newSentences);
            setRewrittenSentences([...newSentences]); // Reset rewritten sentences when paragraph changes
            setSuggestions({}); // Clear suggestions when paragraph changes
            setActiveHintIndex(null); // Reset active hint
        } else {
            setSentences([]);
            setRewrittenSentences([]);
        }
    }, [selectedParagraphIndex, paragraphs]);

    // Improved sentence splitting function
    const splitIntoSentences = (text) => {
        // Handle common abbreviations and edge cases
        const prepared = text
            .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
            .replace(/\b(Mr|Mrs|Dr|Prof|etc|vs|e\.g|i\.e)\./g, "$1<DOT>");
            
        const rawSentences = prepared.split("|");
        
        return rawSentences.map(s => 
            s.trim()
              .replace(/<DOT>/g, ".")
              // Add period if missing at the end
              .replace(/([^.?!])$/, "$1.")
        ).filter(s => s.length > 0);
    };

    const handleParagraphChange = (event) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[selectedParagraphIndex] = event.target.value;
        setParagraphs(newParagraphs);
    };

    const handleRewrittenSentenceChange = (index, event) => {
        const newRewrittenSentences = [...rewrittenSentences];
        newRewrittenSentences[index] = event.target.value;
        setRewrittenSentences(newRewrittenSentences);
    };

    const handleApplyRewrite = (index) => {
        const newSentences = [...sentences];
        newSentences[index] = rewrittenSentences[index];
        setSentences(newSentences);

        // Reassemble the paragraph and update the paragraphs state
        const newParagraph = newSentences.join(' ');
        const newParagraphs = [...paragraphs];
        newParagraphs[selectedParagraphIndex] = newParagraph;
        setParagraphs(newParagraphs);
        
        // Clear the suggestion after applying
        const newSuggestions = {...suggestions};
        delete newSuggestions[index];
        setSuggestions(newSuggestions);
    };

    const getFeedbackPrompt = (sentence, type) => {
        const prompts = {
            improve: `Provide 2-3 concise suggestions to improve this sentence's clarity and impact. Ensure your feedback is constructive and focuses on style: "${sentence}"`,
            concise: `Suggest how to make this sentence more concise without losing meaning. Provide 1-2 specific examples: "${sentence}"`,
            academic: `Provide 2-3 options to make this sentence more formal and academic. Highlight specific words or phrases to change: "${sentence}"`,
            creative: `Suggest 1-2 ways to make this sentence more engaging or vivid. Focus on word choice and structure: "${sentence}"`
        };
        return prompts[type] || prompts.improve;
    };

    const handleGetAIHint = async (index) => {
        setActiveHintIndex(index);
        setIsLoadingAI(true);
        try {
            const prompt = getFeedbackPrompt(sentences[index], feedbackType);
            const aiResponse = await getAIResponse(prompt);
            
            // Store the suggestions for this sentence
            setSuggestions({
                ...suggestions,
                [index]: {
                    feedback: aiResponse,
                    type: feedbackType
                }
            });
        } catch (error) {
            console.error('Error getting AI hint:', error);
            alert('Failed to get AI hint. Please try again.');
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleSuggestionClick = (index, suggestion) => {
        const newRewrittenSentences = [...rewrittenSentences];
        newRewrittenSentences[index] = suggestion;
        setRewrittenSentences(newRewrittenSentences);
    };

    const handleSelectParagraph = (index) => {
        setSelectedParagraphIndex(index);
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
                
                // Save step-specific data - save entire paragraphs array
                localStorage.setItem('step5Paragraphs' + essayTitle, JSON.stringify(paragraphs));

                // Update the current step for this specific essay
                localStorage.setItem('currentStep-' + essayTitle, '6');
                
                // Make sure the essay is registered in the system
                localStorage.setItem('essay-' + essayTitle, essayTitle);
                
                resolve();
            } catch (error) {
                console.error("Error saving data:", error);
                reject(error);
            }
        });
    };

    // Parse AI suggestions (simplistic version - would need enhancement for production)
    const renderSuggestions = (index) => {
        if (!suggestions[index]) return null;
        
        const feedbackText = suggestions[index].feedback;
        
        // Simple parser to extract suggestions
        const suggestionLines = feedbackText.split(/\d+[\.\)]\s+/)
            .filter(line => line.trim().length > 0)
            .map(line => line.trim());
        
        return (
            <div className="ai-suggestions">
                <h4>Suggestions:</h4>
                <div className="suggestion-list">
                    {suggestionLines.map((line, i) => (
                        <div key={i} className="suggestion-item">
                            <div className="suggestion-content">{line}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="step6-container">
            <h2>Step 6: Sentence Enhancement</h2>
            <p>Refine your writing one sentence at a time with AI-assisted suggestions.</p>

            <div className="paragraph-selection">
                <p>Select a paragraph to enhance:</p>
                <ol>
                    {paragraphs.map((paragraph, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleSelectParagraph(index)}
                                className={index === selectedParagraphIndex ? 'selected' : ''}
                            >
                                Paragraph {index + 1}
                            </button>
                        </li>
                    ))}
                </ol>
            </div>

            {paragraphs.length > 0 ? (
                <div className="editing-area">
                    <div className="paragraph-preview">
                        <label htmlFor="selectedParagraph">Selected Paragraph:</label>
                        <div 
                            id="selectedParagraph"
                            className="paragraph-text"
                        >
                            {sentences.map((sentence, idx) => (
                                <span 
                                    key={idx} 
                                    className={`sentence ${activeHintIndex === idx ? 'active-sentence' : ''} ${suggestions[idx] ? 'has-suggestion' : ''}`}
                                    onClick={() => setActiveHintIndex(idx)}
                                >
                                    {sentence} 
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="feedback-type-selector">
                        <label>Suggestion type:</label>
                        <div className="feedback-buttons">
                            <button 
                                className={feedbackType === 'improve' ? 'selected' : ''} 
                                onClick={() => setFeedbackType('improve')}
                            >
                                Improve Clarity
                            </button>
                            <button 
                                className={feedbackType === 'concise' ? 'selected' : ''} 
                                onClick={() => setFeedbackType('concise')}
                            >
                                Make Concise
                            </button>
                            <button 
                                className={feedbackType === 'academic' ? 'selected' : ''} 
                                onClick={() => setFeedbackType('academic')}
                            >
                                Academic Style
                            </button>
                            <button 
                                className={feedbackType === 'creative' ? 'selected' : ''} 
                                onClick={() => setFeedbackType('creative')}
                            >
                                Creative Flair
                            </button>
                        </div>
                    </div>

                    <h3>Sentence Editor</h3>
                    <div className="sentences-list">
                        {activeHintIndex !== null && (
                            <div className="sentence-editor">
                                <div className="sentence-original">
                                    <label>Original:</label>
                                    <p>{sentences[activeHintIndex]}</p>
                                </div>
                                
                                <div className="sentence-rewrite">
                                    <label>Your revision:</label>
                                    <textarea
                                        value={rewrittenSentences[activeHintIndex] || ''}
                                        onChange={(event) => handleRewrittenSentenceChange(activeHintIndex, event)}
                                        placeholder="Type your revised sentence here..."
                                    />
                                </div>
                                
                                {renderSuggestions(activeHintIndex)}
                                
                                <div className="editor-actions">
                                    <Button 
                                        onClick={() => handleApplyRewrite(activeHintIndex)}
                                        className="apply-button"
                                    >
                                        Apply Changes
                                    </Button>
                                    <Button 
                                        onClick={() => handleGetAIHint(activeHintIndex)} 
                                        disabled={isLoadingAI}
                                        className="hint-button"
                                    >
                                        {isLoadingAI ? 'Loading...' : 'Get Writing Suggestions'}
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {activeHintIndex === null && (
                            <div className="no-sentence-selected">
                                <p>Click on any sentence in the paragraph above to edit it.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <p>Please write paragraphs in Step 5 before enhancing sentences.</p>
                    <Button onClick={onPrevious}>Go to Step 5</Button>
                </div>
            )}

            <div className="button-container">
                <Button onClick={onPrevious} className="navigation-button">← Previous</Button>
                <Button onClick={() => onSave(saveData)} className="save-button">Save Progress</Button>
                <Button onClick={onNext} className="navigation-button">Next →</Button>
            </div>
        </div>
    );
}

export default Step6;