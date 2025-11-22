import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import './StartScreen.css';

const StartScreen = ({ onStart, onCreative, onLevels, onProfile, onLeaderboard, onSettings, onAuth, maxLevelReached }) => {
    const { isAnonymous, profile } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    return (
        <div className="start-screen">
            <div className="hero-section">
                <div className="title-container">
                    <h1 className="main-title">
                        <span className="title-word">{t.title}</span>
                        <span className="title-highlight">{t.titleHighlight}</span>
                    </h1>
                    <p className="subtitle">{t.subtitle}</p>
                </div>

                <button className="lang-toggle-pill" onClick={toggleLanguage}>
                    <span className={`lang-opt ${language === 'en' ? 'active' : ''}`}>EN</span>
                    <span className="lang-sep">/</span>
                    <span className={`lang-opt ${language === 'tr' ? 'active' : ''}`}>TR</span>
                </button>
            </div>

            <div className="menu-card">
                <div className="menu-handle"></div>

                <div className="primary-actions">
                    <button className="btn-start-journey" onClick={onStart}>
                        <span className="btn-content">
                            <span className="btn-icon">⚔️</span>
                            <span className="btn-text">
                                <span className="btn-label">{t.startJourney}</span>
                                <span className="btn-sub">{t.level} {(maxLevelReached || 0) + 1}</span>
                            </span>
                        </span>
                        <span className="btn-arrow">→</span>
                    </button>

                    <button className="btn-creative" onClick={onCreative}>
                        <span className="btn-icon">✨</span>
                        <span className="btn-text">{t.creativeMode}</span>
                    </button>
                </div>

                <div className="secondary-actions">
                    <button className="btn-icon-circle" onClick={onLevels} aria-label={t.levelSelect}>
                        <span className="icon">🗺️</span>
                        <span className="label">{t.level}</span>
                    </button>
                    <button className="btn-icon-circle" onClick={onLeaderboard} aria-label={t.leaderboard}>
                        <span className="icon">🏆</span>
                        <span className="label">{t.rank}</span>
                    </button>
                    <button className="btn-icon-circle" onClick={onProfile} aria-label={t.profile}>
                        <span className="icon">👤</span>
                        <span className="label">{t.profile}</span>
                    </button>
                    <button className="btn-icon-circle" onClick={onSettings} aria-label={t.settings}>
                        <span className="icon">⚙️</span>
                        <span className="label">{t.settings}</span>
                    </button>
                </div>

                <div className="auth-status">
                    {profile ? (
                        <div className="user-pill" onClick={onProfile}>
                            <span className="status-dot online"></span>
                            {isAnonymous ? t.guest : profile.email?.split('@')[0]}
                        </div>
                    ) : (
                        <button className="btn-text-auth" onClick={onAuth}>
                            {t.login}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
