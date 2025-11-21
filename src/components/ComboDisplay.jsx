import React, { useState, useEffect } from 'react';
import './ComboDisplay.css';

const ComboDisplay = ({ combo, maxCombo }) => {
    const [prevCombo, setPrevCombo] = useState(0);
    const [showNewRecord, setShowNewRecord] = useState(false);

    useEffect(() => {
        if (combo > prevCombo && combo > 1) {
            // Combo increased
            setPrevCombo(combo);

            // Check for new record
            if (combo > maxCombo) {
                setShowNewRecord(true);
                setTimeout(() => setShowNewRecord(false), 2000);
            }
        } else if (combo < prevCombo) {
            // Combo reset
            setPrevCombo(combo);
        }
    }, [combo, prevCombo, maxCombo]);

    if (combo <= 1) return null;

    const getComboLevel = () => {
        if (combo >= 20) return 'legendary';
        if (combo >= 15) return 'epic';
        if (combo >= 10) return 'rare';
        if (combo >= 5) return 'uncommon';
        return 'common';
    };

    const comboLevel = getComboLevel();

    return (
        <div className={`combo-display ${comboLevel}`}>
            <div className="combo-main">
                <div className="combo-number">{combo}</div>
                <div className="combo-multiplier">x</div>
            </div>
            <div className="combo-label">COMBO!</div>
            <div className="combo-progress">
                <div
                    className="combo-progress-bar"
                    style={{ width: `${Math.min((combo / 20) * 100, 100)}%` }}
                />
            </div>

            {showNewRecord && (
                <div className="new-record-badge">
                    🔥 NEW RECORD! 🔥
                </div>
            )}

            {combo >= 5 && (
                <div className="combo-particles">
                    {[...Array(Math.min(combo, 10))].map((_, i) => (
                        <div key={i} className="particle" style={{
                            '--delay': `${i * 0.1}s`,
                            '--angle': `${(360 / Math.min(combo, 10)) * i}deg`
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComboDisplay;
