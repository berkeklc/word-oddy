import { supabase } from '../supabaseClient';

export const gameProgressService = {
    async getProgress(userId) {
        const { data, error } = await supabase
            .from('game_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching progress:', error);
            return null;
        }

        return data;
    },

    async saveProgress(userId, progress) {
        const { data, error } = await supabase
            .from('game_progress')
            .upsert({
                user_id: userId,
                high_score: progress.highScore,
                max_level: progress.maxLevel,
                total_words: progress.totalWords,
                games_played: progress.gamesPlayed,
                tutorial_complete: progress.tutorialComplete,
                inventory: progress.inventory,
                updated_at: new Date().toISOString()
            })
            .select();

        if (error) {
            console.error('Error saving progress:', error);
            return null;
        }

        return data;
    },

    async syncFromLocal(userId) {
        // Get local storage data
        const localProgress = {
            highScore: parseInt(localStorage.getItem('wordOdysseyHighScore') || '0'),
            maxLevel: parseInt(localStorage.getItem('wordOdysseyMaxLevel') || '0'),
            tutorialComplete: localStorage.getItem('wordOdysseyTutorialComplete') === 'true',
            gamesPlayed: 0,
            totalWords: 0,
            inventory: { clear: 3 }
        };

        const statsStr = localStorage.getItem('wordOdysseyStats');
        if (statsStr) {
            const stats = JSON.parse(statsStr);
            localProgress.gamesPlayed = stats.gamesPlayed || 0;
            localProgress.totalWords = stats.totalWords || 0;
        }

        // Save to Supabase
        return await this.saveProgress(userId, localProgress);
    }
};
