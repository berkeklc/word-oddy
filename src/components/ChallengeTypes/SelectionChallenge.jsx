import React, { useState, useEffect } from 'react';
import './SelectionChallenge.css';

const SelectionChallenge = ({ word, onComplete, onCorrect, onWrong }) => {
    // Initialize letter pool once
    const [allLetters] = useState(() => {
        const distractors = word.config?.distractorLetters || [];
        return [...word.answer.split(''), ...distractors]
            .sort(() => Math.random() - 0.5);
    });

    const [selectedIndices, setSelectedIndices] = useState([]);
    const [shakeActive, setShakeActive] = useState(false);

    const selectedLetters = selectedIndices.map(i => allLetters[i]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();

            // Find first occurrence of key in allLetters that is NOT in selectedIndices
            const index = allLetters.findIndex((l, i) => l === key && !selectedIndices.includes(i));

            if (index !== -1) {
                handleLetterClick(index);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [allLetters, selectedIndices]);

    const handleLetterClick = (index) => {
        const newIndices = [...selectedIndices, index];
        const newSelectedLetters = newIndices.map(i => allLetters[i]);

        setSelectedIndices(newIndices);

        // Check if correct so far
        const currentAnswer = newSelectedLetters.join('');
        const expectedStart = word.answer.substring(0, newSelectedLetters.length);

        if (currentAnswer !== expectedStart) {
            // Wrong letter!
            setShakeActive(true);
            setTimeout(() => {
                setShakeActive(false);
                setSelectedIndices([]);
            }, 500);

            if (onWrong) onWrong();
        } else if (newSelectedLetters.length === word.answer.length) {
            // Complete!
            if (onCorrect) onCorrect();
            setTimeout(() => {
                if (onComplete) onComplete(true);
            }, 600);
        }
    };

    return (
        <div className="selection-challenge">
            <div className="selected-display">
                {Array(word.answer.length).fill('').map((_, i) => (
                    <div key={i} className={`selected-box ${selectedLetters[i] ? 'filled' : ''} ${shakeActive ? 'shake' : ''}`}>
                        {selectedLetters[i] || ''}
                    </div>
                ))}
            </div>

            <div className="letter-pool">
                {allLetters.map((letter, index) => {
                    const isUsed = selectedIndices.includes(index);

                    return (
                        <button
                            key={`${letter}-${index}`}
                            className={`pool-letter ${isUsed ? 'used' : ''}`}
                            onClick={() => !isUsed && handleLetterClick(index)}
                            disabled={isUsed}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>

            <div className="selection-hint">
                Tap letters in correct order
            </div>
        </div>
    );
};

export default SelectionChallenge;
