import React, { useState } from 'react';
import './InteractiveTutorial.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const InteractiveTutorial = ({ onComplete }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [step, setStep] = useState(0);
    const [demoInput, setDemoInput] = useState('');

    const tutorialSteps = [
        {
            title: t.tutorialWelcomeTitle,
            instruction: t.tutorialWelcomeText,
            interactive: false
        },
        {
            title: t.tutorialBuildPathTitle,
            instruction: t.tutorialBuildPathText,
            interactive: false
        },
        {
            title: t.tutorialOneWordTitle,
            instruction: t.tutorialOneWordText,
            interactive: true,
            word: language === 'tr' ? "MAĞARA" : "CAVE"
        },
        {
            title: t.tutorialKeepGoingTitle,
            instruction: t.tutorialKeepGoingText,
            interactive: false
        },
        {
            title: t.tutorialPowerUpsTitle,
            instruction: t.tutorialPowerUpsText,
            interactive: false
        },
        {
            title: t.tutorialReadyTitle,
            instruction: t.tutorialReadyText,
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
                        {step === tutorialSteps.length - 1 ? t.tutorialStart : t.tutorialNext}
                    </button>
                )}

                <button className="btn-tutorial-skip" onClick={onComplete}>
                    {t.tutorialSkip}
                </button>
            </div>
        </div>
    );
};

export default InteractiveTutorial;
