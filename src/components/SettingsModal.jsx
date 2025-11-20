import React from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, isSoundOn, onToggleSound, onResetProgress }) => {
    if (!isOpen) return null;

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <header className="settings-header">
                    <h2>Settings</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </header>

                <div className="settings-content">
                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Sound Effects</span>
                            <p>Enable or disable game sounds</p>
                        </div>
                        <button
                            className={`toggle-btn ${isSoundOn ? 'active' : ''}`}
                            onClick={onToggleSound}
                        >
                            <div className="toggle-thumb"></div>
                        </button>
                    </div>

                    <div className="setting-item danger-zone">
                        <div className="setting-label">
                            <span>Reset Progress</span>
                            <p>Clear all levels and scores</p>
                        </div>
                        <button className="btn-danger" onClick={() => {
                            if (window.confirm('Are you sure? This cannot be undone.')) {
                                onResetProgress();
                            }
                        }}>
                            Reset
                        </button>
                    </div>
                </div>

                <div className="settings-footer">
                    <p>Word Odyssey v1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
