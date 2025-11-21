import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MiniLeaderboard from './MiniLeaderboard';
import './StartScreen.css';

const StartScreen = ({ onStart, onCreative, onLevels, onProfile, onLeaderboard, onSettings, onAuth }) => {
    const { isAnonymous, profile, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <div className="start-screen">
            <button className="btn-settings-corner" onClick={onSettings}>
                ⚙️
            </button>

            {/* Login/Account button in top right */}
            {isAnonymous ? (
                <button className="btn-account-corner" onClick={onAuth}>
                    🔓 Login
                </button>
            ) : (
                <>
                    <button
                        className="btn-account-corner"
                        onClick={onAuth}
                        style={{ right: '130px' }}
                    >
                        👤 {profile?.username || 'Account'}
                    </button>
                    <button
                        className="btn-account-corner"
                        onClick={handleLogout}
                        style={{
                            right: '15px',
                            background: 'rgba(220, 53, 69, 0.2)',
                            borderColor: '#dc3545'
                        }}
                        title="Logout"
                    >
                        🚪
                    </button>
                </>
            )}

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

                <button className="btn-start btn-creative" onClick={onCreative} style={{ marginTop: '10px', background: 'linear-gradient(45deg, #7209b7, #4361ee)' }}>
                    Realm Rush
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

            <MiniLeaderboard onViewFull={onLeaderboard} />

            <div className="footer-decoration">
                <div className="lantern-icon">🏮</div>
                <p className="version-text">v1.0.0</p>
            </div>
        </div>
    );
};

export default StartScreen;
