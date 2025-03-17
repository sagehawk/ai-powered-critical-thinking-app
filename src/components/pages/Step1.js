// src/components/pages/Step1.js
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Step1.css';
import { useNavigate } from 'react-router-dom';

function Step1({ onNext, onPrevious, onSave }) {
    const [goal, setGoal] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [timeManagement, setTimeManagement] = useState('');
    const [essayTitle, setEssayTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(false);

    const navigate = useNavigate();

// Update the useEffect in Step1.js
useEffect(() => {
    // Check if we have a currently active essay title
    const storedTitle = localStorage.getItem('essayTitle');
    
    if (storedTitle) {
        // Load this essay's specific data
        setEssayTitle(storedTitle);
        setIsValidTitle(true);
        
        const storedGoal = localStorage.getItem('step1Goal' + storedTitle);
        const storedWorkspace = localStorage.getItem('step1Workspace' + storedTitle);
        const storedTimeManagement = localStorage.getItem('step1TimeManagement' + storedTitle);

        if (storedGoal) setGoal(storedGoal);
        if (storedWorkspace) setWorkspace(storedWorkspace);
        if (storedTimeManagement) setTimeManagement(storedTimeManagement);
    } else {
        // No essay loaded, start with blank fields
        setEssayTitle('');
        setGoal('');
        setWorkspace('');
        setTimeManagement('');
        setIsValidTitle(false);
    }
}, []);

    const handleGoalChange = (event) => {
        setGoal(event.target.value);
    };

    const handleWorkspaceChange = (event) => {
        setWorkspace(event.target.value);
    };

    const handleTimeManagementChange = (event) => {
        setTimeManagement(event.target.value);
    };

    const handleEssayTitleChange = (event) => {
        const newTitle = event.target.value;
        setEssayTitle(newTitle);
        setIsValidTitle(newTitle.trim() !== ''); // Simple validation
    };

    const startNewEssay = () => {
        let titleToUse = essayTitle.trim();
        if (titleToUse === '') {
            titleToUse = 'Untitled Essay';
            setEssayTitle(titleToUse);
        }
        
        localStorage.setItem('essayTitle', titleToUse);
        localStorage.setItem('currentStep', 1);
        localStorage.setItem('essay-' + titleToUse, titleToUse);
        localStorage.setItem('currentStep-' + titleToUse, '1');
        
        // Save the current form data for this essay
        saveData()
            .then(() => {
                onNext();
            })
            .catch(error => {
                console.error("Error during save:", error);
                alert('An error occurred while saving your essay. Please try again.');
            });
    };

    const saveData = () => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem('essayTitle', essayTitle);
                localStorage.setItem('step1Goal' + essayTitle, goal);
                localStorage.setItem('step1Workspace' + essayTitle, workspace);
                localStorage.setItem('step1TimeManagement' + essayTitle, timeManagement);
                
                // This is the key addition - ensure the essay is registered in the system
                localStorage.setItem('essay-' + essayTitle, essayTitle);
                
                // Store the current step specific to this essay
                localStorage.setItem('currentStep-' + essayTitle, '1');
                
                resolve();
            } catch (error) {
                console.error("Error saving data:", error);
                reject(error);
            }
        });
    };


    return (
        <div className="step1-container">
            <h2>Step 1: Introduction and Goal Setting</h2>
            <label htmlFor="essayTitle">Essay Title:</label>
            <input
                type="text"
                id="essayTitle"
                value={essayTitle}
                onChange={handleEssayTitleChange}
                placeholder="Enter essay title"
            />

            <p>
                Welcome! Writing an essay isn't just about fulfilling an assignment; it's about
                sharpening your thinking, organizing your ideas, and communicating effectively. The
                person who can formulate and communicate the best argument almost always wins.
            </p>

            <div className="goal-input">
                <label htmlFor="goal">My Writing Goal:</label>
                <textarea
                    id="goal"
                    value={goal}
                    onChange={handleGoalChange}
                    placeholder="Why are you writing this essay? How will it improve your thinking and communication?"
                />
            </div>

            {goal && (
                <div className="goal-display">
                    <h3>Your Goal:</h3>
                    <p>{goal}</p>
                </div>
            )}

            <div className="workspace-input">
                <label htmlFor="workspace">Workspace Considerations:</label>
                <textarea
                    id="workspace"
                    value={workspace}
                    onChange={handleWorkspaceChange}
                    placeholder="Describe your ideal writing setup: multiple screens, keyboard, chair, etc."
                />
            </div>

            <div className="time-management-input">
                <label htmlFor="timeManagement">Time Management:</label>
                <textarea
                    id="timeManagement"
                    value={timeManagement}
                    onChange={handleTimeManagementChange}
                    placeholder="How will you manage your time? Remember to write every day, even if only for a short period."
                />
            </div>

            <p>(Finished beats perfect. Aim for progress, not perfection.)</p>

            <div className="button-container">
                <Button onClick={onPrevious} >
                    Previous
                </Button>
                <Button onClick={() => onSave(saveData)}>Save</Button>
                <Button onClick={startNewEssay} disabled={!isValidTitle}>Next</Button>
            </div>
        </div>
    );
}

export default Step1;