import React, { useState, useEffect } from 'react';
import './TimedChallenge.css';

const TimedChallenge = ({ word, children, onComplete, onTimeUp, bonusTime = 0 }) => {
    const timeLimit = (word.timeLimit || word.config?.timeLimit || 15) + bonusTime;

    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    if (onTimeUp) onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, onTimeUp]);

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

            {timeLeft === 0 && (
                <div className="time-up-message">
                    <div className="time-up-icon">⏰</div>
                    <div className="time-up-text">Time's Up!</div>
                </div>
            )}
        </div>
    );
};

export default TimedChallenge;
