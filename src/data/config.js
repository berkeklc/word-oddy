export const GAME_CONFIG = {
    PERFECT_STREAK_BONUS: 500,  // Bonus for completing level without mistakes
    SPEED_BONUS_THRESHOLD: 3,    // Seconds per word for speed bonus
    COMBO_MULTIPLIER: 0.1,       // 10% per streak
    DAILY_GOAL: 3,               // Complete 3 levels per day

    RANKS: {
        S: { min: 2000, emoji: '🏆', name: 'Master' },
        A: { min: 1500, emoji: '⭐', name: 'Expert' },
        B: { min: 1000, emoji: '✨', name: 'Good' },
        C: { min: 0, emoji: '👍', name: 'Nice' }
    }
};
