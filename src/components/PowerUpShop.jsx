import React, { useState } from 'react';
import './PowerUpShop.css';
import { powerUps } from '../data/powerUps';

const PowerUpShop = ({ score, onPurchase, inventory, inTimedChallenge = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePurchase = (powerUp) => {
        if (score >= powerUp.cost) {
            onPurchase(powerUp);
        }
    };

    const handleQuickBuyTime = () => {
        const timeBonus = powerUps.find(p => p.id === 'timeBonus');
        if (timeBonus && score >= timeBonus.cost) {
            onPurchase(timeBonus);
        }
    };

    const timeBonusPowerUp = powerUps.find(p => p.id === 'timeBonus');
    const canAffordTime = timeBonusPowerUp && score >= timeBonusPowerUp.cost;

    return (
        <>
            {/* Quick Buy Time Button - shows only in timed challenges */}
            {inTimedChallenge && timeBonusPowerUp && (
                <button
                    className={`quick-buy-time ${!canAffordTime ? 'disabled' : ''}`}
                    onClick={handleQuickBuyTime}
                    disabled={!canAffordTime}
                    title={`Buy +5s for ${timeBonusPowerUp.cost} essence`}
                >
                    <span className="quick-icon">⏱️</span>
                    <span className="quick-label">+5s</span>
                    <span className="quick-cost">{timeBonusPowerUp.cost} ✨</span>
                </button>
            )}

            {/* Shop Toggle Button */}
            <button
                className={`shop-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="icon">🏪</span>
                <span className="label">Shop</span>
                {score > 0 && <span className="essence-badge">{score} ✨</span>}
            </button>

            {/* Shop Panel */}
            <div className={`shop-panel ${isOpen ? 'open' : ''}`}>
                <div className="shop-header">
                    <h3>✨ Mystic Market</h3>
                    <button className="btn-close-shop" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="shop-balance">
                    <span className="balance-label">Your Essence:</span>
                    <span className="balance-value">{score} ✨</span>
                </div>

                <div className="shop-items-container">
                    {powerUps.map(powerUp => {
                        const owned = inventory[powerUp.id] || 0;
                        const canAfford = score >= powerUp.cost;

                        return (
                            <div key={powerUp.id} className={`shop-item ${!canAfford ? 'disabled' : ''}`}>
                                <div className="item-header">
                                    <div className="item-icon-wrapper">
                                        <span className="item-icon">{powerUp.icon}</span>
                                        {owned > 0 && <span className="item-owned-count">{owned}</span>}
                                    </div>
                                    <div className="item-title">
                                        <h4>{powerUp.name}</h4>
                                        {powerUp.cost === 0 && <span className="free-badge">FREE</span>}
                                    </div>
                                </div>
                                <p className="item-description">{powerUp.description}</p>
                                <button
                                    className="btn-buy-item"
                                    onClick={() => handlePurchase(powerUp)}
                                    disabled={!canAfford}
                                >
                                    {powerUp.cost === 0 ? (
                                        <span>✨ Get Free</span>
                                    ) : (
                                        <>
                                            <span className="buy-icon">💰</span>
                                            <span>{powerUp.cost} Essence</span>
                                        </>
                                    )}
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
