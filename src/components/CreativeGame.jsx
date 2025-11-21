import React, { useState, useEffect, useCallback } from 'react';
import { levels } from '../data/levels';
import { dictionary } from '../data/dictionary';
import { soundManager } from '../utils/SoundManager';
import { triggerParticles } from './ParticleSystem';
import { useAuth } from '../contexts/AuthContext';
import { gameProgressService } from '../services/gameProgressService';
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
    const { user, isAnonymous } = useAuth();

    // Load saved progress from localStorage
    const [gridSize, setGridSize] = useState(() => {
        return parseInt(localStorage.getItem('creativeGridSize') || '4');
    });
    const [grid, setGrid] = useState([]);
    const [targetWords, setTargetWords] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [score, setScore] = useState(() => {
        return parseInt(localStorage.getItem('creativeHighScore') || '0');
    });
    const [level, setLevel] = useState(() => {
        return parseInt(localStorage.getItem('creativeMaxLevel') || '1');
    });
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem('creativeHighScore') || '0');
    });
    const [maxLevel, setMaxLevel] = useState(() => {
        return parseInt(localStorage.getItem('creativeMaxLevel') || '1');
    });
    const [isLevelingUp, setIsLevelingUp] = useState(false);
    const [wordsToFindCount, setWordsToFindCount] = useState(3);
    const [bonusMessage, setBonusMessage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Power-up costs
    const HINT_COST = 100;
    const REROLL_COST = 200;

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
        generateGrid(gridSize, score);
    }, []);

    // Save progress to localStorage whenever score or level changes
    useEffect(() => {
        localStorage.setItem('creativeHighScore', Math.max(score, highScore).toString());
        localStorage.setItem('creativeMaxLevel', Math.max(level, maxLevel).toString());
        localStorage.setItem('creativeGridSize', gridSize.toString());

        // Update high score and max level
        if (score > highScore) {
            setHighScore(score);
        }
        if (level > maxLevel) {
            setMaxLevel(level);
        }
    }, [score, level, gridSize]);

    //Save to Supabase when user is logged in
    useEffect(() => {
        if (user && !isAnonymous && (score > 0 || level > 1)) {
            const saveToSupabase = async () => {
                try {
                    await gameProgressService.saveProgress(user.id, {
                        creativeHighScore: Math.max(score, highScore),
                        creativeMaxLevel: Math.max(level, maxLevel)
                    });
                } catch (error) {
                    console.error('Error saving creative progress to Supabase:', error);
                }
            };
            saveToSupabase();
        }
    }, [score, level, user, isAnonymous]);


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

    const handleMouseDown = (row, col) => {
        if (isLevelingUp) return;
        setIsDragging(true);
        setSelectedCells([{ row, col }]);
        soundManager.playClick();
    };

    const handleMouseEnter = (row, col) => {
        if (!isDragging || isLevelingUp) return;

        const alreadySelected = selectedCells.some(s => s.row === row && s.col === col);
        if (alreadySelected) {
            // If we drag back to the previous cell, deselect the current last one
            if (selectedCells.length > 1 && selectedCells[selectedCells.length - 2].row === row && selectedCells[selectedCells.length - 2].col === col) {
                setSelectedCells(prev => prev.slice(0, -1));
            }
            return;
        }

        if (selectedCells.length > 0) {
            const last = selectedCells[selectedCells.length - 1];
            const isAdjacent = Math.abs(last.row - row) <= 1 && Math.abs(last.col - col) <= 1;
            if (isAdjacent) {
                setSelectedCells(prev => [...prev, { row, col }]);
                soundManager.playClick(); // Play sound for each new cell added during drag
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Auto-submit if we have a valid selection (at least 3 letters for a word)
        if (selectedCells.length >= 3) {
            checkSelection();
        } else {
            // Clear selection if it's too short to be a word
            setSelectedCells([]);
        }
    };

    // Add a global mouseup listener to handle cases where mouseup happens outside the grid
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, selectedCells]); // Depend on isDragging and selectedCells to ensure handleMouseUp has latest state

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
        if (score < HINT_COST) {
            setBonusMessage(`❌ Need ${HINT_COST} points for a hint!`);
            setTimeout(() => setBonusMessage(null), 2000);
            soundManager.playError();
            return;
        }

        // Find an unfound target word
        const hiddenTarget = targetWords.find(tw => !tw.found);
        if (hiddenTarget) {
            setScore(prev => prev - HINT_COST);
            soundManager.playSelect();
            triggerParticles(window.innerWidth / 2, 100, 'sparkle', 15);

            // Visual feedback - reveal first 2 letters
            const hintText = hiddenTarget.word.substring(0, 2) + '...';
            setBonusMessage(`💡 Hint: ${hintText} (-${HINT_COST})`);
            setTimeout(() => setBonusMessage(null), 3000);
        }
    };

    const handleShuffle = () => {
        if (score < REROLL_COST) {
            setBonusMessage(`❌ Need ${REROLL_COST} points to reroll!`);
            setTimeout(() => setBonusMessage(null), 2000);
            soundManager.playError();
            return;
        }

        setScore(prev => prev - REROLL_COST);
        soundManager.playSelect();
        triggerParticles(window.innerWidth / 2, window.innerHeight / 2, 'sparkle', 25);

        generateGrid(gridSize, score - REROLL_COST);
        setBonusMessage(`🔄 Realm Reshuffled! (-${REROLL_COST})`);
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
                                    onMouseDown={() => handleMouseDown(rIndex, cIndex)}
                                    onMouseEnter={() => handleMouseEnter(rIndex, cIndex)}
                                    onMouseUp={handleMouseUp}
                                    style={{ userSelect: 'none', cursor: 'pointer' }}
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
                        disabled={score < HINT_COST}
                        title={`Reveal hint (Cost: ${HINT_COST} points)`}
                    >
                        💡 Hint ({HINT_COST})
                    </button>
                    <button
                        className="creative-btn btn-powerup"
                        onClick={handleShuffle}
                        disabled={score < REROLL_COST}
                        title={`New board (Cost: ${REROLL_COST} points)`}
                    >
                        🔄 Reroll ({REROLL_COST})
                    </button>
                </div>

                <button
                    className="creative-btn btn-clear"
                    onClick={() => setSelectedCells([])}
                    disabled={selectedCells.length === 0}
                >
                    Clear Selection
                </button>
            </div>

            <div style={{ marginTop: '20px', color: '#aaa', fontSize: '0.9rem' }}>
                Current Selection: {selectedCells.map(c => grid[c.row][c.col]).join('')}
            </div>
        </div>
    );
};

export default CreativeGame;
