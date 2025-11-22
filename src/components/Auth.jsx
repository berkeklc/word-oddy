import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Auth = ({ onClose }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { signIn, signUp, linkAccount, isAnonymous } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                // Login: Always use signIn (switches account if anonymous)
                const { error } = await signIn(email, password);
                if (error) throw error;
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                // Register
                if (username.length < 3) {
                    throw new Error('Traveler name must be at least 3 runes long');
                }

                // More flexible email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Please enter a valid email address');
                }

                if (isAnonymous) {
                    // If anonymous, LINK the account instead of creating a new one
                    const { error } = await linkAccount(email, password, username);
                    if (error) throw error;
                    setSuccess(true);
                    setTimeout(() => onClose(), 1500);
                } else {
                    // Standard sign up (shouldn't happen often if auto-guest is on, but good fallback)
                    const { data, error } = await signUp(email, password, username);
                    if (error) throw error;

                    setSuccess(true);

                    // Auto-login logic
                    if (data.session) {
                        setSuccess(true);
                        setTimeout(() => onClose(), 1000);
                        return;
                    }

                    // If no session, try to sign in
                    try {
                        const { data: signInData, error: signInError } = await signIn(email, password);
                        if (!signInError && signInData.session) {
                            setSuccess(true);
                            setTimeout(() => onClose(), 1000);
                            return;
                        }
                    } catch (signInErr) {
                        console.error('Auto-login error:', signInErr);
                    }

                    setSuccess(true);
                    setTimeout(() => {
                        setError('Account created! Please check your email to confirm.');
                        setSuccess(false);
                    }, 1500);
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            if (err.message && err.message.includes('Email logins are disabled')) {
                setError('Email logins are currently disabled in the game server. Please enable Email Auth in your Supabase Dashboard.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="scroll-background">
                <div className="scroll-content">
                    {/* Close button */}
                    <button className="auth-close-btn" onClick={onClose} aria-label="Close">
                        ✕
                    </button>

                    {/* Mystical Header */}
                    <div className="scroll-header">
                        <div className="rune-decoration">✦</div>
                        <h2 className="scroll-title">
                            {isLogin ? t.welcomeBack : t.joinQuest}
                        </h2>
                        <div className="rune-decoration">✦</div>
                    </div>

                    <p className="scroll-subtitle">
                        {isLogin
                            ? t.loginSubtitle
                            : t.signupSubtitle}
                    </p>

                    {/* Success Message */}
                    {success && (
                        <div className="auth-success">
                            <span className="success-icon">✨</span>
                            {isLogin ? 'Welcome back, brave soul!' : 'Your legend begins...'}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && <div className="auth-error">⚠️ {error}</div>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="scroll-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label className="mystical-label">
                                    <span className="label-icon">👤</span>
                                    {t.travelerName}
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t.namePlaceholder}
                                    className="mystical-input"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="mystical-label">
                                <span className="label-icon">📜</span>
                                {t.email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.spell@realm.com"
                                className="mystical-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="mystical-label">
                                <span className="label-icon">🔮</span>
                                {t.password}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="mystical-input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mystical-btn"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner">⚡</span>
                                    Casting spell...
                                </span>
                            ) : success ? (
                                <span>✓ Enchanted!</span>
                            ) : (
                                <span>
                                    {isLogin ? t.login : t.signup}
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="scroll-footer">
                        <button
                            className="switch-mode-btn"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                                setSuccess(false);
                            }}
                        >
                            {isLogin
                                ? t.needAccount
                                : t.haveAccount}
                        </button>
                    </div>

                    {/* Decorative elements */}
                    <div className="scroll-ornament scroll-ornament-top-left">╔</div>
                    <div className="scroll-ornament scroll-ornament-top-right">╗</div>
                    <div className="scroll-ornament scroll-ornament-bottom-left">╚</div>
                    <div className="scroll-ornament scroll-ornament-bottom-right">╝</div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
