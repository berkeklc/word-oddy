import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Profile = ({ stats, onBack, onOpenAuth }) => {
    const { isAnonymous, profile, user } = useAuth();
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="profile-container">
            <header className="profile-header">
                <button className="btn-back" onClick={onBack}>← {t.back}</button>
                <h2>{t.profile}</h2>
            </header>

            <div className="profile-content">
                {isAnonymous && (
                    <div className="anon-warning">
                        <div className="warning-icon">⚠️</div>
                        <h3>{t.anonymous}</h3>
                        <p>{t.saveProgress}</p>
                        <button className="btn-create-account" onClick={onOpenAuth}>
                            ✨ {t.createAccount}
                        </button>
                    </div>
                )}

                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {isAnonymous ? '🎭' : '👤'}
                    </div>
                    <h3>{isAnonymous ? t.anonymous : (profile?.username || t.explorer)}</h3>
                    {!isAnonymous && user?.email && (
                        <p className="user-email">{user.email}</p>
                    )}
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">{t.highScore}</span>
                        <span className="stat-value">{stats.highScore}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">{t.maxLevel}</span>
                        <span className="stat-value">{stats.maxLevel + 1}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">{t.maxCombo}</span>
                        <span className="stat-value combo-highlight">{stats.maxCombo || 0}x</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">{t.totalWords}</span>
                        <span className="stat-value">{stats.totalWords || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">{t.gamesPlayed}</span>
                        <span className="stat-value">{stats.gamesPlayed || 0}</span>
                    </div>
                </div>

                <div className="achievements-section">
                    <h3>{t.achievements}</h3>
                    <div className="achievements-list">
                        <div className="achievement-item locked">
                            <span className="achievement-icon">🏆</span>
                            <div className="achievement-info">
                                <h4>Word Master</h4>
                                <p>Complete all levels</p>
                            </div>
                        </div>
                        <div className="achievement-item locked">
                            <span className="achievement-icon">⚡</span>
                            <div className="achievement-info">
                                <h4>Speed Demon</h4>
                                <p>Complete a level in under 30s</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
