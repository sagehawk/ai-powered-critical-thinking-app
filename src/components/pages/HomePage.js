// src/components/pages/HomePage.js - with delete functionality
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import './HomePage.css';

function HomePage() {
    const [draftEssays, setDraftEssays] = useState([]);
    const [finishedEssays, setFinishedEssays] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load essays from local storage and categorize them
        loadEssays();
    }, []);
    
    const loadEssays = () => {
        const savedDraftEssays = [];
        const savedFinishedEssays = [];

        // Scan all localStorage items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Check for essay titles
            if (key.startsWith('essay-')) {
                const essayTitle = key.substring(6); // Remove "essay-" prefix
                
                // Get current step for this essay
                const lastStep = localStorage.getItem('currentStep-' + essayTitle) || "1";
                
                // Check if essay is completed (step 8) or in progress
                if (lastStep === "8") {
                    savedFinishedEssays.push({ 
                        title: essayTitle, 
                        key: key,
                        step: lastStep
                    });
                } else {
                    savedDraftEssays.push({ 
                        title: essayTitle, 
                        key: key,
                        step: lastStep
                    });
                }
            }
        }
        
        // Sort essays by title
        savedDraftEssays.sort((a, b) => a.title.localeCompare(b.title));
        savedFinishedEssays.sort((a, b) => a.title.localeCompare(b.title));
        
        setDraftEssays(savedDraftEssays);
        setFinishedEssays(savedFinishedEssays);
    };

    const handleStartNewEssay = () => {
        // Clear the current essay title when starting a new one
        localStorage.removeItem('essayTitle');
        navigate('/step1');
    };
    
    const handleOpenEssay = (essayTitle, step) => {
        // Set this as the current essay
        localStorage.setItem('essayTitle', essayTitle);
        localStorage.setItem('currentStep', step);
        navigate(`/step${step}`);
    };
    
    const handleDeleteEssay = (essayTitle) => {
        setShowDeleteConfirm(essayTitle);
    };
    
    const confirmDelete = (essayTitle) => {
        // Delete all data for this essay
        const keysToRemove = [];
        
        // Find all localStorage items related to this essay
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === `essay-${essayTitle}` || key.includes(essayTitle)) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all found keys
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // If this was the current essay, clear that too
        if (localStorage.getItem('essayTitle') === essayTitle) {
            localStorage.removeItem('essayTitle');
            localStorage.removeItem('currentStep');
        }
        
        // Reload essays and clear confirmation dialog
        loadEssays();
        setShowDeleteConfirm(null);
    };
    
    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    return (
        <div className="homepage-container">
            <h2>Welcome to Articulate & Refine!</h2>
            <p>Your essay writing assistant that guides you step-by-step through the writing process.</p>
            
            <div className="new-essay-button">
                <Button onClick={handleStartNewEssay} className="start-button">Start New Essay</Button>
            </div>

            {draftEssays.length > 0 && (
                <div className="essay-list">
                    <h3>Draft Essays (In Progress):</h3>
                    <ul>
                        {draftEssays.map((essay) => (
                            <li key={essay.key}>
                                <div onClick={() => handleOpenEssay(essay.title, essay.step)} className="essay-title">
                                    {essay.title}
                                </div>
                                <div className="essay-actions">
                                    <span className="essay-step">Step {essay.step}/8</span>
                                    <button 
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEssay(essay.title);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {finishedEssays.length > 0 && (
                <div className="essay-list">
                    <h3>Finished Essays:</h3>
                    <ul>
                        {finishedEssays.map((essay) => (
                            <li key={essay.key}>
                                <div onClick={() => handleOpenEssay(essay.title, essay.step)} className="essay-title">
                                    {essay.title}
                                </div>
                                <div className="essay-actions">
                                    <span className="essay-completed">Completed</span>
                                    <button 
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEssay(essay.title);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {(draftEssays.length === 0 && finishedEssays.length === 0) && (
                <p className="no-essays">No essays saved yet. Start a new essay to begin.</p>
            )}
            
            {showDeleteConfirm && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete "{showDeleteConfirm}"?</p>
                    <div className="delete-buttons">
                        <Button onClick={() => confirmDelete(showDeleteConfirm)}>Yes, Delete</Button>
                        <Button onClick={cancelDelete}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;