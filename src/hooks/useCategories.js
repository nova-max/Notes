import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useCategories() {
    const [categories, setCategories] = useState([
        { id: 'general', label: 'General', icon: '📋', isDefault: true },
        { id: 'personal', label: 'Personal', icon: '👤', isDefault: true },
        { id: 'trabajo', label: 'Trabajo', icon: '💼', isDefault: true },
        { id: 'ideas', label: 'Ideas', icon: '💡', isDefault: true },
        { id: 'proyectos', label: 'Proyectos', icon: '🚀', isDefault: true },
    ]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const loadCategories = async () => {
            try {
                const docRef = doc(db, 'Configuracion', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().categorias) {
                    const customCategories = docSnap.data().categorias;
                    setCategories(prev => {
                        const defaults = prev.filter(c => c.isDefault);
                        return [...defaults, ...customCategories];
                    });
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [currentUser]);

    const saveCategories = async (newCategories) => {
        if (!currentUser) return;

        try {
            const customCategories = newCategories.filter(c => !c.isDefault);
            const docRef = doc(db, 'Configuracion', currentUser.uid);
            await setDoc(docRef, { categorias: customCategories }, { merge: true });
            setCategories(newCategories);
        } catch (error) {
            console.error("Error saving categories:", error);
        }
    };

    const addCategory = (category) => {
        const newCategory = {
            id: `custom_${Date.now()}`,
            label: category.label,
            icon: category.icon,
            isDefault: false
        };
        const newCategories = [...categories, newCategory];
        saveCategories(newCategories);
    };

    const updateCategory = (id, updates) => {
        const newCategories = categories.map(c =>
            c.id === id ? { ...c, ...updates } : c
        );
        saveCategories(newCategories);
    };

    const deleteCategory = (id) => {
        const newCategories = categories.filter(c => c.id !== id);
        saveCategories(newCategories);
    };

    return { categories, addCategory, updateCategory, deleteCategory, loading };
}
