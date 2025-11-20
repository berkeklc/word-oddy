import React from 'react';
import './StartScreen.css';

const StartScreen = ({ onStart, onLevels, onProfile, onSettings }) => {
    return (
        <div className="start-screen">
            <button className="btn-settings-corner" onClick={onSettings}>
                ⚙️
            </button>

            <div className="logo-container">
                <h1 className="game-title">Word <br /><span className="highlight">Odyssey</span></h1>
                <p className="subtitle">Illuminate the path.</p>
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
