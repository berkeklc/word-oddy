import React, { useState, useEffect } from 'react';
import './FloatingLetters.css';

const FloatingLetters = ({ word, onKeyPress, disabled }) => {
    const [pressedKeys, setPressedKeys] = useState(new Set());
    const [floatingPositions, setFloatingPositions] = useState({});
    const [letterPool, setLetterPool] = useState([]);

    // Generate letter pool when word changes
    useEffect(() => {
        if (!word) return;

        const wordLetters = word.answer.split('');
        const commonLetters = ['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L', 'D'];

        // Add word letters + some common distractors
        const allLetters = [...new Set([...wordLetters, ...commonLetters])];

        // Shuffle
        const shuffled = allLetters.sort(() => Math.random() - 0.5);
        setLetterPool(shuffled);
    }, [word?.answer]); // Re-generate when word changes!

    // Initialize floating positions when letter pool changes
    useEffect(() => {
        if (letterPool.length === 0) return;

        const positions = {};
        letterPool.forEach((letter, index) => {
            const angle = (index / letterPool.length) * 2 * Math.PI;
            const radius = 100 + Math.random() * 30;
            positions[letter] = {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                delay: Math.random() * 2,
                duration: 3 + Math.random() * 2
            };
        });
        setFloatingPositions(positions);
    }, [letterPool]);

    const handleLetterClick = (letter) => {
        if (disabled) return;

        setPressedKeys(prev => new Set([...prev, letter]));
        onKeyPress(letter);

        setTimeout(() => {
            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(letter);
                return newSet;
            });
        }, 300);
    };

    if (!word || letterPool.length === 0) return null;

    return (
        <div className="floating-letters-container">
            <div className="floating-letters-orbit">
                {letterPool.map((letter, index) => {
                    const pos = floatingPositions[letter] || { x: 0, y: 0, delay: 0, duration: 3 };
                    const isPressed = pressedKeys.has(letter);

                    return (
                        <button
                            key={`${letter}-${index}`}
                            className={`floating-letter ${isPressed ? 'pressed' : ''}`}
                            onClick={() => handleLetterClick(letter)}
                            disabled={disabled}
                            style={{
                                '--float-x': `${pos.x}px`,
                                '--float-y': `${pos.y}px`,
                                '--float-delay': `${pos.delay}s`,
                                '--float-duration': `${pos.duration}s`,
                            }}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>

            <button
                className="floating-backspace"
                onClick={() => onKeyPress('⌫')}
                disabled={disabled}
            >
                ⌫
            </button>
        </div>
    );
};

export default FloatingLetters;
