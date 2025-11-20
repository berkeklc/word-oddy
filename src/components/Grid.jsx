import React, { useState, useEffect } from 'react';
import FloatingLetters from './FloatingLetters';
import PowerUpBar from './PowerUpBar';
import SelectionChallenge from './ChallengeTypes/SelectionChallenge';
import ScrambledChallenge from './ChallengeTypes/ScrambledChallenge';
import MissingLettersChallenge from './ChallengeTypes/MissingLettersChallenge';
import HiddenWordChallenge from './ChallengeTypes/HiddenWordChallenge';
import TimedChallenge from './ChallengeTypes/TimedChallenge';
import './Grid.css';
import { soundManager } from '../utils/SoundManager';
import { triggerParticles } from './ParticleSystem';

const Grid = ({ level, onLevelComplete, score, onScoreUpdate, combo, onComboUpdate, inventory, onPowerUpUse }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState('');
    const [solvedWords, setSolvedWords] = useState([]);
    const [shakeActive, setShakeActive] = useState(false);
    const [showCleanseHint, setShowCleanseHint] = useState(false);
    const [bonusTime, setBonusTime] = useState(0);
    const [revealedHidden, setRevealedHidden] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const currentWord = level?.words?.[currentWordIndex];
    const totalWords = level?.words?.length || 0;
    const isComplete = solvedWords.length === totalWords;

    const challengeIcons = {
        typing: '⌨️',
        selection: '🎯',
        scrambled: '🔀',
        missing: '🕳️',
        timed: '⏱️',
        hidden: '👁️'
    };

    // Reset on level change
    useEffect(() => {
        setCurrentWordIndex(0);
        setCurrentInput('');
        setSolvedWords([]);
        setBonusTime(0);
        setRevealedHidden(false);
    }, [level]);

    const handleSuccessFeedback = () => {
        soundManager.playSuccess();
        triggerParticles(window.innerWidth / 2, window.innerHeight / 2, 'sparkle', 20);
    };

    const handleWordComplete = (skipFeedback = false) => {
        if (fadeOut) return; // Prevent double submission

        if (!skipFeedback) {
            handleSuccessFeedback();
        }

        const newSolved = [...solvedWords, currentWord];
        setSolvedWords(newSolved);
        setCurrentInput('');

        // Calculate score
        const wordScore = currentWord.answer.length * 100;
        const comboMultiplier = 1 + (combo * 0.1);
        const finalScore = Math.floor(wordScore * comboMultiplier);

        if (onScoreUpdate) onScoreUpdate(finalScore);
        if (onComboUpdate) onComboUpdate(combo + 1);

        // Move to next word or complete level
        if (currentWordIndex < totalWords - 1) {
            // Fade out current word
            setFadeOut(true);
            setTimeout(() => {
                setCurrentWordIndex(prev => prev + 1);
                setBonusTime(0);
                setRevealedHidden(false);
                setFadeOut(false);
            }, 400);
        } else {
            setTimeout(() => {
                if (onLevelComplete) onLevelComplete(500);
            }, 1000);
        }
    };

    const handleWrong = () => {
        soundManager.playError();
        setShakeActive(true);
        setTimeout(() => setShakeActive(false), 500);

        if (onScoreUpdate) onScoreUpdate(-10);
        if (onComboUpdate) onComboUpdate(0);

        // Show cleanse hint if available
        if (inventory?.clear > 0) {
            setShowCleanseHint(true);
            setTimeout(() => setShowCleanseHint(false), 3000);
        }

        setTimeout(() => setCurrentInput(''), 600);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isComplete || !currentWord) return;

            // Only handle keyboard for default/typing challenges (and timed if it defaults to typing)
            const type = currentWord.challengeType;
            if (['selection', 'scrambled', 'missing', 'hidden'].includes(type)) return;

            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                handleKeyPress(key);
            } else if (e.key === 'Backspace') {
                handleKeyPress('⌫');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isComplete, currentWord, currentInput]); // Re-bind for state

    const handleKeyPress = (key) => {
        if (isComplete || !currentWord) return;

        soundManager.playClick();

        if (key === '⌫') {
            setCurrentInput(prev => prev.slice(0, -1));
        } else if (currentInput.length < currentWord.answer.length) {
            const newInput = currentInput + key;
            setCurrentInput(newInput);

            if (newInput.length === currentWord.answer.length) {
                setTimeout(() => checkWord(newInput), 100);
            }
        }
    };

    const checkWord = (input) => {
        if (input === currentWord.answer) {
            handleWordComplete(false);
        } else {
            handleWrong();
        }
    };

    const handlePowerUpActivate = (powerUpId) => {
        const success = onPowerUpUse(powerUpId);
        if (!success) return;

        if (powerUpId === 'reveal') {
            // Vision Shard: Instant reveal for hidden words
            if (currentWord.challengeType === 'hidden') {
                setRevealedHidden(true);
                soundManager.playSuccess();
                // Check if this completes the challenge (for hidden, it usually just reveals, user still needs to type? 
                // Wait, HiddenWordChallenge auto-reveals. If we setRevealedHidden(true), it shows all letters.
                // Does it auto-complete? The component logic says:
                // if (revealed) setRevealedCount(word.answer.length);
                // It displays input boxes only when revealedCount === length.
                // So user still needs to type.
                // BUT if the user wants "instant win" with powerup?
                // The request said: "özel güç ile son harf bilinirse bölüm bitmiyor" -> "If last letter is known with special power, level doesn't end"
                // This implies they WANT it to end.
                // So let's check if we can auto-fill or just let them type.
                // For 'reveal', let's auto-fill for typing challenges.
            } else {
                // Or reveal one letter for typing
                if (currentInput.length < currentWord.answer.length) {
                    const nextLetter = currentWord.answer[currentInput.length];
                    const newInput = currentInput + nextLetter;
                    setCurrentInput(newInput);
                    soundManager.playSuccess();

                    // Check completion
                    if (newInput === currentWord.answer) {
                        setTimeout(() => handleWordComplete(false), 200);
                    }
                }
            }
        } else if (powerUpId === 'hint') {
            // Ancient Wisdom: Show next letter
            if (currentInput.length < currentWord.answer.length) {
                const nextLetter = currentWord.answer[currentInput.length];
                const newInput = currentInput + nextLetter;
                setCurrentInput(newInput);
                soundManager.playSelect();

                // Check completion
                if (newInput === currentWord.answer) {
                    setTimeout(() => handleWordComplete(false), 200);
                }
            }
        } else if (powerUpId === 'clear') {
            // Cleansing Crystal: Clear OR add time
            if (currentWord.challengeType === 'timed') {
                setBonusTime(prev => prev + 5);
                soundManager.playSuccess();
            } else {
                setCurrentInput('');
                soundManager.playClick();
            }
        }
    };

    const handleTimeUp = () => {
        handleWrong();
    };

    const renderChallenge = () => {
        const challengeType = currentWord.challengeType || 'typing';

        let challenge;
        switch (challengeType) {
            case 'selection':
                challenge = (
                    <SelectionChallenge
                        key={currentWord.id}
                        word={currentWord}
                        onComplete={handleWordComplete}
                        onCorrect={handleSuccessFeedback}
                        onWrong={handleWrong}
                    />
                );
                break;

            case 'scrambled':
                challenge = (
                    <ScrambledChallenge
                        key={currentWord.id}
                        word={currentWord}
                        onComplete={handleWordComplete}
                        onCorrect={handleSuccessFeedback}
                        onWrong={handleWrong}
                    />
                );
                break;

            case 'missing':
                challenge = (
                    <MissingLettersChallenge
                        key={currentWord.id}
                        word={currentWord}
                        onComplete={handleWordComplete}
                        onCorrect={handleSuccessFeedback}
                        onWrong={handleWrong}
                    />
                );
                break;

            case 'hidden':
                challenge = (
                    <HiddenWordChallenge
                        key={currentWord.id}
                        word={currentWord}
                        onComplete={handleWordComplete}
                        onCorrect={handleSuccessFeedback}
                        onWrong={handleWrong}
                        revealed={revealedHidden}
                    />
                );
                break;

            case 'typing':
            default:
                challenge = (
                    <>
                        <div className={`letter-boxes ${shakeActive ? 'shake' : ''}`}>
                            {Array(currentWord.answer.length).fill('').map((_, index) => (
                                <div key={index} className={`letter-box ${currentInput[index] ? 'filled' : ''}`}>
                                    {currentInput[index] || ''}
                                </div>
                            ))}
                        </div>
                        <FloatingLetters
                            key={currentWord.id}
                            word={currentWord}
                            onKeyPress={handleKeyPress}
                            disabled={isComplete}
                        />
                    </>
                );
                break;
        }

        // Wrap in timed challenge if it's specifically a 'timed' type
        if (currentWord.challengeType === 'timed') {
            return (
                <TimedChallenge
                    word={currentWord}
                    onTimeUp={handleTimeUp}
                    bonusTime={bonusTime}
                >
                    {challenge}
                </TimedChallenge>
            );
        }

        return challenge;
    };

    if (!level || !currentWord) return <div>Loading...</div>;

    return (
        <div className="grid-container">
            <div className="progress-header">
                <div className="level-title">{level.title}</div>
                <div className="progress-counter">
                    {solvedWords.length} / {totalWords} words
                </div>
            </div>

            {/* Trail of solved words */}
            <div className="word-trail">
                {level.words.map((word, index) => {
                    const isSolved = index < solvedWords.length;
                    const isCurrent = index === currentWordIndex;

                    return (
                        <div key={word.id} className="trail-container">
                            <div className={`trail-stone ${isSolved ? 'solved' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="stone-number">{isSolved ? '✓' : index + 1}</div>
                                {isCurrent && (
                                    <div className="challenge-icon">{challengeIcons[word.challengeType] || '⌨️'}</div>
                                )}
                            </div>
                            {index < level.words.length - 1 && (
                                <div className={`trail-line ${isSolved ? 'active' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Current word challenge area */}
            {!isComplete && (
                <div className={`word-input-area ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                    <div className="clue-text">{currentWord.clue}</div>

                    {renderChallenge()}
                </div>
            )}

            {/* Completion message */}
            {isComplete && (
                <div className="completion-message">
                    <div className="completion-icon">🏮</div>
                    <div className="completion-text">Path Complete!</div>
                </div>
            )}

            {showCleanseHint && (
                <div className="cleanse-hint-banner">
                    ✨ Use the Cleansing Crystal to help!
                </div>
            )}

            <PowerUpBar
                inventory={inventory}
                onUse={handlePowerUpActivate}
                selectedWordId={!isComplete && currentWord ? currentWord.id : null}
            />
        </div>
    );
};

export default Grid;
