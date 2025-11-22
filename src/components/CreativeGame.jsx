import React, { useState, useEffect, useCallback } from 'react';
import { levels } from '../data/levels';
import { dictionary } from '../data/dictionary';
import { soundManager } from '../utils/SoundManager';
import { triggerParticles } from './ParticleSystem';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { gameProgressService } from '../services/gameProgressService';
import ComboDisplay from './ComboDisplay';
import PowerUpShop from './PowerUpShop';
import { bonusTypes } from '../data/bonusTypes';
import { powerUps } from '../data/powerUps';
import './CreativeGame.css';

// Helper to get random letters based on weighted frequency
const getRandomLetter = (language = 'en') => {
    const weights = language === 'en' ? {
        'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3,
        'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8, 'U': 2.8, 'M': 2.4,
        'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.5, 'V': 1.0,
        'K': 0.8, 'J': 0.15, 'X': 0.15, 'Q': 0.10, 'Z': 0.07
    } : {
        'A': 11.9, 'E': 8.9, 'İ': 8.6, 'N': 7.4, 'R': 6.7, 'L': 5.9, 'I': 5.1,
        'D': 4.7, 'K': 4.5, 'M': 3.7, 'U': 3.2, 'Y': 3.2, 'T': 3.0, 'S': 3.0,
        'B': 2.8, 'O': 2.4, 'Ü': 1.8, 'Ş': 1.7, 'Z': 1.5, 'G': 1.3, 'Ç': 1.2,
        'H': 1.2, 'V': 0.9, 'C': 0.9, 'Ö': 0.7, 'P': 0.7, 'F': 0.4, 'J': 0.03, 'Ğ': 1.1
    };

    let sum = 0;
    const r = Math.random() * 100;

    for (let char in weights) {
        sum += weights[char];
        if (r <= sum) return char;
    }
    return language === 'en' ? 'E' : 'A'; // Fallback
};

