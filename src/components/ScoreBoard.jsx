import React, { useState, useEffect } from 'react';
import './ScoreBoard.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const ScoreBoard = ({ score, highScore, combo, level }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let start = displayScore;
        const end = score;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setDisplayScore(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    return (
        <div className="scoreboard">
            <div className="score-group">
                <div className="score-container">
                    <span className="score-label">{t.essence}</span>
                    <span className="score-value">{displayScore.toLocaleString()}</span>
                </div>
                {highScore > 0 && (
                    <div className="highscore-container">
                        <span className="score-label">{t.best}</span>
                        <span className="highscore-value">{highScore.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {combo > 1 && (
                <div className="combo-container">
                    <div className="combo-value">{combo}x</div>
                    <div className="combo-label">{t.combo}</div>
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;
