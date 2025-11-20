import React from 'react';
import './Profile.css';

const Profile = ({ stats, onBack }) => {
    return (
        <div className="profile-container">
            <header className="profile-header">
                <button className="btn-back" onClick={onBack}>← Back</button>
                <h2>Explorer Profile</h2>
            </header>

            <div className="profile-content">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        👤
                    </div>
                    <h3>Novice Explorer</h3>
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
