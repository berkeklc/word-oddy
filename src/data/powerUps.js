export const powerUps = [
    {
        id: 'clear',
        name: 'Cleansing Crystal',
        description: 'The cave provides this freely - removes corrupted letters and reveals the true path',
        cost: 0, // FREE!
        icon: '✨',
        uses: 0,
        starterAmount: 3 // Everyone starts with 3
    },
    {
        id: 'timeBonus',
        name: 'Time Shard',
        description: 'Adds +5 seconds to your timer in timed challenges',
        cost: 50,
        icon: '⏱️',
        uses: 0
    },
    {
        id: 'reveal',
        name: 'Vision Shard',
        description: 'Reveals one hidden letter in the selected word',
        cost: 100,
        icon: '💎',
        uses: 0
    },
    {
        id: 'hint',
        name: 'Ancient Wisdom',
        description: 'Shows you which word to solve next',
        cost: 80,
        icon: '📜',
        uses: 0
    }
];
