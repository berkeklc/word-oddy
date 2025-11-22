import React from 'react';
import './LevelSelect.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const LevelSelect = ({ levels, maxLevelReached, onSelectLevel, onBack }) => {
    const { language } = useLanguage();
    const t = translations[language];
    return (
        <div className="level-select-container">
            <header className="level-select-header">
                <button className="btn-back" onClick={onBack}>← {t.back}</button>
                <h2>{t.selectLevel}</h2>
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
