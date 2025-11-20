import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Auth = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                if (username.length < 3) {
                    throw new Error('Traveler name must be at least 3 runes long');
                }
                const { error } = await signUp(email, password, username);
                if (error) throw error;
                setSuccess(true);
                setTimeout(() => {
                    setIsLogin(true);
                    setSuccess(false);
                    setError('A mystical scroll has been sent to your realm. Confirm to unlock your account!');
                }, 2000);
            }
        } catch (err) {
            setError(err.message);
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
                            {isLogin ? 'Return, Traveler' : 'Join the Quest'}
                        </h2>
                        <div className="rune-decoration">✦</div>
                    </div>

                    <p className="scroll-subtitle">
                        {isLogin
                            ? 'Your journey awaits, restore your progress from the ethereal realm'
                            : 'Inscribe your name in the Book of Legends'}
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
                                    Traveler's Name
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your legendary name..."
                                    className="mystical-input"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="mystical-label">
                                <span className="label-icon">📜</span>
                                Ethereal Scroll
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
                                Secret Incantation
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
                                    {isLogin ? '⚔️ Enter the Realm' : '✨ Begin Journey'}
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
                                ? "New to the realm? Create your legend"
                                : "Already a legend? Return here"}
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
