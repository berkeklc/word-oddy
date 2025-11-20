import React, { useState } from 'react';
import './TutorialOverlay.css';

const tutorialSteps = [
    {
        title: "Welcome, Kira",
        text: "You are Kira, a relic seeker. Your mentor vanished in the Crystal Cave seeking the legendary Eternal Lantern. Now, you must follow their path.",
        icon: "🏮"
    },
    {
        title: "The Fog of War",
        text: "Words are hidden in darkness. Only by solving one word can you reveal the next intersecting paths.",
        icon: "🌫️"
    },
    {
        title: "How to Play",
        text: "Tap a revealed word to select it, then use the keyboard to spell out the answer. Correct answers unlock new words!",
        icon: "⌨️"
    },
    {
        title: "Build Combos",
        text: "Chain correct answers without mistakes to earn combo multipliers. Each combo adds +10% to your score!",
        icon: "⚡"
    },
    {
        title: "Use Power-Ups",
        text: "Spend your earned Essence in the Relic Shop to buy helpful powers like hints and letter reveals.",
        icon: "💎"
    }
];

const TutorialOverlay = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const step = tutorialSteps[currentStep];

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-card">
                <div className="tutorial-icon">{step.icon}</div>
                <h2 className="tutorial-title">{step.title}</h2>
                <p className="tutorial-text">{step.text}</p>

                <div className="tutorial-progress">
                    {tutorialSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`progress-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                        />
                    ))}
                </div>

                <div className="tutorial-actions">
                    <button className="btn-skip" onClick={handleSkip}>
                        Skip
                    </button>
                    <button className="btn-next" onClick={handleNext}>
                        {currentStep === tutorialSteps.length - 1 ? 'Start Journey' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;
