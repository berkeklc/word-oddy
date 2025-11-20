import React, { useState } from 'react';
import './InteractiveTutorial.css';

const InteractiveTutorial = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [demoInput, setDemoInput] = useState('');

    const tutorialSteps = [
        {
            title: "Welcome, Kira",
            instruction: "You are Kira, a relic seeker searching for your lost mentor in the Crystal Cave.",
            interactive: false
        },
        {
            title: "Build a Path",
            instruction: "Each word you solve lights a stepping stone, creating a path deeper into the cave.",
            interactive: false
        },
        {
            title: "One Word at a Time",
            instruction: "Focus on the current word. Type 'CAVE' using the keyboard below to light your first stone!",
            interactive: true,
            word: "CAVE"
        },
        {
            title: "Keep Going!",
            instruction: "Each solved word unlocks the next. Build your path one stone at a time until you reach the chamber's end.",
            interactive: false
        },
        {
            title: "Power-Ups Help",
            instruction: "Visit the 🏪 Shop to get helpful powers. The Cleansing Crystal (✨) is FREE and clears mistakes!",
            interactive: false
        },
        {
            title: "Ready for Adventure!",
            instruction: "Light the path through 5 chambers to find the Eternal Lantern and discover your mentor's fate. Good luck!",
            interactive: false
        }
    ];

    const currentStep = tutorialSteps[step];

    const handleNext = () => {
        if (step < tutorialSteps.length - 1) {
            setStep(step + 1);
            setDemoInput('');
        } else {
            onComplete();
        }
    };

    const handleDemoKeyPress = (letter) => {
        if (currentStep.interactive && currentStep.word) {
            if (letter === '⌫') {
                setDemoInput(prev => prev.slice(0, -1));
            } else if (demoInput.length < currentStep.word.length) {
                const newInput = demoInput + letter;
                setDemoInput(newInput);

                if (newInput === currentStep.word) {
                    setTimeout(handleNext, 800);
                }
            }
        }
    };

    return (
        <div className="interactive-tutorial-overlay">
            <div className="interactive-tutorial-card">
                <div className="tutorial-progress-bar">
                    <div className="progress-fill" style={{ width: `${((step + 1) / tutorialSteps.length) * 100}%` }} />
                </div>

                <h2>{currentStep.title}</h2>
                <p className="tutorial-instruction">{currentStep.instruction}</p>

                {currentStep.interactive && (
                    <>
                        <div className="demo-letter-boxes">
                            {Array(currentStep.word.length).fill('').map((_, i) => (
                                <div key={i} className={`demo-letter-box ${demoInput[i] ? 'filled' : ''}`}>
                                    {demoInput[i] || ''}
                                </div>
                            ))}
                        </div>
                        <div className="demo-keyboard">
                            {currentStep.word.split('').map((letter, i) => (
                                <button
                                    key={i}
                                    className="demo-key"
                                    onClick={() => handleDemoKeyPress(letter)}
                                >
                                    {letter}
                                </button>
                            ))}
                            <button
                                className="demo-key backspace"
                                onClick={() => handleDemoKeyPress('⌫')}
                            >
                                ⌫
                            </button>
                        </div>
                    </>
                )}

                {!currentStep.interactive && (
                    <button className="btn-tutorial-next" onClick={handleNext}>
                        {step === tutorialSteps.length - 1 ? 'Start Adventure' : 'Next'}
                    </button>
                )}

                <button className="btn-tutorial-skip" onClick={onComplete}>
                    Skip Tutorial
                </button>
            </div>
        </div>
    );
};

export default InteractiveTutorial;
