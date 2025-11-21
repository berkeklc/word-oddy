import giftboxIcon from '../assets/bonuses/giftbox.png';
import rocketIcon from '../assets/bonuses/rocket.png';
import bombIcon from '../assets/bonuses/bomb.png';
import rainbowIcon from '../assets/bonuses/rainbow.png';

export const bonusTypes = [
    {
        id: 'giftbox',
        name: 'Mystic Chest',
        icon: giftboxIcon,
        effect: 'random_reward',
        rarity: 'common',
        description: 'Contains a surprise reward!'
    },
    {
        id: 'rocket_h',
        name: 'Wind Spirit (H)',
        icon: rocketIcon,
        effect: 'shuffle_row',
        rarity: 'uncommon',
        description: 'Clears the path horizontally!'
    },
    {
        id: 'rocket_v',
        name: 'Wind Spirit (V)',
        icon: rocketIcon,
        effect: 'shuffle_column',
        rarity: 'uncommon',
        description: 'Clears the path vertically!'
    },
    {
        id: 'bomb',
        name: 'Rune Stone',
        icon: bombIcon,
        effect: 'shuffle_area',
        rarity: 'rare',
        description: 'Explodes with magical energy!'
    },
    {
        id: 'rainbow',
        name: 'Prismatic Shard',
        icon: rainbowIcon,
        effect: 'wildcard',
        rarity: 'epic',
        description: 'Matches any letter!'
    }
];
