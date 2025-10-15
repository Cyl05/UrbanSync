import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserRequest, clearUser } from '../store/userSlice';
import LoadingScreen from '../components/LoadingScreen';
import { AuthContext, type AuthContextType } from './AuthContext';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { currentUser, loading: userLoading, error } = useAppSelector((state) => state.user);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user?.id) {
                    dispatch(fetchUserRequest(session.user.id));
                    setTimeout(() => setIsInitializing(false), 100);
                } else {
                    dispatch(clearUser());
                    setIsInitializing(false);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                dispatch(clearUser());
                setIsInitializing(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' && session?.user?.id) {
                    dispatch(fetchUserRequest(session.user.id));
                } else if (event === 'SIGNED_OUT') {
                    dispatch(clearUser());
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    if (isInitializing || userLoading) {
        return <LoadingScreen loadingText="Loading..." />;
    }

    const value: AuthContextType = {
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading: userLoading,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
