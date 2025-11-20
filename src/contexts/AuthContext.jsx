import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Generate a unique GUID for anonymous users
const generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Get or create anonymous user ID
const getAnonymousUserId = () => {
    let anonId = localStorage.getItem('wordOdysseyAnonUserId');
    if (!anonId) {
        anonId = generateGUID();
        localStorage.setItem('wordOdysseyAnonUserId', anonId);
    }
    return anonId;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [anonymousId, setAnonymousId] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
                setIsAnonymous(false);
            } else {
                // Create anonymous user
                const anonId = getAnonymousUserId();
                setAnonymousId(anonId);
                setIsAnonymous(true);
                setLoading(false);
            }
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
                setIsAnonymous(false);
            } else {
                setProfile(null);
                const anonId = getAnonymousUserId();
                setAnonymousId(anonId);
                setIsAnonymous(true);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

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
        }
    };

    const signUp = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        // If signup successful and there's anonymous data, we can migrate it later
        if (data.user && !error && anonymousId) {
            // Store the anonymous ID to migrate progress later
            localStorage.setItem('wordOdysseyMigrationPending', anonymousId);
        }

        return { data, error };
    };

    const signIn = async (email, password) => {
        const result = await supabase.auth.signInWithPassword({ email, password });

        // Check if we need to migrate anonymous data
        const migrationId = localStorage.getItem('wordOdysseyMigrationPending');
        if (result.data.user && !result.error && migrationId) {
            // Migration will happen in the game progress service
            localStorage.removeItem('wordOdysseyMigrationPending');
        }

        return result;
    };

    const signOut = async () => {
        const result = await supabase.auth.signOut();
        // Re-create anonymous user
        const anonId = generateGUID();
        localStorage.setItem('wordOdysseyAnonUserId', anonId);
        setAnonymousId(anonId);
        setIsAnonymous(true);
        return result;
    };

    // Get the current user ID (either real user or anonymous)
    const getUserId = () => {
        return user?.id || anonymousId;
    };

    const value = {
        signUp,
        signIn,
        signOut,
        user,
        profile,
        session,
        loading,
        anonymousId,
        isAnonymous,
        getUserId
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
