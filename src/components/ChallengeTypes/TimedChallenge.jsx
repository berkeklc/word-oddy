import React, { useState, useEffect } from 'react';
import './TimedChallenge.css';

const TimedChallenge = ({ word, children, onComplete, onTimeUp, bonusTime = 0, onRetry }) => {
    const timeLimit = (word.timeLimit || word.config?.timeLimit || 15) + bonusTime;

    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [isRunning, setIsRunning] = useState(true);
    const [showRetry, setShowRetry] = useState(false);

    // Reset timer when bonusTime changes
    useEffect(() => {
        if (bonusTime > 0) {
            setTimeLeft(prev => prev + bonusTime);
        }
    }, [bonusTime]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    setShowRetry(true);
                    if (onTimeUp) onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, onTimeUp]);

    const handleRetry = () => {
        setTimeLeft(word.timeLimit || word.config?.timeLimit || 15);
        setIsRunning(true);
        setShowRetry(false);
        if (onRetry) onRetry();
    };

    const progress = (timeLeft / timeLimit) * 100;
    const isUrgent = timeLeft <= 5;

    return (
        <div className="timed-challenge">
            <div className={`timer-display ${isUrgent ? 'urgent' : ''}`}>
                <div className="timer-icon">⏱️</div>
                <div className="timer-value">{timeLeft}s</div>
            </div>

            <div className="timer-bar">
                <div
                    className={`timer-fill ${isUrgent ? 'urgent' : ''}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {timeLeft > 0 && children}

            {showRetry && (
                <div className="time-up-overlay">
                    <div className="time-up-content">
                        <div className="time-up-icon">⏰</div>
                        <div className="time-up-text">Time's Up!</div>
                        <button className="btn-retry" onClick={handleRetry}>
                            🔄 Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimedChallenge;
