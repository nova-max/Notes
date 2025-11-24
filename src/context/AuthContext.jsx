import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [driveAccessToken, setDriveAccessToken] = useState(null);

    function login() {
        // Add Google Drive scope
        googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

        return signInWithPopup(auth, googleProvider).then((result) => {
            // Get the access token
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;

            if (token) {
                setDriveAccessToken(token);
                // Store in sessionStorage for persistence
                sessionStorage.setItem('driveAccessToken', token);
            }

            return result;
        });
    }

    function logout() {
        setDriveAccessToken(null);
        sessionStorage.removeItem('driveAccessToken');
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            // Try to restore access token from sessionStorage
            if (user) {
                const storedToken = sessionStorage.getItem('driveAccessToken');
                if (storedToken) {
                    setDriveAccessToken(storedToken);
                }
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        driveAccessToken,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

