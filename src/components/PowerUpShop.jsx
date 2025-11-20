import React, { useState } from 'react';
import './PowerUpShop.css';
import { powerUps } from '../data/powerUps';

const PowerUpShop = ({ score, onPurchase, inventory }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePurchase = (powerUp) => {
        if (score >= powerUp.cost) {
            onPurchase(powerUp);
        }
    };

    return (
        <>
            <button
                className={`shop-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="icon">🏪</span>
                <span className="label">Shop</span>
                {score > 0 && <span className="essence-badge">{score} ✨</span>}
            </button>

            <div className={`shop-panel ${isOpen ? 'open' : ''}`}>
                <div className="shop-header">
                    <h3>Mystic Market</h3>
                    <button className="btn-close-shop" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="shop-items-container">
                    {powerUps.map(powerUp => {
                        const owned = inventory[powerUp.id] || 0;
                        const canAfford = score >= powerUp.cost;

                        return (
                            <div key={powerUp.id} className={`shop-item ${!canAfford ? 'disabled' : ''}`}>
                                <div className="item-icon-wrapper">
                                    <span className="item-icon">{powerUp.icon}</span>
                                    {owned > 0 && <span className="item-owned-count">{owned}</span>}
                                </div>
                                <div className="item-details">
                                    <h4>{powerUp.name}</h4>
                                    <p>{powerUp.description}</p>
                                </div>
                                <button
                                    className="btn-buy-item"
                                    onClick={() => handlePurchase(powerUp)}
                                    disabled={!canAfford}
                                >
                                    {powerUp.cost === 0 ? 'FREE' : `${powerUp.cost}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isOpen && <div className="shop-backdrop" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default PowerUpShop;
