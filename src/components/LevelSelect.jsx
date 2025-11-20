import React from 'react';
import './LevelSelect.css';

const LevelSelect = ({ levels, maxLevelReached, onSelectLevel, onBack }) => {
    return (
        <div className="level-select-container">
            <header className="level-select-header">
                <button className="btn-back" onClick={onBack}>← Back</button>
                <h2>Select Level</h2>
            </header>

            <div className="levels-grid">
                {levels.map((level, index) => {
                    const isLocked = index > maxLevelReached;
                    const isCompleted = index < maxLevelReached;
                    const isCurrent = index === maxLevelReached;

                    return (
                        <div
                            key={level.id}
                            className={`level-card ${isLocked ? 'locked' : 'unlocked'} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                            onClick={() => !isLocked && onSelectLevel(index)}
                        >
                            <div className="level-number">{level.id}</div>
                            <div className="level-info">
                                <span className="level-title">{level.title}</span>
                                {isLocked && <span className="lock-icon">🔒</span>}
                                {isCompleted && <span className="check-icon">✓</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelect;
