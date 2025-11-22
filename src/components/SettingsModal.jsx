import React from 'react';
import './SettingsModal.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const SettingsModal = ({ isOpen, onClose, isSoundOn, onToggleSound, onResetProgress }) => {
    const { language } = useLanguage();
    const t = translations[language];
    if (!isOpen) return null;

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <header className="settings-header">
                    <h2>{t.settings}</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </header>

                <div className="settings-content">
                    <div className="setting-item">
                        <div className="setting-label">
                            <span>{t.sound}</span>
                            <p>{isSoundOn ? t.on : t.off}</p>
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
                            <span>{t.resetProgress}</span>
                            <p>{t.resetConfirm}</p>
                        </div>
                        <button className="btn-danger" onClick={() => {
                            if (window.confirm(t.resetConfirm)) {
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
