import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

// Function to convert hex to HSL
function hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Function to convert HSL to hex
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate palette based on a primary color
function generatePalette(primaryHex) {
    const primary = hexToHSL(primaryHex);

    return {
        primary: primaryHex,
        primaryLight: hslToHex(primary.h, primary.s, Math.min(primary.l + 15, 90)),
        primaryDark: hslToHex(primary.h, primary.s, Math.max(primary.l - 15, 10)),
        secondary: hslToHex((primary.h + 180) % 360, primary.s, primary.l), // Complementary
        accent: hslToHex((primary.h + 30) % 360, Math.min(primary.s + 10, 100), primary.l), // Analogous
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
    };
}

export function useColorPalette() {
    const { currentUser } = useAuth();
    const [primaryColor, setPrimaryColor] = useState('#8b5cf6'); // Default purple
    const [palette, setPalette] = useState(generatePalette('#8b5cf6'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const loadPalette = async () => {
            try {
                const docRef = doc(db, 'Configuracion', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().primaryColor) {
                    const savedColor = docSnap.data().primaryColor;
                    setPrimaryColor(savedColor);
                    setPalette(generatePalette(savedColor));
                }
            } catch (error) {
                console.error("Error loading palette:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPalette();
    }, [currentUser]);

    // Apply palette to CSS variables
    useEffect(() => {
        const root = document.documentElement;
        const theme = root.getAttribute('data-theme') || 'dark';

        if (theme === 'dark') {
            root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)`);
            root.style.setProperty('--accent-color', palette.primary);
            root.style.setProperty('--accent-hover', palette.primaryLight);
        } else {
            root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 100%)`);
            root.style.setProperty('--accent-color', palette.primaryDark);
            root.style.setProperty('--accent-hover', palette.primary);
        }
    }, [palette]);

    const updatePrimaryColor = async (newColor) => {
        if (!currentUser) return;

        try {
            const newPalette = generatePalette(newColor);
            setPrimaryColor(newColor);
            setPalette(newPalette);

            const docRef = doc(db, 'Configuracion', currentUser.uid);
            await setDoc(docRef, { primaryColor: newColor }, { merge: true });
        } catch (error) {
            console.error("Error saving palette:", error);
        }
    };

    return { primaryColor, palette, updatePrimaryColor, loading };
}
