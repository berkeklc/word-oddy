import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = ({ stats, onBack, onOpenAuth }) => {
    const { isAnonymous, profile, user } = useAuth();

    return (
        <div className="profile-container">
            <header className="profile-header">
                <button className="btn-back" onClick={onBack}>← Back</button>
                <h2>Explorer Profile</h2>
            </header>

            <div className="profile-content">
                {isAnonymous && (
                    <div className="anon-warning">
                        <div className="warning-icon">⚠️</div>
                        <h3>Playing as Anonymous Wanderer</h3>
                        <p>Your progress is only saved locally. Create an account to save your journey across devices!</p>
                        <button className="btn-create-account" onClick={onOpenAuth}>
                            ✨ Create Account & Save Progress
                        </button>
                    </div>
                )}

                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {isAnonymous ? '🎭' : '👤'}
                    </div>
                    <h3>{isAnonymous ? 'Anonymous Wanderer' : (profile?.username || 'Explorer')}</h3>
                    {!isAnonymous && user?.email && (
                        <p className="user-email">{user.email}</p>
                    )}
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">High Score</span>
                        <span className="stat-value">{stats.highScore}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Max Level</span>
                        <span className="stat-value">{stats.maxLevel + 1}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Max Combo</span>
                        <span className="stat-value combo-highlight">{stats.maxCombo || 0}x</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total Words</span>
                        <span className="stat-value">{stats.totalWords || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Games Played</span>
                        <span className="stat-value">{stats.gamesPlayed || 0}</span>
                    </div>
                </div>

                <div className="achievements-section">
                    <h3>Achievements</h3>
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
