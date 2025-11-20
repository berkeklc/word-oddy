# Word Odyssey 🎮

A beautiful, mobile-first word puzzle game built with React and Supabase.

## 🌟 Features

- **Multiple Challenge Types**: Including typing, scramble, missing letters, hidden words, and timed challenges
- **Progressive Difficulty**: 7 unique levels with increasing complexity
- **User Authentication**: Sign up/Login with Supabase Auth
- **Cloud Save**: Your progress is automatically saved to the cloud
- **Power-ups & Inventory**: Collect and use power-ups to help solve puzzles
- **Rich Animations**: Smooth, engaging animations and particle effects
- **Mobile-First Design**: Optimized for mobile gameplay with touch controls
- **Dark Gothic Theme**: Beautiful UI with a mysterious gothic aesthetic

## 🚀 Live Demo

[Coming soon - Will be deployed on Vercel]

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Supabase (Auth + Database)
- **Styling**: Vanilla CSS with modern design patterns
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd word-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Run the SQL schema in your Supabase project (see `supabase-schema.sql`)

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## 🎮 How to Play

1. **Sign Up/Login** or play as a guest
2. **Complete the Tutorial** to learn the game mechanics
3. **Progress through 7 levels**, each with unique challenges
4. **Earn points** and unlock power-ups
5. **Save your progress** automatically to the cloud

## 📝 Database Setup

The database schema is included in `supabase-schema.sql`. To set up your Supabase project:

1. Create a new project at https://supabase.com
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query

This will create:
- `profiles` table for user information
- `game_progress` table for saving game state
- RLS policies for security
- Triggers for automatic profile creation

## 🌐 Deployment

This app is ready to deploy on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Deploy!

No environment variables needed - all Supabase config is in the code.

## 📄 License

MIT

## 👤 Author

Built with ❤️ by [Your Name]
