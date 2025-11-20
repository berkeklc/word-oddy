import React from 'react';
import './Tile.css';

const Tile = ({ char, status, isActive, onClick }) => {
    // status: 'hidden', 'revealed', 'solved'

    return (
        <div
            className={`tile ${status} ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {status !== 'hidden' ? char : ''}
        </div>
    );
};

export default Tile;
