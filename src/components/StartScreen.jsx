import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './StartScreen.css';

const StartScreen = ({ onStart, onLevels, onProfile, onSettings, onAuth }) => {
    const { isAnonymous, profile } = useAuth();

    return (
        <div className="start-screen">
            <button className="btn-settings-corner" onClick={onSettings}>
                ⚙️
            </button>

            {/* Login/Account button in top right */}
            <button className="btn-account-corner" onClick={onAuth}>
                {isAnonymous ? '🔓 Login' : `👤 ${profile?.username || 'Account'}`}
            </button>

            <div className="logo-container">
                <h1 className="game-title">Word <br /><span className="highlight">Odyssey</span></h1>
                <p className="subtitle">Illuminate the path.</p>
                {isAnonymous && (
                    <p className="anon-badge">⚡ Playing as Wanderer</p>
                )}
            </div>

            <div className="menu-actions">
                <button className="btn-start" onClick={onStart}>
                    Start Journey
                </button>

                <div className="secondary-actions">
                    <button className="btn-secondary" onClick={onLevels}>
                        <span className="icon">🗺️</span> Levels
                    </button>
                    <button className="btn-secondary" onClick={onProfile}>
                        <span className="icon">👤</span> Profile
                    </button>
                </div>
            </div>

            <div className="footer-decoration">
                <div className="lantern-icon">🏮</div>
                <p className="version-text">v1.0.0</p>
            </div>
        </div>
    );
};

export default StartScreen;
