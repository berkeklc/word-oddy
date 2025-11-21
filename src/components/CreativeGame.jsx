import React, { useState, useEffect, useCallback } from 'react';
import { levels } from '../data/levels';
import { dictionary } from '../data/dictionary';
import { soundManager } from '../utils/SoundManager';
import { triggerParticles } from './ParticleSystem';
import './CreativeGame.css';

// Helper to get random letters based on weighted frequency (English)
const getRandomLetter = () => {
    const weights = {
        'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3,
        'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8, 'U': 2.8, 'M': 2.4,
        'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.5, 'V': 1.0,
        'K': 0.8, 'J': 0.15, 'X': 0.15, 'Q': 0.10, 'Z': 0.07
    };

    let sum = 0;
    const r = Math.random() * 100;

    for (let char in weights) {
        sum += weights[char];
        if (r <= sum) return char;
    }
    return 'E'; // Fallback
};

const CreativeGame = ({ onBack }) => {
    const [gridSize, setGridSize] = useState(4);
    const [grid, setGrid] = useState([]);
    const [targetWords, setTargetWords] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isLevelingUp, setIsLevelingUp] = useState(false);
    const [wordsToFindCount, setWordsToFindCount] = useState(3);
    const [bonusMessage, setBonusMessage] = useState(null);
    const [powerUps, setPowerUps] = useState({ hint: 3, shuffle: 1 }); // Start with some power-ups

    // Pool of words to choose from (using existing levels data + some extras)
    const getWordPool = (currentGridSize) => {
        const pool = new Set();
        levels.forEach(l => l.words.forEach(w => {
            if (w.answer.length >= 3 && w.answer.length <= currentGridSize) {
                pool.add(w.answer);
            }
        }));
        // Add some common words if pool is small
        ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN', 'HAD', 'HAS', 'HIM', 'HIS', 'HOW', 'INK', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'DAD', 'MOM', 'CLEAN'].forEach(w => {
            if (w.length <= currentGridSize) pool.add(w);
        });
        return Array.from(pool);
    };

    const generateGrid = useCallback((size, currentScore) => {
        // Initialize empty grid
        let newGrid = Array(size).fill(null).map(() => Array(size).fill(''));
        let placedWords = [];
        const wordPool = getWordPool(size);

        // Determine how many words to place based on size
        const numWords = Math.min(3 + Math.floor((size - 4) / 2), 6);
        setWordsToFindCount(numWords);

        // Try to place words
        for (let i = 0; i < numWords; i++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 50) {
                const word = wordPool[Math.floor(Math.random() * wordPool.length)];
                if (placedWords.some(pw => pw.word === word)) {
                    attempts++;
                    continue;
                }

                // Random direction: 0=horizontal, 1=vertical, 2=diagonal
                const dir = Math.floor(Math.random() * 3);
                const wordLen = word.length;

                let startRow, startCol;

                if (dir === 0) { // Horizontal
                    startRow = Math.floor(Math.random() * size);
                    startCol = Math.floor(Math.random() * (size - wordLen + 1));
                } else if (dir === 1) { // Vertical
                    startRow = Math.floor(Math.random() * (size - wordLen + 1));
                    startCol = Math.floor(Math.random() * size);
                } else { // Diagonal
                    startRow = Math.floor(Math.random() * (size - wordLen + 1));
                    startCol = Math.floor(Math.random() * (size - wordLen + 1));
                }

                // Check collision
                let fits = true;
                for (let j = 0; j < wordLen; j++) {
                    let r = startRow + (dir === 1 || dir === 2 ? j : 0);
                    let c = startCol + (dir === 0 || dir === 2 ? j : 0);
                    if (newGrid[r][c] !== '' && newGrid[r][c] !== word[j]) {
                        fits = false;
                        break;
                    }
                }

                if (fits) {
                    // Place word
                    for (let j = 0; j < wordLen; j++) {
                        let r = startRow + (dir === 1 || dir === 2 ? j : 0);
                        let c = startCol + (dir === 0 || dir === 2 ? j : 0);
                        newGrid[r][c] = word[j];
                    }
                    placedWords.push({ word, found: false });
                    placed = true;
                }
                attempts++;
            }
        }

        // Fill remaining spots
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (newGrid[r][c] === '') {
                    newGrid[r][c] = getRandomLetter();
                }
            }
        }

        setGrid(newGrid);
        setTargetWords(placedWords);
        setFoundWords([]);
        setSelectedCells([]);
    }, []);

    // Initial generation
    useEffect(() => {
        generateGrid(gridSize, 0);
    }, []);

    const handleCellClick = (row, col) => {
        if (isLevelingUp) return;

        soundManager.playClick();

        // Check if cell is already selected
        const index = selectedCells.findIndex(cell => cell.row === row && cell.col === col);

        if (index !== -1) {
            // Deselect if it's the last one
            if (index === selectedCells.length - 1) {
                setSelectedCells(prev => prev.slice(0, -1));
            } else {
                // Reset selection if clicking middle
                setSelectedCells([]);
            }
        } else {
            // Add to selection if adjacent
            if (selectedCells.length === 0) {
                setSelectedCells([{ row, col }]);
            } else {
                const last = selectedCells[selectedCells.length - 1];
                const isAdjacent = Math.abs(last.row - row) <= 1 && Math.abs(last.col - col) <= 1;
                if (isAdjacent) {
                    setSelectedCells(prev => [...prev, { row, col }]);
                } else {
                    // Start new selection
                    setSelectedCells([{ row, col }]);
                }
            }
        }
    };

    const checkSelection = () => {
        const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');

        // Check if it matches any target word
        const targetMatch = targetWords.find(tw => tw.word === selectedWord && !tw.found);

        if (targetMatch) {
            // Success!
            soundManager.playSuccess();
            triggerParticles(window.innerWidth / 2, window.innerHeight / 2, 'sparkle', 30);

            const newTargets = targetWords.map(tw =>
                tw.word === selectedWord ? { ...tw, found: true } : tw
            );
            setTargetWords(newTargets);
            setFoundWords(prev => [...prev, selectedWord]);
            setScore(prev => prev + (selectedWord.length * 100));
            setSelectedCells([]);

            // Check level completion
            const foundCount = newTargets.filter(t => t.found).length;
            if (foundCount >= wordsToFindCount) {
                handleLevelUp();
            }
        } else {
            // Check dictionary for bonus points
            if (dictionary.includes(selectedWord) && !foundWords.includes(selectedWord)) {
                soundManager.playSuccess();
                setScore(prev => prev + (selectedWord.length * 50)); // Half points for bonus words
                setBonusMessage(`Bonus: ${selectedWord}! +${selectedWord.length * 50}`);
                setTimeout(() => setBonusMessage(null), 2000);
                setSelectedCells([]);
            } else {
                // Wrong
                soundManager.playError();
                setSelectedCells([]);
            }
        }
    };

    const handleHint = () => {
        if (powerUps.hint <= 0) return;

        // Find an unfound target word
        const hiddenTarget = targetWords.find(tw => !tw.found);
        if (hiddenTarget) {
            // Find where this word starts in the grid
            // This is tricky because we didn't store positions. 
            // We need to search the grid for the first letter of the word and check if it forms the word.
            // SIMPLIFICATION: Just highlight the first letter of the word wherever it appears first for now, 
            // or better, store positions during generation.
            // Since we didn't store positions, let's just give a text hint for now or cheat a bit.
            // Actually, let's just reveal the first letter of the word in the "Target Words" list
            // But that's already visible as '?'...

            // Let's re-scan the grid to find the word (inefficient but works for small grids)
            // ... Or just highlight a random occurrence of the first letter of the word.

            // Better approach for now: Just highlight the first letter of the hidden word in the chip list
            // and maybe flash a random letter in the grid that matches.

            setPowerUps(prev => ({ ...prev, hint: prev.hint - 1 }));
            soundManager.playSelect();

            // Visual feedback
            setBonusMessage(`Hint: Look for "${hiddenTarget.word[0]}..."`);
            setTimeout(() => setBonusMessage(null), 3000);
        }
    };

    const handleShuffle = () => {
        if (powerUps.shuffle <= 0) return;

        setPowerUps(prev => ({ ...prev, shuffle: prev.shuffle - 1 }));
        soundManager.playSelect();

        // Reroll non-target letters
        // We need to know which cells are part of target words.
        // Since we didn't store that, we can't safely shuffle without breaking targets.
        // ALTERNATIVE: Just regenerate the whole grid but keep the SAME target words? 
        // No, that might fail placement.

        // Let's just add a "Skip Level" or "New Board" powerup instead?
        // Or "Reshuffle" which generates a NEW board with NEW words.

        generateGrid(gridSize, score);
        setBonusMessage("Realm Reshuffled!");
        setTimeout(() => setBonusMessage(null), 2000);
    };

    const handleLevelUp = () => {
        setIsLevelingUp(true);
        soundManager.playLevelComplete();

        setTimeout(() => {
            const newSize = Math.min(gridSize + 1, 10);
            setGridSize(newSize);
            setLevel(prev => prev + 1);
            generateGrid(newSize, score);
            setIsLevelingUp(false);
        }, 2000);
    };

    return (
        <div className="creative-game-container">
            <header className="creative-header">
                <button className="btn-icon" onClick={onBack}>🏠</button>
                <div className="creative-stat">
                    <span className="stat-label">Level</span>
                    <span className="stat-value">{level}</span>
                </div>
                <div className="creative-stat">
                    <span className="stat-label">Score</span>
                    <span className="stat-value">{score}</span>
                </div>
                <div className="creative-stat">
                    <span className="stat-label">Grid</span>
                    <span className="stat-value">{gridSize}x{gridSize}</span>
                </div>
            </header>

            <div className="target-words">
                {targetWords.map((tw, idx) => (
                    <div key={idx} className={`target-word-chip ${tw.found ? 'found' : ''}`}>
                        {tw.found ? tw.word : '?'.repeat(tw.word.length)}
                    </div>
                ))}
            </div>

            <div className="creative-grid-area">
                {bonusMessage && (
                    <div className="bonus-message-overlay">
                        {bonusMessage}
                    </div>
                )}

                {isLevelingUp && (
                    <div className="level-up-overlay">
                        <div className="level-up-text">Realm Expanded!</div>
                        <div className="level-up-sub">Grid size increased to {Math.min(gridSize + 1, 10)}x{Math.min(gridSize + 1, 10)}</div>
                    </div>
                )}

                <div
                    className="creative-grid"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        width: '100%',
                        maxWidth: `${gridSize * 55}px`
                    }}
                >
                    {grid.map((row, rIndex) => (
                        row.map((cell, cIndex) => {
                            const isSelected = selectedCells.some(s => s.row === rIndex && s.col === cIndex);
                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className={`grid-cell ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleCellClick(rIndex, cIndex)}
                                >
                                    {cell}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            <div className="creative-controls">
                <div className="power-ups">
                    <button
                        className="creative-btn btn-powerup"
                        onClick={handleHint}
                        disabled={powerUps.hint <= 0}
                        title="Reveal a hint"
                    >
                        💡 Hint ({powerUps.hint})
                    </button>
                    <button
                        className="creative-btn btn-powerup"
                        onClick={handleShuffle}
                        disabled={powerUps.shuffle <= 0}
                        title="New Board"
                    >
                        🔄 Reroll ({powerUps.shuffle})
                    </button>
                </div>

                <button
                    className="creative-btn btn-clear"
                    onClick={() => setSelectedCells([])}
                    disabled={selectedCells.length === 0}
                >
                    Clear
                </button>
                <button
                    className="creative-btn btn-submit"
                    onClick={checkSelection}
                    disabled={selectedCells.length < 3}
                >
                    Submit Word
                </button>
            </div>

            <div style={{ marginTop: '20px', color: '#aaa', fontSize: '0.9rem' }}>
                Current Selection: {selectedCells.map(c => grid[c.row][c.col]).join('')}
            </div>
        </div>
    );
};

export default CreativeGame;
