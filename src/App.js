// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import HomePage from './components/pages/HomePage';
import Step1 from './components/pages/Step1';
import Step2 from './components/pages/Step2';
import Step3 from './components/pages/Step3';
import Step4 from './components/pages/Step4';
import Step5 from './components/pages/Step5';
import Step6 from './components/pages/Step6';
import Step7 from './components/pages/Step7';
import Step8 from './components/pages/Step8';
import EssayView from './components/pages/EssayView'; // Import EssayView
import Button from './components/common/Button';
import './App.css';

function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(8)
    const navigate = useNavigate();
    const [saveError, setSaveError] = useState(null);
    const [clearStorageWarning, setClearStorageWarning] = useState(false); // State for clear storage warning
    const [essayTitle, setEssayTitle] = useState(''); // Essay title in local storage

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    const isFirstLoad = useRef(true); // Track initial load
    
    const location = useLocation(); // Get current location
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        if (isFirstLoad.current) {
            const storedTitle = localStorage.getItem('essayTitle');
            if (storedTitle) {
                setEssayTitle(storedTitle);
            }
            const storedStep = localStorage.getItem('currentStep');
            if (storedStep) {
                setCurrentStep(parseInt(storedStep, 10));
                navigate(`/step${storedStep}`);
            }
            isFirstLoad.current = false; // Prevent it from running again
        }
    }, [navigate]);


    const handleNext = () => {
        if (currentStep < totalSteps) {
            localStorage.setItem('currentStep', currentStep + 1);
            setCurrentStep(currentStep + 1);
            navigate(`/step${currentStep + 1}`);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            localStorage.setItem('currentStep', currentStep - 1);
            setCurrentStep(currentStep - 1);
            navigate(`/step${currentStep - 1}`);
        }
    };

    const handleSave = async (saveData) => {
        setSaveError(null);
        if (typeof saveData === 'function') {
            try {
                await saveData();
            } catch (error) {
                console.error("Error during save:", error);
                setSaveError("Error saving progress. Please try again.");
            }
        } else {
            console.warn('No save logic detected on step');
        }
    };

    const handleStepSelect = (event) => {
        const step = parseInt(event.target.value, 10);
        localStorage.setItem('currentStep', step);
        setCurrentStep(step);
        navigate(`/step${step}`);
    };

    const handleClearStorage = () => {
        setClearStorageWarning(true);
    };

    const confirmClearStorage = () => {
        localStorage.clear();
        setCurrentStep(1);
        setEssayTitle('');
        navigate('/step1');
        setClearStorageWarning(false);
    };

    const cancelClearStorage = () => {
        setClearStorageWarning(false);
    };

    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="App">
            {!isHomePage && <Link to="/" className="home-link">Homepage</Link>}
            <h1>Articulate & Refine</h1>

            {!isHomePage && (
                <>
                    <div className="progress-container">
                        <label htmlFor="progress">Progress:</label>
                        <progress id="progress" value={progress} max="100" />
                        <span>{currentStep}/{totalSteps}</span>
                    </div>

                    <div className="step-select">
                        <label htmlFor="step-select">Jump to: </label>
                        <select id="step-select" value={currentStep} onChange={handleStepSelect}>
                            <option value="1">Step 1: Introduction</option>
                            <option value="2">Step 2: Levels of Resolution</option>
                            <option value="3">Step 3: Topic and Reading List</option>
                            <option value="4">Step 4: Outline Creation</option>
                            <option value="5">Step 5: Paragraphs</option>
                            <option value="6">Step 6: Sentence Editing</option>
                            <option value="7">Step 7: Paragraph Reordering</option>
                            <option value="8">Step 8: New Outline Generation</option>
                        </select>
                    </div>
                </>
            )}

            {saveError && <div className="error-message">{saveError}</div>}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                    path="/step1" 
                    element={
                        <Step1 
                            onNext={handleNext} 
                            onPrevious={handlePrevious} 
                            onSave={handleSave} 
                            isNewEssay={location.state?.isNewEssay || false}
                        />
                    } 
                />
                <Route path="/step2" element={<Step2 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/step3" element={<Step3 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/step4" element={<Step4 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/step5" element={<Step5 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/step6" element={<Step6 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/step7" element={<Step7 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/step8" element={<Step8 onNext={handleNext} onPrevious={handlePrevious} onSave={handleSave} />} />
                <Route path="/essay/:essayTitle" element={<EssayView />} />
            </Routes>

            {clearStorageWarning && (
                <div className="warning-message">
                    <p>Are you sure you want to clear all saved data? This action cannot be undone.</p>
                    <Button onClick={confirmClearStorage}>Yes, Clear All Data</Button>
                    <Button onClick={cancelClearStorage}>Cancel</Button>
                </div>
            )}

            {!isHomePage && (
                <div className="localStorageClear">
                    <Button onClick={handleClearStorage}>Clear Storage</Button>
                </div>
            )}
        </div>
    );
}

export default App;
