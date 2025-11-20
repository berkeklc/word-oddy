import { useState, useEffect } from 'react'
import Grid from './components/Grid'
import StartScreen from './components/StartScreen'
import LevelComplete from './components/LevelComplete'
import StoryOverlay from './components/StoryOverlay'
import ScoreBoard from './components/ScoreBoard'
import InteractiveTutorial from './components/InteractiveTutorial'
import PowerUpShop from './components/PowerUpShop'
import LevelSelect from './components/LevelSelect'
import Profile from './components/Profile'
import ParticleSystem from './components/ParticleSystem'
import SettingsModal from './components/SettingsModal'
import Auth from './components/Auth'
import { levels } from './data/levels'
import { soundManager } from './utils/SoundManager'
import { useAuth } from './contexts/AuthContext'
import { gameProgressService } from './services/gameProgressService'
import './App.css'

function App() {
    const { user, profile, loading: authLoading, getUserId, isAnonymous } = useAuth();
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [gameState, setGameState] = useState('menu'); // menu, tutorial, story, playing, complete, level-select, profile
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [inventory, setInventory] = useState({ clear: 3 }); // Start with 3 Cleansing Crystals
    const [showSettings, setShowSettings] = useState(false);
    const [progressLoaded, setProgressLoaded] = useState(false);

    const [showTutorial, setShowTutorial] = useState(() => {
        return !localStorage.getItem('wordOdysseyTutorialComplete');
    });

    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem('wordOdysseyHighScore') || '0');
    });

    const [maxLevelReached, setMaxLevelReached] = useState(() => {
        return parseInt(localStorage.getItem('wordOdysseyMaxLevel') || '0');
    });

    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem('wordOdysseyStats');
        return saved ? JSON.parse(saved) : { gamesPlayed: 0, totalWords: 0 };
    });

    // Load progress from Supabase when user logs in (not for anonymous users)
    useEffect(() => {
        if (user && !progressLoaded && !isAnonymous) {
            loadProgressFromSupabase();
        } else if (isAnonymous && !progressLoaded) {
            // For anonymous users, just mark as loaded
            setProgressLoaded(true);
        }
    }, [user, isAnonymous]);

    // Save progress to both localStorage and Supabase
    useEffect(() => {
        localStorage.setItem('wordOdysseyStats', JSON.stringify(stats));
        // Only save to Supabase if user is logged in (not anonymous)
        if (user && !isAnonymous) {
            saveProgressToSupabase();
        }
    }, [stats, highScore, maxLevelReached, showTutorial, inventory, user, isAnonymous]);

    // Handle auth state changes - close modal when logged in
    useEffect(() => {
        if (!authLoading && user && !isAnonymous) {
            setShowAuthModal(false);
        }
    }, [user, authLoading, isAnonymous]);

    const loadProgressFromSupabase = async () => {
        try {
            const progress = await gameProgressService.getProgress(user.id);
            if (progress) {
                setHighScore(progress.high_score || 0);
                setMaxLevelReached(progress.max_level || 0);
                setStats({ gamesPlayed: progress.games_played || 0, totalWords: progress.total_words || 0 });
                setShowTutorial(!progress.tutorial_complete);
                setInventory(progress.inventory || { clear: 3 });
                setProgressLoaded(true);
            } else {
                // No progress in database, sync local storage to Supabase
                await gameProgressService.syncFromLocal(user.id);
                setProgressLoaded(true);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
            setProgressLoaded(true);
        }
    };

    const saveProgressToSupabase = async () => {
        if (!progressLoaded) return;
        try {
            await gameProgressService.saveProgress(user.id, {
                highScore,
                maxLevel: maxLevelReached,
                totalWords: stats.totalWords,
                gamesPlayed: stats.gamesPlayed,
                tutorialComplete: !showTutorial,
                inventory
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const handleAuthModalClose = () => {
        setShowAuthModal(false);
    };

    const handleOpenAuth = () => {
        setShowAuthModal(true);
    };

    const currentLevel = levels[currentLevelIndex];

    const toggleSound = () => {
        const enabled = soundManager.toggle();
        setIsSoundOn(enabled);
    };

    const handleResetProgress = () => {
        localStorage.removeItem('wordOdysseyTutorialComplete');
        localStorage.removeItem('wordOdysseyHighScore');
        localStorage.removeItem('wordOdysseyMaxLevel');
        localStorage.removeItem('wordOdysseyStats');

        setHighScore(0);
        setMaxLevelReached(0);
        setStats({ gamesPlayed: 0, totalWords: 0 });
        setShowTutorial(true);
        setInventory({ clear: 3 });
        setScore(0);
        setCurrentLevelIndex(0);
        setGameState('menu');
        setShowSettings(false);

        alert('Progress reset successfully.');
    };

    const startGame = () => {
        if (showTutorial) {
            setGameState('tutorial');
        } else {
            setCurrentLevelIndex(maxLevelReached);
            setGameState('story');
        }
    };

    const handleTutorialComplete = () => {
        localStorage.setItem('wordOdysseyTutorialComplete', 'true');
        setShowTutorial(false);
        setGameState('story');
    };

    const handleStoryContinue = () => {
        setGameState('playing');
        setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    };

    const handleScoreUpdate = (points) => {
        setScore(prev => Math.max(0, prev + points));
    };

    const handleComboUpdate = (newCombo) => {
        setCombo(newCombo);
    };

    const handleLevelComplete = (bonus) => {
        const newScore = score + bonus;
        setScore(newScore);

        if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('wordOdysseyHighScore', newScore.toString());
        }

        if (currentLevelIndex >= maxLevelReached) {
            const nextMax = Math.min(currentLevelIndex + 1, levels.length - 1);
            setMaxLevelReached(nextMax);
            localStorage.setItem('wordOdysseyMaxLevel', nextMax.toString());
        }

        setStats(prev => ({ ...prev, totalWords: prev.totalWords + levels[currentLevelIndex].words.length }));

        setGameState('complete');
    };

    const handleNextLevel = () => {
        if (currentLevelIndex < levels.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
            setGameState('story');
        } else {
            alert(`Journey Complete! You discovered the Eternal Lantern and learned your mentor's fate. Final Score: ${score}`);
            setGameState('menu');
            setCurrentLevelIndex(0);
            setScore(0);
        }
    };

    const handlePowerUpPurchase = (powerUp) => {
        if (powerUp.cost === 0 || score >= powerUp.cost) {
            if (powerUp.cost > 0) {
                setScore(prev => prev - powerUp.cost);
            }
            setInventory(prev => ({
                ...prev,
                [powerUp.id]: (prev[powerUp.id] || 0) + 1
            }));
        }
    };

    const handlePowerUpUse = (powerUpId) => {
        if (inventory[powerUpId] > 0) {
            setInventory(prev => ({
                ...prev,
                [powerUpId]: prev[powerUpId] - 1
            }));
            return true;
        }
        return false;
    };

    const handleSelectLevel = (index) => {
        setCurrentLevelIndex(index);
        setGameState('story');
    };

    if (authLoading) {
        return (
            <div className="game-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ color: '#4cc9f0', fontSize: '1.5rem' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <ParticleSystem />

            {showAuthModal && (
                <Auth onClose={handleAuthModalClose} />
            )}

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                isSoundOn={isSoundOn}
                onToggleSound={toggleSound}
                onResetProgress={handleResetProgress}
            />

            {gameState === 'menu' && (
                <StartScreen
                    onStart={startGame}
                    onLevels={() => setGameState('level-select')}
                    onProfile={() => setGameState('profile')}
                    onSettings={() => setShowSettings(true)}
                    onAuth={handleOpenAuth}
                />
            )}

            {gameState === 'level-select' && (
                <LevelSelect
                    levels={levels}
                    maxLevelReached={maxLevelReached}
                    onSelectLevel={handleSelectLevel}
                    onBack={() => setGameState('menu')}
                />
            )}

            {gameState === 'profile' && (
                <Profile
                    stats={{ ...stats, highScore, maxLevel: maxLevelReached }}
                    onBack={() => setGameState('menu')}
                    onOpenAuth={handleOpenAuth}
                />
            )}

            {gameState === 'tutorial' && (
                <InteractiveTutorial onComplete={handleTutorialComplete} />
            )}

            {gameState === 'story' && (
                <StoryOverlay level={currentLevel} onContinue={handleStoryContinue} />
            )}

            {(gameState === 'playing' || gameState === 'complete') && (
                <>
                    <header className="game-header">
                        <div className="header-left">
                            <button className="btn-icon" onClick={() => setGameState('menu')}>🏠</button>
                        </div>
                        <h1 className="title">Word <span className="highlight">Odyssey</span></h1>
                        <div className="header-controls">
                            <button className="btn-icon" onClick={() => setShowSettings(true)}>
                                ⚙️
                            </button>
                            <div className="stats">
                                <span>Level {currentLevel.id}</span>
                            </div>
                        </div>
                    </header>

                    <ScoreBoard score={score} highScore={highScore} combo={combo} level={currentLevel.id} />

                    <main className="game-board">
                        <Grid
                            key={`${currentLevel.id}-${gameState}`}
                            level={currentLevel}
                            onLevelComplete={handleLevelComplete}
                            score={score}
                            onScoreUpdate={handleScoreUpdate}
                            combo={combo}
                            onComboUpdate={handleComboUpdate}
                            inventory={inventory}
                            onPowerUpUse={handlePowerUpUse}
                        />
                    </main>

                    <PowerUpShop
                        score={score}
                        onPurchase={handlePowerUpPurchase}
                        inventory={inventory}
                    />

                    {gameState === 'complete' && (
                        <LevelComplete
                            onNextLevel={handleNextLevel}
                            score={score}
                            currentLevel={currentLevelIndex + 1}
                            totalLevels={levels.length}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default App
