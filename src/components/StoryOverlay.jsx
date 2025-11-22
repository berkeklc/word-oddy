import React, { useEffect, useState } from 'react';
import './StoryOverlay.css';

import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const StoryOverlay = ({ level, onContinue }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [visibleText, setVisibleText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        const text = level.story;
        setVisibleText('');
        setIsComplete(false);

        const interval = setInterval(() => {
            if (index < text.length) {
                setVisibleText((prev) => prev + text.charAt(index));
                index++;
            } else {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, 30); // Typing speed

        return () => clearInterval(interval);
    }, [level]);

    return (
        <div className="story-overlay" onClick={isComplete ? onContinue : null}>
            <div className="story-content">
                <h2 className="story-title">{level.title}</h2>
                <p className="story-text">{visibleText}</p>

                <div className={`continue-prompt ${isComplete ? 'visible' : ''}`}>
                    {t.continue}
                </div>
            </div>
        </div>
    );
};

export default StoryOverlay;
