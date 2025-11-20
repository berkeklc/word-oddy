import React from 'react';
import './PowerUpBar.css';
import { powerUps } from '../data/powerUps';

const PowerUpBar = ({ inventory, onUse, selectedWordId }) => {
    const availablePowerUps = powerUps.filter(p => inventory[p.id] > 0);

    if (availablePowerUps.length === 0) return null;

    return (
        <div className="powerup-bar-container">
            <div className="powerup-bar">
                {availablePowerUps.map(powerUp => {
                    const count = inventory[powerUp.id];
                    const canUse = selectedWordId !== null;

                    return (
                        <button
                            key={powerUp.id}
                            className={`powerup-btn ${!canUse ? 'disabled' : ''}`}
                            onClick={() => canUse && onUse(powerUp.id)}
                            disabled={!canUse}
                        >
                            <div className="powerup-icon-wrapper">
                                {powerUp.icon}
                            </div>
                            <span className="powerup-count">{count}</span>
                            <span className="powerup-label">{powerUp.name}</span>
                        </button>
                    );
                })}
            </div>
            <p className="powerup-hint">Select a word to use power-ups</p>
        </div>
    );
};

export default PowerUpBar;
