export const levels = [
    {
        id: 1,
        title: "The Awakening",
        story: "Your journey begins in the Whispering Woods. The ancient lantern flickers...",
        words: [
            { id: 'w1', clue: "Opposite of dark", answer: "LIGHT", order: 1, challengeType: "typing" },
            { id: 'w2', clue: "Burning flame", answer: "FIRE", order: 2, challengeType: "typing" },
            { id: 'w3', clue: "To walk on", answer: "PATH", order: 3, challengeType: "typing" }
        ]
    },
    {
        id: 2,
        title: "Echoes of the Past",
        story: "Voices from the past guide your way. Listen closely.",
        words: [
            { id: 'w1', clue: "Not quiet", answer: "LOUD", order: 1, challengeType: "typing" },
            { id: 'w2', clue: "Spoken words", answer: "VOICE", order: 2, challengeType: "typing" },
            { id: 'w3', clue: "Repeated sound", answer: "ECHO", order: 3, challengeType: "typing" },
            { id: 'w4', clue: "Musical sound", answer: "SONG", order: 4, challengeType: "typing" }
        ]
    },
    {
        id: 3,
        title: "The Scramble",
        story: "A chaotic wind has scattered the letters! Restore order.",
        words: [
            { id: 'w1', clue: "Mixed up 'TCA'", answer: "CAT", order: 1, challengeType: "scramble" },
            { id: 'w2', clue: "Unscramble 'DGO'", answer: "DOG", order: 2, challengeType: "scramble" },
            { id: 'w3', clue: "Fix 'BRID'", answer: "BIRD", order: 3, challengeType: "scramble" },
            { id: 'w4', clue: "Sort 'HSFI'", answer: "FISH", order: 4, challengeType: "scramble" },
            { id: 'w5', clue: "Arrange 'LION'", answer: "LION", order: 5, challengeType: "scramble" }
        ]
    },
    {
        id: 4,
        title: "Lost Letters",
        story: "Some runes have faded with time. Fill in the blanks.",
        words: [
            { id: 'w1', clue: "G_EEN (Color)", answer: "GREEN", order: 1, challengeType: "missing" },
            { id: 'w2', clue: "AP_LE (Fruit)", answer: "APPLE", order: 2, challengeType: "missing" },
            { id: 'w3', clue: "H_PPY (Emotion)", answer: "HAPPY", order: 3, challengeType: "missing" },
            { id: 'w4', clue: "W_RLD (Planet)", answer: "WORLD", order: 4, challengeType: "missing" },
            { id: 'w5', clue: "FR_END (Pal)", answer: "FRIEND", order: 5, challengeType: "missing" }
        ]
    },
    {
        id: 5,
        title: "Shadow Realm",
        story: "The fog is thick here. Use your Vision Shard to see clearly.",
        words: [
            { id: 'w1', clue: "Hard to see", answer: "FOG", order: 1, challengeType: "hidden" },
            { id: 'w2', clue: "Dark time", answer: "NIGHT", order: 2, challengeType: "hidden" },
            { id: 'w3', clue: "Scary dream", answer: "NIGHTMARE", order: 3, challengeType: "hidden" },
            { id: 'w4', clue: "Not visible", answer: "INVISIBLE", order: 4, challengeType: "hidden" },
            { id: 'w5', clue: "Secret place", answer: "HIDEOUT", order: 5, challengeType: "hidden" }
        ]
    },
    {
        id: 6,
        title: "Time Trial",
        story: "The sands of time are slipping away! Hurry!",
        words: [
            { id: 'w1', clue: "Tick Tock", answer: "CLOCK", order: 1, challengeType: "timed", timeLimit: 10 },
            { id: 'w2', clue: "Run fast", answer: "SPRINT", order: 2, challengeType: "timed", timeLimit: 8 },
            { id: 'w3', clue: "Do it now", answer: "QUICK", order: 3, challengeType: "timed", timeLimit: 8 },
            { id: 'w4', clue: "High speed", answer: "FAST", order: 4, challengeType: "timed", timeLimit: 5 },
            { id: 'w5', clue: "Finish line", answer: "END", order: 5, challengeType: "timed", timeLimit: 5 }
        ]
    },
    {
        id: 7,
        title: "Master of Words",
        story: "You have mastered the basics. Now, face the ultimate test.",
        words: [
            { id: 'w1', clue: "Unscramble 'PUZLE'", answer: "PUZZLE", order: 1, challengeType: "scramble" },
            { id: 'w2', clue: "M_STERY", answer: "MYSTERY", order: 2, challengeType: "missing" },
            { id: 'w3', clue: "Hidden Gem", answer: "DIAMOND", order: 3, challengeType: "hidden" },
            { id: 'w4', clue: "Speedy Animal", answer: "CHEETAH", order: 4, challengeType: "timed", timeLimit: 10 },
            { id: 'w5', clue: "Final Boss", answer: "VICTORY", order: 5, challengeType: "typing" }
        ]
    }
];
