import React, { useState, useEffect } from 'react';
import './ScrambledChallenge.css';

const ScrambledChallenge = ({ word, onComplete, onCorrect, onWrong }) => {
    const [letters, setLetters] = useState(
        word.answer.split('').sort(() => Math.random() - 0.5)
    );
    const [shakeActive, setShakeActive] = useState(false);
    const [selectedindex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();

            // Find the first index where the letter is wrong
            let firstIncorrectIndex = 0;
            while (firstIncorrectIndex < word.answer.length && letters[firstIncorrectIndex] === word.answer[firstIncorrectIndex]) {
                firstIncorrectIndex++;
            }

            if (firstIncorrectIndex >= word.answer.length) return; // Already solved

            // Check if the typed key is the correct letter for this position
            if (key === word.answer[firstIncorrectIndex]) {
                // Find this letter in the remaining scrambled part
                const targetIndex = letters.indexOf(key, firstIncorrectIndex);
                if (targetIndex !== -1) {
                    swapLetters(firstIncorrectIndex, targetIndex);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [letters, word.answer]);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('index', index.toString());
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('index'));
        swapLetters(dragIndex, dropIndex);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleClick = (index) => {
        if (selectedindex === null) {
            setSelectedIndex(index);
        } else {
            swapLetters(selectedindex, index);
            setSelectedIndex(null);
        }
    };

    const swapLetters = (index1, index2) => {
        if (index1 === index2) return;

        const newLetters = [...letters];
        [newLetters[index1], newLetters[index2]] =
            [newLetters[index2], newLetters[index1]];

        setLetters(newLetters);

        // Check if correct
        const attempt = newLetters.join('');
        if (attempt === word.answer) {
            if (onCorrect) onCorrect();
            setTimeout(() => {
                if (onComplete) onComplete(true);
            }, 600);
        }
    };

    const handleCheck = () => {
        const attempt = letters.join('');
        if (attempt === word.answer) {
            if (onCorrect) onCorrect();
            if (onComplete) onComplete(true);
        } else {
            setShakeActive(true);
            setTimeout(() => setShakeActive(false), 500);
            if (onWrong) onWrong();
        }
    };

    return (
        <div className="scrambled-challenge">
            <div className="scrambled-letters">
                {letters.map((letter, index) => (
                    <div
                        key={index}
                        className={`scrambled-box ${shakeActive ? 'shake' : ''} ${selectedindex === index ? 'selected' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        onClick={() => handleClick(index)}
                    >
                        {letter}
                    </div>
                ))}
            </div>

            <button className="check-btn" onClick={handleCheck}>
                Check Answer
            </button>

            <div className="scrambled-hint">
                Tap or drag letters to swap
            </div>
        </div>
    );
};

export default ScrambledChallenge;
