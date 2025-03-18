import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/common/Button';
import './Step7.css';

function Step7({ onNext, onPrevious, onSave }) {
    const [paragraphs, setParagraphs] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedNode, setDraggedNode] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        loadParagraphs();
    }, []);

    const loadParagraphs = () => {
        const essayTitle = localStorage.getItem('essayTitle');
        if (essayTitle) {
            const storedParagraphs = localStorage.getItem('step5Paragraphs' + essayTitle);
            if (storedParagraphs) {
                try {
                    const parsedParagraphs = JSON.parse(storedParagraphs);
                    setParagraphs(parsedParagraphs);
                } catch (error) {
                    console.error("Error parsing paragraphs:", error);
                }
            }
        }
    };

    const handleDragStart = (event, index) => {
        // Store a reference to the dragged node
        setDraggedNode(event.currentTarget);
        setDraggedItem(index);
        setIsDragging(true);
        
        // Add a ghost image effect
        const ghostElement = event.currentTarget.cloneNode(true);
        ghostElement.style.position = 'absolute';
        ghostElement.style.top = '-1000px';
        ghostElement.style.opacity = '0.5';
        document.body.appendChild(ghostElement);
        event.dataTransfer.setDragImage(ghostElement, 0, 0);
        
        // Set timeout to remove ghost after drag starts
        setTimeout(() => {
            document.body.removeChild(ghostElement);
        }, 0);
        
        // Set data to enable proper dropping in Firefox
        event.dataTransfer.setData('text/plain', index.toString());
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (event, index) => {
        event.preventDefault();
        
        if (draggedItem === index) return;
        
        const rect = event.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (event.clientY < midpoint) {
            setDropTarget({ index, position: 'before' });
        } else {
            setDropTarget({ index, position: 'after' });
        }
    };

    const handleDragEnd = (event) => {
        event.preventDefault();
        
        // Only execute the move if we have a valid drop target
        if (draggedItem !== null && dropTarget && draggedItem !== dropTarget.index) {
            const updatedParagraphs = [...paragraphs];
            const [draggedParagraph] = updatedParagraphs.splice(draggedItem, 1);
            
            let newIndex = dropTarget.index;
            if (dropTarget.position === 'after') {
                newIndex += 1;
            }
            
            // Adjust index if removing from a position before the insert point
            if (draggedItem < newIndex) {
                newIndex -= 1;
            }
            
            updatedParagraphs.splice(newIndex, 0, draggedParagraph);
            setParagraphs(updatedParagraphs);
        }
        
        // Clean up
        resetDragState();
    };

    const resetDragState = () => {
        setDraggedItem(null);
        setDraggedNode(null);
        setDropTarget(null);
        setIsDragging(false);
    };

    const saveData = () => {
        return new Promise((resolve, reject) => {
            try {
                const essayTitle = localStorage.getItem('essayTitle');
                if (!essayTitle) {
                    reject(new Error("No essay title found"));
                    return;
                }

                localStorage.setItem('step5Paragraphs' + essayTitle, JSON.stringify(paragraphs));
                localStorage.setItem('step7Completed' + essayTitle, 'true');
                localStorage.setItem('currentStep-' + essayTitle, '7');

                resolve();
            } catch (error) {
                console.error("Error saving data:", error);
                reject(error);
            }
        });
    };

    const handleNext = () => {
        saveData().then(() => onNext()).catch(error => console.error(error));
    };

    // Determine which CSS class to apply for drop indicators
    const getDropClass = (index) => {
        if (!dropTarget || draggedItem === index) return '';
        
        if (dropTarget.index === index) {
            return dropTarget.position === 'before' ? 'drop-before' : 'drop-after';
        }
        
        return '';
    };

    return (
        <div className="step7-container">
            <h2>Step 7: Paragraph Reordering</h2>
            <p>Drag and drop the paragraphs to reorder them for a logical flow.</p>

            <div 
                ref={containerRef}
                className={`paragraph-list ${isDragging ? 'dragging-active' : ''}`}
            >
                {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => (
                        <div
                            key={index}
                            data-index={index}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`paragraph-item ${draggedItem === index ? 'dragging' : ''} ${getDropClass(index)}`}
                        >
                            <div className="drag-handle">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M4 6h8M4 8h8M4 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div className="paragraph-content">
                                <h3>Paragraph {index + 1}</h3>
                                <p>{paragraph}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="empty-message">Please write paragraphs in Step 5 before reordering them.</p>
                )}
            </div>

            <div className="button-container">
                <Button onClick={onPrevious}>Previous</Button>
                <Button onClick={() => onSave(saveData)}>Save Progress</Button>
                <Button onClick={handleNext} disabled={paragraphs.length === 0}>Next</Button>
            </div>
        </div>
    );
}

export default Step7;