const CreativeGame = ({ onBack }) => {
    const { user, isAnonymous, linkAccount } = useAuth();
    const { language } = useLanguage();
    const t = translations[language];

    // Load saved progress from localStorage
    const [gridSize, setGridSize] = useState(() => {
        const saved = parseInt(localStorage.getItem('creativeGridSize'));
        return (saved && !isNaN(saved) && saved >= 3) ? saved : 4;
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
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(() => {
        return parseInt(localStorage.getItem('creativeMaxCombo') || '0');
    });
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('creativeInventory');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with starter items
        const initial = {};
        powerUps.forEach(pu => {
            initial[pu.id] = pu.starterAmount || 0;
        });
        return initial;
    });
    const [showOracleReveal, setShowOracleReveal] = useState(false);
    const [highlightedCells, setHighlightedCells] = useState([]);

    // Power-up costs
    const HINT_COST = 100;
    const REROLL_COST = 200;

    // Pool of words to choose from
    const getWordPool = (currentGridSize) => {
        const pool = new Set();
        // Use current language levels
        const currentLevels = levels[language] || levels['en'];
        currentLevels.forEach(l => l.words.forEach(w => {
            if (w.answer.length >= 3 && w.answer.length <= currentGridSize) {
                pool.add(w.answer);
            }
        }));

        // Add some common words if pool is small
        const commonWords = language === 'en'
            ? ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN', 'HAD', 'HAS', 'HIM', 'HIS', 'HOW', 'INK', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'DAD', 'MOM', 'CLEAN']
            : ['VE', 'BİR', 'BU', 'NE', 'DE', 'DA', 'BEN', 'SEN', 'O', 'BİZ', 'SİZ', 'ONLAR', 'VAR', 'YOK', 'EVET', 'HAYIR', 'AMA', 'İÇİN', 'İLE', 'GİBİ', 'KİM', 'NE', 'NASIL', 'NEDEN', 'ZAMAN', 'ŞİMDİ', 'SONRA', 'ÖNCE', 'BUGÜN', 'YARIN', 'DÜN'];

        commonWords.forEach(w => {
            if (w.length <= currentGridSize) pool.add(w);
        });
        return Array.from(pool);
    };

    // ... imports

    const generateGrid = useCallback((size, currentScore) => {
        console.log('generateGrid called with size:', size, 'score:', currentScore);
        try {
            // Initialize empty grid with objects
            let newGrid = Array(size).fill(null).map(() => Array(size).fill(null));
            let placedWords = [];

            if (!levels || !levels[language]) {
                console.error('Levels data missing in generateGrid');
                throw new Error('Levels data missing');
            }
            console.log('Levels data found for language:', language);

            const wordPool = getWordPool(size);
            console.log('Word pool size:', wordPool.length);

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
                        if (newGrid[r][c] !== null && newGrid[r][c].letter !== word[j]) {
                            fits = false;
                            break;
                        }
                    }

                    if (fits) {
                        // Place word
                        for (let j = 0; j < wordLen; j++) {
                            let r = startRow + (dir === 1 || dir === 2 ? j : 0);
                            let c = startCol + (dir === 0 || dir === 2 ? j : 0);
                            newGrid[r][c] = {
                                letter: word[j],
                                bonus: null,
                                id: `cell-${r}-${c}-${Date.now()}`,
                                isTarget: true
                            };
                        }
                        placedWords.push({
                            word,
                            found: false,
                            startRow,
                            startCol,
                            direction: dir
                        });
                        placed = true;
                    }
                    attempts++;
                }
            }

            // Fill remaining spots and add bonuses
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (newGrid[r][c] === null) {
                        // Chance for bonus
                        let bonus = null;
                        if (Math.random() < 0.15) { // 15% chance for bonus
                            const rand = Math.random();
                            if (rand < 0.4) bonus = 'giftbox';
                            else if (rand < 0.6) bonus = 'rocket_h';
                            else if (rand < 0.8) bonus = 'rocket_v';
                            else if (rand < 0.95) bonus = 'bomb';
                            else bonus = 'rainbow';
                        }

                        newGrid[r][c] = {
                            letter: getRandomLetter(language),
                            bonus: bonus,
                            id: `cell-${r}-${c}-${Date.now()}`,
                            isTarget: false
                        };
                    }
                }
            }

            setGrid(newGrid);
            setTargetWords(placedWords);
            setFoundWords([]);
            setSelectedCells([]);
            console.log('Grid generated successfully');
        } catch (error) {
            console.error('Error generating grid:', error);
            // Fallback to simple grid to prevent empty screen
            console.log('Generating fallback grid...');
            const fallbackGrid = Array(size).fill(null).map((_, r) =>
                Array(size).fill(null).map((_, c) => ({
                    letter: getRandomLetter(language),
                    bonus: null,
                    id: `fallback-${r}-${c}`,
                    isTarget: false
                }))
            );
            setGrid(fallbackGrid);
            console.log('Fallback grid set');
        }
    }, []);

    // Initial generation
    useEffect(() => {
        console.log('Initial useEffect calling generateGrid');
        generateGrid(gridSize, score);
    }, [language]); // Regenerate when language changes

    // Persistence
    useEffect(() => {
        localStorage.setItem('creativeGridSize', gridSize.toString());
        localStorage.setItem('creativeHighScore', highScore.toString());
        localStorage.setItem('creativeMaxLevel', maxLevel.toString());
        localStorage.setItem('creativeMaxCombo', maxCombo.toString());
        localStorage.setItem('creativeInventory', JSON.stringify(inventory));
    }, [gridSize, highScore, maxLevel, maxCombo, inventory]);

    // Bonus Effect Handlers
    const activateGiftBox = () => {
        const rewards = [
            { type: 'score', value: 500, msg: '+500 Points!' },
            { type: 'score', value: 1000, msg: '+1000 Points!' },
            { type: 'powerup', id: 'hint', msg: '+1 Hint!' },
            { type: 'powerup', id: 'oracle', msg: '+1 Oracle!' }
        ];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        if (reward.type === 'score') {
            setScore(prev => prev + reward.value);
        } else {
            setInventory(prev => ({
                ...prev,
                [reward.id]: (prev[reward.id] || 0) + 1
            }));
        }
        setBonusMessage(`🎁 The spirits grant you a boon! ${reward.msg}`);
        setTimeout(() => setBonusMessage(null), 2000);
    };

    const activateRocket = (isVertical, row, col) => {
        setGrid(prev => {
            const newGrid = prev.map(r => [...r]);
            const size = newGrid.length;

            if (isVertical) {
                // Shuffle column (only non-target cells)
                const colIndices = [];
                const colLetters = [];

                for (let r = 0; r < size; r++) {
                    if (!newGrid[r][col].isTarget) {
                        colIndices.push(r);
                        colLetters.push(newGrid[r][col].letter);
                    }
                }

                // Shuffle
                for (let i = colLetters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [colLetters[i], colLetters[j]] = [colLetters[j], colLetters[i]];
                }

                // Put back
                colIndices.forEach((r, i) => {
                    newGrid[r][col].letter = colLetters[i];
                });

                setBonusMessage('🌪️ A gust of wind clears the path!');
            } else {
                // Shuffle row (only non-target cells)
                const rowIndices = [];
                const rowLetters = [];

                for (let c = 0; c < size; c++) {
                    if (!newGrid[row][c].isTarget) {
                        rowIndices.push(c);
                        rowLetters.push(newGrid[row][c].letter);
                    }
                }

                // Shuffle
                for (let i = rowLetters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [rowLetters[i], rowLetters[j]] = [rowLetters[j], rowLetters[i]];
                }

                // Put back
                rowIndices.forEach((c, i) => {
                    newGrid[row][c].letter = rowLetters[i];
                });

                setBonusMessage('🌪️ A gust of wind clears the path!');
            }
            return newGrid;
        });
        setTimeout(() => setBonusMessage(null), 2000);
    };

    const activateBomb = (row, col) => {
        setGrid(prev => {
            const newGrid = prev.map(r => [...r]);
            const size = newGrid.length;
            const letters = [];
            const positions = [];

            // Collect 3x3 area (only non-target cells)
            for (let r = Math.max(0, row - 1); r <= Math.min(size - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(size - 1, col + 1); c++) {
                    if (!newGrid[r][c].isTarget) {
                        letters.push(newGrid[r][c].letter);
                        positions.push({ r, c });
                    }
                }
            }

            // Shuffle
            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [letters[i], letters[j]] = [letters[j], letters[i]];
            }

            // Put back
            positions.forEach((pos, i) => {
                newGrid[pos.r][pos.c].letter = letters[i];
            });

            return newGrid;
        });
        setBonusMessage('� The rune explodes with power!');
        setTimeout(() => setBonusMessage(null), 2000);
    };

    const checkSelection = () => {
        const selectedWord = selectedCells.map(cell => {
            const gridCell = grid[cell.row][cell.col];
            if (gridCell.bonus === 'rainbow') return '.';
            return gridCell.letter;
        }).join('');

        let targetMatch = null;
        if (selectedWord.includes('.')) {
            const regex = new RegExp(`^${selectedWord}$`);
            targetMatch = targetWords.find(tw => regex.test(tw.word) && !tw.found);
        } else {
            targetMatch = targetWords.find(tw => tw.word === selectedWord && !tw.found);
        }

        if (targetMatch) {
            // Found a target word - big points!
            soundManager.playSuccess();
            triggerParticles(window.innerWidth / 2, window.innerHeight / 2, 'sparkle', 30);

            const newTargets = targetWords.map(tw =>
                tw.word === targetMatch.word ? { ...tw, found: true } : tw
            );
            setTargetWords(newTargets);
            setFoundWords(prev => [...prev, targetMatch.word]);
            setScore(prev => prev + (targetMatch.word.length * 100));
            setSelectedCells([]);

            // Increase combo
            const newCombo = combo + 1;
            setCombo(newCombo);

            // Check for bonuses
            let gridChanged = false;
            const newGrid = grid.map(r => [...r]);
            selectedCells.forEach((cell, index) => {
                const gridCell = newGrid[cell.row][cell.col];
                if (gridCell.bonus) {
                    if (gridCell.bonus === 'gift') activateGiftBox();
                    else if (gridCell.bonus === 'rainbow') {
                        // Rainbow bonus consumes itself and takes the letter from the found word
                        newGrid[cell.row][cell.col] = {
                            ...gridCell,
                            bonus: null,
                            letter: targetMatch.word[index]
                        };
                    }
                    else if (gridCell.bonus === 'rocket_h') activateRocket(false, cell.row, cell.col);
                    else if (gridCell.bonus === 'rocket_v') activateRocket(true, cell.row, cell.col);
                    else if (gridCell.bonus === 'bomb') activateBomb(cell.row, cell.col);

                    newGrid[cell.row][cell.col] = { ...gridCell, bonus: null };
                    gridChanged = true;
                }
            });
            if (gridChanged) setGrid(newGrid);

            // Auto-activate oracle at 7 combo
            if (newCombo === 7 && inventory.oracle > 0) {
                activateOracle();
            }

            // Check level completion
            const foundCount = newTargets.filter(t => t.found).length;
            if (foundCount >= wordsToFindCount) {
                handleLevelUp();
            }
        } else if (!targetMatch && selectedWord.length >= 3) {
            // Check if it's a valid dictionary word (no wildcards for dictionary)
            if (!selectedWord.includes('.')) {
                const currentDict = dictionary[language] || dictionary['en'];
                const isValidWord = currentDict.includes(selectedWord);

                if (isValidWord && !foundWords.includes(selectedWord)) {
                    // Found a bonus word from the dictionary!
                    soundManager.playClick();
                    triggerParticles(window.innerWidth / 2, window.innerHeight / 2, 'sparkle', 15);

                    setFoundWords(prev => [...prev, selectedWord]);
                    const bonusPoints = selectedWord.length * 25; // Less points than target words
                    setScore(prev => prev + bonusPoints);
                    setSelectedCells([]);

                    // Show feedback
                    setBonusMessage(`✨ +${bonusPoints} Bonus Word!`);
                    setTimeout(() => setBonusMessage(null), 1500);

                    // Small combo boost
                    setCombo(prev => prev + 1);
                } else {
                    // Wrong - reset combo
                    soundManager.playError();
                    setSelectedCells([]);
                    setCombo(0);
                }
            } else {
                // Wrong - reset combo
                soundManager.playError();
                setSelectedCells([]);
                setCombo(0);
            }
        } else {
            // Wrong - reset combo
            soundManager.playError();
            setSelectedCells([]);
            setCombo(0);
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

    const activateOracle = () => {
        if (!inventory.oracle || inventory.oracle <= 0) return;

        // Reduce inventory
        setInventory(prev => ({
            ...prev,
            oracle: prev.oracle - 1
        }));

        // Calculate positions of all unfound target words in the grid
        const cellsToHighlight = [];
        targetWords.forEach(targetWord => {
            if (!targetWord.found && targetWord.startRow !== undefined) {
                const wordLen = targetWord.word.length;
                const { startRow, startCol, direction } = targetWord;

                for (let j = 0; j < wordLen; j++) {
                    const r = startRow + (direction === 1 || direction === 2 ? j : 0);
                    const c = startCol + (direction === 0 || direction === 2 ? j : 0);
                    cellsToHighlight.push({ row: r, col: c });
                }
            }
        });

        // Highlight the cells
        setHighlightedCells(cellsToHighlight);
        soundManager.playSuccess();
        triggerParticles(window.innerWidth / 2, window.innerHeight / 2, 'sparkle', 50);

        // Remove highlight after 1 second
        setTimeout(() => {
            setHighlightedCells([]);
        }, 1000);

        setBonusMessage('⚡ Word Oracle Activated! ⚡');
        setTimeout(() => setBonusMessage(null), 2000);
    };

    const handleMouseDown = (row, col) => {
        setIsDragging(true);
        setSelectedCells([{ row, col }]);
        soundManager.playClick();
    };

    const handleMouseEnter = (row, col) => {
        if (isDragging) {
            // Check if cell is already selected
            if (selectedCells.some(cell => cell.row === row && cell.col === col)) {
                // If we're moving back to the previous cell, remove the last one (undo)
                if (selectedCells.length > 1) {
                    const lastCell = selectedCells[selectedCells.length - 1];
                    const prevCell = selectedCells[selectedCells.length - 2];
                    if (prevCell.row === row && prevCell.col === col) {
                        setSelectedCells(prev => prev.slice(0, -1));
                        soundManager.playClick();
                        return;
                    }
                }
                return;
            }

            // Check adjacency
            const lastCell = selectedCells[selectedCells.length - 1];
            if (Math.abs(lastCell.row - row) <= 1 && Math.abs(lastCell.col - col) <= 1) {
                setSelectedCells(prev => [...prev, { row, col }]);
                soundManager.playClick();
            }
        }
    };

    const handleCellClick = (row, col) => {
        // Optional: Handle click as start of selection or toggle
        if (!isDragging) {
            setSelectedCells([{ row, col }]);
            soundManager.playClick();
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

    const handlePowerUpPurchase = (powerUp) => {
        if (score < powerUp.cost) {
            soundManager.playError();
            return;
        }

        setScore(prev => prev - powerUp.cost);
        setInventory(prev => ({
            ...prev,
            [powerUp.id]: (prev[powerUp.id] || 0) + 1
        }));

        soundManager.playSelect();
        setBonusMessage(`✨ Purchased ${powerUp.name}!`);
        setTimeout(() => setBonusMessage(null), 2000);
    };

    const handlePowerUpUse = (powerUpId) => {
        if (!inventory[powerUpId] || inventory[powerUpId] <= 0) {
            return false;
        }

        if (powerUpId === 'oracle') {
            activateOracle();
            return true;
        }

        return false;
    };

    // Registration Reminder State
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regError, setRegError] = useState(null);
    const [regSuccess, setRegSuccess] = useState(false);
    // Removed duplicate useAuth call here

    const handleLevelUp = () => {
        setIsLevelingUp(true);
        soundManager.playLevelComplete();

        setTimeout(() => {
            const newSize = Math.min(gridSize + 1, 10);
            setGridSize(newSize);
            setLevel(prev => {
                const newLevel = prev + 1;
                // Check for registration reminder every 3 levels if anonymous
                if (isAnonymous && newLevel % 3 === 0) {
                    setShowRegistrationModal(true);
                }
                return newLevel;
            });
            generateGrid(newSize, score);
            setIsLevelingUp(false);
        }, 2000);
    };

    const handleLinkAccount = async (e) => {
        e.preventDefault();
        setRegError(null);

        if (regPassword.length < 6) {
            setRegError('Password must be at least 6 characters');
            return;
        }

        const { error } = await linkAccount(regEmail, regPassword, regUsername);
        if (error) {
            setRegError(error.message);
        } else {
            setRegSuccess(true);
            soundManager.playSuccess();
            setTimeout(() => {
                setShowRegistrationModal(false);
                setRegSuccess(false);
            }, 2000);
        }
    };

    return (
        <div className="creative-game-container">
            <header className="creative-header">
                <button className="btn-icon" onClick={onBack}>🏠</button>
                <div className="creative-stat">
                    <span className="stat-label">{t.level}</span>
                    <span className="stat-value">{level}</span>
                </div>
                <div className="creative-stat">
                    <span className="stat-label">{t.score}</span>
                    <span className="stat-value">{score}</span>
                </div>
                <div className="creative-stat">
                    <span className="stat-label">Grid</span>
                    <span className="stat-value">{gridSize}x{gridSize}</span>
                </div>
            </header>

            {/* Combo Display */}
            <ComboDisplay combo={combo} maxCombo={maxCombo} />

            <div className="target-words-container">
                <div className="target-words-header">
                    <span className="header-icon">🎯</span>
                    <span className="header-text">{t.words}</span>
                    <span className="header-count">{targetWords.filter(tw => tw.found).length}/{targetWords.length}</span>
                </div>
                <div className="target-words">
                    {targetWords.map((tw, idx) => (
                        <div
                            key={idx}
                            className={`target-word-chip ${tw.found ? 'found' : ''} ${showOracleReveal ? 'oracle-reveal' : ''}`}
                        >
                            {showOracleReveal || tw.found ? tw.word : '?'.repeat(tw.word.length)}
                        </div>
                    ))}
                </div>
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

                {/* Registration Reminder Modal */}
                {showRegistrationModal && (
                    <div className="modal-overlay">
                        <div className="modal-content registration-modal">
                            <h2>🛡️ Save Your Progress?</h2>
                            <p>You're doing great! Create an account to save your scores and stats forever.</p>

                            {regSuccess ? (
                                <div className="success-message">
                                    ✅ Account Saved Successfully!
                                </div>
                            ) : (
                                <form onSubmit={handleLinkAccount}>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={regUsername}
                                        onChange={(e) => setRegUsername(e.target.value)}
                                        required
                                        className="modal-input"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                        className="modal-input"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password (min 6 chars)"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                        className="modal-input"
                                    />
                                    {regError && <div className="error-message">{regError}</div>}

                                    <div className="modal-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setShowRegistrationModal(false)}>
                                            Maybe Later
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Save Account
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
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
                    {grid.length === 0 && <div style={{ color: 'white', padding: '20px' }}>Grid is empty! Size: {gridSize}</div>}
                    {grid.map((row, rIndex) => (
                        row.map((cell, cIndex) => {
                            const isSelected = selectedCells.some(s => s.row === rIndex && s.col === cIndex);
                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className={`grid-cell ${isSelected ? 'selected' : ''} ${highlightedCells.some(h => h.row === rIndex && h.col === cIndex) ? 'oracle-highlight' : ''} ${cell.bonus ? `bonus-cell bonus-${cell.bonus}` : ''}`}
                                    onClick={() => handleCellClick(rIndex, cIndex)}
                                    onMouseDown={() => handleMouseDown(rIndex, cIndex)}
                                    onMouseEnter={() => handleMouseEnter(rIndex, cIndex)}
                                    onMouseUp={handleMouseUp}
                                    style={{ userSelect: 'none', cursor: 'pointer' }}
                                >
                                    {cell.letter}
                                    {cell.bonus && (
                                        <div className="bonus-icon-wrapper">
                                            <img
                                                src={bonusTypes.find(b => b.id === cell.bonus)?.icon}
                                                alt={cell.bonus}
                                                className="bonus-icon-img"
                                            />
                                        </div>
                                    )}
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
                    {inventory.oracle > 0 && (
                        <button
                            className="creative-btn btn-oracle"
                            onClick={activateOracle}
                            title="Reveal all words for 1 second!"
                        >
                            ⚡ Oracle ({inventory.oracle})
                        </button>
                    )}
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
                Current Selection: {selectedCells.map(c => grid[c.row] && grid[c.row][c.col] ? grid[c.row][c.col].letter : '').join('')}
            </div>

            {/* Power-Up Shop */}
            <PowerUpShop
                score={score}
                onPurchase={handlePowerUpPurchase}
                inventory={inventory}
            />
        </div>
    );
};

export default CreativeGame;
