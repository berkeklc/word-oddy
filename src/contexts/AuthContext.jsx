import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        let mounted = true;

        // Safety timeout: If nothing happens for 5 seconds, stop loading
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn('AuthContext: Safety timeout triggered - forcing loading false');
                setLoading(false);
            }
        }, 5000);

        const initializeAuth = async () => {
            try {
                console.log('AuthContext: Initializing...');

                // 1. Get initial session
                const { data: { session: initialSession }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (mounted) {
                    if (initialSession) {
                        console.log('AuthContext: Session found');
                        setSession(initialSession);
                        setUser(initialSession.user);
                        setIsAnonymous(initialSession.user?.is_anonymous);
                        // Fetch profile but don't block loading state completely if it takes too long
                        fetchProfile(initialSession.user.id).catch(console.error);
                    } else {
                        console.log('AuthContext: No session, signing in anonymously...');
                        await signInAnonymously();
                    }
                }
            } catch (error) {
                console.error('AuthContext: Initialization error:', error);
                // If error (e.g. network), try anonymous sign in as fallback
                if (mounted && !session) {
                    await signInAnonymously();
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;

            console.log('AuthContext: Auth state change:', event);

            try {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    setIsAnonymous(currentSession.user.is_anonymous);
                    // Only fetch profile if it's a different user or we don't have one
                    if (!profile || profile.id !== currentSession.user.id) {
                        // Don't await profile fetch to avoid blocking UI
                        fetchProfile(currentSession.user.id).catch(err =>
                            console.error('AuthContext: Profile fetch failed in background:', err)
                        );
                    }
                } else {
                    setProfile(null);
                    setIsAnonymous(false);
                }
            } catch (err) {
                console.error('AuthContext: Error in auth state change handler:', err);
            } finally {
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, []);

    const signInAnonymously = async () => {
        try {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            console.log('AuthContext: Signed in anonymously success');
            return data;
        } catch (error) {
            console.error('AuthContext: Error signing in anonymously:', error);
        }
    };

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If profile doesn't exist, it might be created by trigger shortly.
                // We can ignore or retry.
                console.warn('Error fetching profile (may be new user):', error.message);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        }
    };

    const signUp = async (email, password, username) => {
        // For completely new users (not linked)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const result = await supabase.auth.signInWithPassword({ email, password });
        return result;
    };

    const signOut = async () => {
        const result = await supabase.auth.signOut();
        return result;
    };

    // Convert anonymous user to permanent user
    const linkAccount = async (email, password, username) => {
        try {
            // 1. Update the user's auth credentials
            const { data, error } = await supabase.auth.updateUser({
                email: email,
                password: password,
                data: { username: username }
            });

            if (error) throw error;

            // 2. Update the profile with the new username
            if (user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ username: username })
                    .eq('id', user.id);

                if (profileError) console.warn('Error updating profile username:', profileError);

                // Refresh profile
                await fetchProfile(user.id);
            }

            return { data, error: null };
        } catch (error) {
            console.error('Error linking account:', error);
            return { data: null, error };
        }
    };

    const getUserId = () => {
        return user?.id;
    };

    const value = {
        signUp,
        signIn,
        signOut,
        linkAccount,
        user,
        profile,
        session,
        loading,
        isAnonymous,
        getUserId
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
