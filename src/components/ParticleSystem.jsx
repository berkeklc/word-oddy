import React, { useEffect, useState, useCallback } from 'react';
import './ParticleSystem.css';

const ParticleSystem = () => {
    const [particles, setParticles] = useState([]);

    const createParticles = useCallback((x, y, type = 'sparkle', count = 10) => {
        const newParticles = [];
        const now = Date.now();
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const size = 5 + Math.random() * 10;
            const duration = 500 + Math.random() * 500;

            newParticles.push({
                id: `${now}-${i}-${Math.random()}`, // Unique ID
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size,
                color: type === 'sparkle' ? '#fbbf24' : '#a78bfa', // Gold or Lavender
                duration,
                createdAt: now
            });
        }

        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    useEffect(() => {
        // Listen for custom event to trigger particles
        const handleTrigger = (e) => {
            const { x, y, type, count } = e.detail;
            createParticles(x, y, type, count);
        };

        window.addEventListener('trigger-particles', handleTrigger);

        // Animation loop
        let animationFrame;
        const animate = () => {
            const now = Date.now();
            setParticles(prev => prev.filter(p => {
                const age = now - p.createdAt;
                return age < p.duration;
            }).map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy + 0.5, // Gravity
                vx: p.vx * 0.95, // Friction
                vy: p.vy * 0.95
            })));
            animationFrame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('trigger-particles', handleTrigger);
            cancelAnimationFrame(animationFrame);
        };
    }, [createParticles]);

    return (
        <div className="particle-system">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        opacity: 1 - (Date.now() - p.createdAt) / p.duration
                    }}
                />
            ))}
        </div>
    );
};

// Helper to trigger particles from anywhere
export const triggerParticles = (x, y, type = 'sparkle', count = 10) => {
    const event = new CustomEvent('trigger-particles', {
        detail: { x, y, type, count }
    });
    window.dispatchEvent(event);
};

export default ParticleSystem;
