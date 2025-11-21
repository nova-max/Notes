import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session (mock implementation for now)
        const storedUser = localStorage.getItem('appnotas_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (codeResponse) => {
            // In a real app, you'd exchange code for token or get user info
            // For now, we'll mock a user object
            const mockUser = {
                id: 'google_123',
                name: 'Google User',
                email: 'user@example.com',
                type: 'google',
                accessToken: codeResponse.access_token
            };
            setUser(mockUser);
            localStorage.setItem('appnotas_user', JSON.stringify(mockUser));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const loginAsGuest = () => {
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Guest User',
            type: 'local'
        };
        setUser(guestUser);
        localStorage.setItem('appnotas_user', JSON.stringify(guestUser));
    };

    const logout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('appnotas_user');
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, loginAsGuest, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
