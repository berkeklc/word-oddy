import React, { useState, useEffect } from 'react';
import { gameProgressService } from '../services/gameProgressService';
import './MiniLeaderboard.css';

const MiniLeaderboard = ({ onViewFull }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMode, setActiveMode] = useState('classic');

    useEffect(() => {
        fetchLeaders();
    }, [activeMode]);

    const fetchLeaders = async () => {
        setLoading(true);
        const data = await gameProgressService.getLeaderboard(activeMode);
        if (data) {
            setLeaders(data.slice(0, 5)); // Top 5 only for mini view
        }
        setLoading(false);
    };

    return (
        <div className="mini-leaderboard">
            <div className="mini-lb-header">
                <h3>🏆 Top Champions</h3>
                <div className="mini-lb-tabs">
                    <button
                        className={activeMode === 'classic' ? 'active' : ''}
                        onClick={() => setActiveMode('classic')}
                    >
                        Classic
                    </button>
                    <button
                        className={activeMode === 'creative' ? 'active' : ''}
                        onClick={() => setActiveMode('creative')}
                    >
                        Rush
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="mini-lb-loading">Loading...</div>
            ) : leaders.length === 0 ? (
                <div className="mini-lb-empty">No records yet!</div>
            ) : (
                <div className="mini-lb-list">
                    {leaders.map((player, idx) => (
                        <div key={idx} className={`mini-lb-row rank-${idx + 1}`}>
                            <span className="mini-rank">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                            </span>
                            <span className="mini-player">
                                {player.username || 'Anonymous'}
                            </span>
                            <span className="mini-score">
                                {activeMode === 'classic' ? player.high_score : player.creative_high_score}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {onViewFull && (
                <button className="mini-lb-view-all" onClick={onViewFull}>
                    View Full Leaderboard →
                </button>
            )}
        </div>
    );
};

export default MiniLeaderboard;
