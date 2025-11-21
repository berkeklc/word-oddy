import React, { useState, useEffect } from 'react';
import { gameProgressService } from '../services/gameProgressService';
import './Leaderboard.css';

const Leaderboard = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('classic'); // 'classic' or 'creative'
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const data = await gameProgressService.getLeaderboard(activeTab);
        if (data) {
            setLeaders(data);
        }
        setLoading(false);
    };

    return (
        <div className="leaderboard-container">
            <header className="leaderboard-header">
                <button className="btn-icon" onClick={onBack}>🏠</button>
                <h2>Global Leaderboard</h2>
                <button className="btn-icon" onClick={fetchLeaderboard}>🔄</button>
            </header>

            <div className="leaderboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'classic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('classic')}
                >
                    Classic Journey
                </button>
                <button
                    className={`tab-btn ${activeTab === 'creative' ? 'active' : ''}`}
                    onClick={() => setActiveTab('creative')}
                >
                    Realm Rush
                </button>
            </div>

            <div className="leaderboard-content">
                {loading ? (
                    <div className="loading-spinner">Loading champions...</div>
                ) : leaders.length === 0 ? (
                    <div className="empty-state">No records yet. Be the first!</div>
                ) : (
                    <div className="leaders-list">
                        <div className="leaders-header-row">
                            <span className="rank-col">#</span>
                            <span className="player-col">Player</span>
                            <span className="score-col">Score</span>
                            <span className="level-col">Level</span>
                        </div>
                        {leaders.map((player, index) => (
                            <div key={index} className={`leader-row rank-${index + 1}`}>
                                <span className="rank-col">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </span>
                                <span className="player-col">
                                    <span className="avatar">{player.avatar_url || '👤'}</span>
                                    {player.username || 'Anonymous'}
                                </span>
                                <span className="score-col">
                                    {activeTab === 'classic' ? player.high_score : player.creative_high_score}
                                </span>
                                <span className="level-col">
                                    {activeTab === 'classic' ? (player.max_level + 1) : player.creative_max_level}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
