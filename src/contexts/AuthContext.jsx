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
        console.log('AuthContext: Initializing...');
        // Safety timeout to prevent infinite loading
        const safetyTimeout = setTimeout(() => {
            console.warn('AuthContext: Safety timeout triggered');
            setLoading(false);
        }, 5000);

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) throw error;

            console.log('AuthContext: getSession result', session ? 'Session found' : 'No session');
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                console.log('AuthContext: User found, fetching profile...');
                fetchProfile(session.user.id);
                setIsAnonymous(session.user.is_anonymous);
            } else {
                // No session, sign in anonymously
                console.log('AuthContext: No session, signing in anonymously...');
                signInAnonymously();
            }
        }).catch((error) => {
            console.error('AuthContext: Error getting session:', error);
            // If session is invalid/corrupt, clear it and retry anonymous login
            supabase.auth.signOut().then(() => {
                console.log('AuthContext: Signed out after error, retrying anonymous login...');
                signInAnonymously();
            });
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: Auth state change:', event, session ? 'Session active' : 'No session');
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
                setIsAnonymous(session.user.is_anonymous);
            } else {
                setProfile(null);
                // If signed out, sign in anonymously again to maintain a session
                // Only try to sign in if we are not already loading (to avoid race with initial load)
                if (!loading && event === 'SIGNED_OUT') {
                    console.log('AuthContext: User signed out, re-signing in anonymously...');
                    signInAnonymously();
                }
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    const signInAnonymously = async () => {
        try {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            console.log('AuthContext: Signed in anonymously success');
            // Explicitly set loading to false here to ensure app unblocks
            setLoading(false);
            return data;
        } catch (error) {
            console.error('AuthContext: Error signing in anonymously:', error);
            // If anonymous sign-in fails, we must stop loading to allow app to render (even if broken)
            setLoading(false);
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
                console.warn('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            setLoading(false);
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
