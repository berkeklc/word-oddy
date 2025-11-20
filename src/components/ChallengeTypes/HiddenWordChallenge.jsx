import React, { useState, useEffect } from 'react';
import './HiddenWordChallenge.css';

const HiddenWordChallenge = ({ word, onComplete, onCorrect, onWrong, revealed }) => {
    const [revealedCount, setRevealedCount] = useState(revealed ? word.answer.length : 0);
    const [currentInput, setCurrentInput] = useState('');

    useEffect(() => {
        if (revealed) {
            setRevealedCount(word.answer.length);
        }
    }, [word, revealed]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                handleKeyPress(key);
            } else if (e.key === 'Backspace') {
                handleKeyPress('⌫');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentInput, word.answer]); // Re-bind to capture currentInput state

    const handleKeyPress = (key) => {
        if (key === '⌫') {
            setCurrentInput(prev => prev.slice(0, -1));
        } else if (currentInput.length < word.answer.length) {
            const newInput = currentInput + key;
            setCurrentInput(newInput);

            if (newInput.length === word.answer.length) {
                setTimeout(() => {
                    if (newInput === word.answer) {
                        if (onCorrect) onCorrect();
                        if (onComplete) onComplete(true);
                    } else {
                        setCurrentInput('');
                        if (onWrong) onWrong();
                    }
                }, 100);
            }
        }
    };

    return (
        <div className="hidden-word-challenge">
            <div className="hidden-letters">
                {word.answer.split('').map((letter, index) => (
                    <div key={index} className={`hidden-box ${index < revealedCount ? 'revealed' : ''}`}>
                        {index < revealedCount ? letter : '?'}
                    </div>
                ))}
            </div>

            <div className="input-boxes">
                {Array(word.answer.length).fill('').map((_, index) => (
                    <div key={index} className={`input-box ${currentInput[index] ? 'filled' : ''}`}>
                        {currentInput[index] || ''}
                    </div>
                ))}
            </div>

            <div className="hidden-keyboard">
                {word.answer.split('').filter((l, i, arr) => arr.indexOf(l) === i).sort().map(letter => (
                    <button
                        key={letter}
                        className="hidden-key"
                        onClick={() => handleKeyPress(letter)}
                    >
                        {letter}
                    </button>
                ))}
                <button className="hidden-key backspace" onClick={() => handleKeyPress('⌫')}>
                    ⌫
                </button>
            </div>

            {revealedCount < word.answer.length && (
                <div className="revealing-message">
                    Revealing letters... {revealedCount} / {word.answer.length}
                </div>
            )}
        </div>
    );
};

export default HiddenWordChallenge;
