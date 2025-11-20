import React, { useEffect } from 'react';
import './LevelComplete.css';
import { triggerParticles } from './ParticleSystem';

const LevelComplete = ({ onNextLevel, score, currentLevel, totalLevels }) => {
    const getRank = (s) => {
        if (s > 2000) return 'S';
        if (s > 1500) return 'A';
        if (s > 1000) return 'B';
        return 'C';
    };

    const rank = getRank(score);
    const wordsCompleted = 5; // Could pass as prop
    const isLastLevel = currentLevel >= totalLevels;

    useEffect(() => {
        // Trigger confetti burst on mount
        const timer = setInterval(() => {
            triggerParticles(
                window.innerWidth / 2 + (Math.random() * 200 - 100),
                window.innerHeight / 2 + (Math.random() * 200 - 100),
                'sparkle',
                15
            );
        }, 300);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="level-complete-overlay">
            <div className="level-complete-card">
                <div className="complete-icon">
                    {isLastLevel ? '🏆' : '✨'}
                </div>

                <h2 className="complete-title">
                    {isLastLevel ? 'All Levels Complete!' : 'Level Complete!'}
                </h2>

                <div className="complete-stats">
                    <div className="stat-item">
                        <div className="stat-value">{wordsCompleted}</div>
                        <div className="stat-label">Words</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{score}</div>
                        <div className="stat-label">Score</div>
                    </div>
                </div>

                <div className="rank-badge">RANK {rank}</div>

                <button className="btn-next" onClick={onNextLevel}>
                    {isLastLevel ? 'Play Again' : 'Next Level →'}
                </button>
            </div>
        </div>
    );
};

export default LevelComplete;
