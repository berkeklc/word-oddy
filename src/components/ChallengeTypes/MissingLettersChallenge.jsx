import React, { useState, useEffect } from 'react';
import './MissingLettersChallenge.css';

const MissingLettersChallenge = ({ word, onComplete, onCorrect, onWrong }) => {
    const visiblePos = word.config?.visiblePositions || [];
    const distractors = word.config?.distractorLetters || [];

    // Build letter slots
    const slots = word.answer.split('').map((letter, index) => ({
        letter,
        visible: visiblePos.includes(index),
        filled: visiblePos.includes(index) ? letter : ''
    }));

    const [filledSlots, setFilledSlots] = useState(slots);
    const [shakeActive, setShakeActive] = useState(false);

    // Create letter bank
    const neededLetters = word.answer.split('').filter((_, i) => !visiblePos.includes(i));
    const letterBank = [...neededLetters, ...distractors].sort(() => Math.random() - 0.5);
    const [availableLetters, setAvailableLetters] = useState(letterBank);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (availableLetters.includes(key)) {
                handleLetterClick(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [availableLetters, filledSlots]); // Re-bind when state changes

    const handleLetterClick = (letter) => {
        // Find first empty slot
        const emptyIndex = filledSlots.findIndex(slot => !slot.visible && !slot.filled);
        if (emptyIndex === -1) return;

        const newSlots = [...filledSlots];
        newSlots[emptyIndex].filled = letter;
        setFilledSlots(newSlots);

        // Remove from available
        const letterIndex = availableLetters.indexOf(letter);
        const newAvailable = [...availableLetters];
        newAvailable.splice(letterIndex, 1);
        setAvailableLetters(newAvailable);

        // Check if complete
        const attempt = newSlots.map(s => s.filled).join('');
        if (attempt.length === word.answer.length) {
            setTimeout(() => {
                if (attempt === word.answer) {
                    if (onCorrect) onCorrect();
                    if (onComplete) onComplete(true);
                } else {
                    setShakeActive(true);
                    setTimeout(() => {
                        setShakeActive(false);
                        // Reset
                        setFilledSlots(slots);
                        setAvailableLetters(letterBank);
                    }, 500);
                    if (onWrong) onWrong();
                }
            }, 100);
        }
    };

    return (
        <div className="missing-letters-challenge">
            <div className="word-slots">
                {filledSlots.map((slot, index) => (
                    <div key={index} className={`slot-box ${slot.visible ? 'visible' : ''} ${slot.filled ? 'filled' : ''} ${shakeActive ? 'shake' : ''}`}>
                        {slot.filled || (slot.visible ? '' : '_')}
                    </div>
                ))}
            </div>

            <div className="letter-bank">
                <div className="bank-label">Available Letters:</div>
                <div className="bank-letters">
                    {availableLetters.map((letter, index) => (
                        <button
                            key={`${letter}-${index}`}
                            className="bank-letter"
                            onClick={() => handleLetterClick(letter)}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MissingLettersChallenge;
