import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useNotes() {
    const [notes, setNotes] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setNotes([]);
            setLoading(false);
            return;
        }

        // Query notes for the current user
        const q = query(
            collection(db, 'Notas'),
            where('uid', '==', currentUser.uid)
            // Note: Composite index might be required for orderBy with where clause
            // If it fails, we can sort client-side or create the index in Firebase Console
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // Map Firestore fields to App fields
                return {
                    id: doc.id,
                    title: data.Titulo,
                    content: data.Contenido,
                    tags: data.Etiquetas || [],
                    isFavorite: data.Fijado || false,
                    createdAt: data.FechaCreacion,
                    // Keep original data too just in case
                    ...data
                };
            });

            // Sort client-side to avoid index issues for now
            notesData.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA;
            });

            setNotes(notesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const addNote = async (note) => {
        if (!currentUser) return;

        try {
            const now = new Date().toISOString();
            await addDoc(collection(db, 'Notas'), {
                uid: currentUser.uid,
                Titulo: note.title,
                Contenido: note.content,
                Etiquetas: note.tags || [],
                Fijado: note.isFavorite || false,
                FechaCreacion: now,
                Fecha: now // Keeping consistent with screenshot
            });
        } catch (error) {
            console.error("Error adding note: ", error);
        }
    };

    const updateNote = async (id, updatedNote) => {
        if (!currentUser) return;

        try {
            const noteRef = doc(db, 'Notas', id);

            // Prepare update object mapping back to Firestore fields
            const updateData = {};
            if (updatedNote.title !== undefined) updateData.Titulo = updatedNote.title;
            if (updatedNote.content !== undefined) updateData.Contenido = updatedNote.content;
            if (updatedNote.tags !== undefined) updateData.Etiquetas = updatedNote.tags;
            if (updatedNote.isFavorite !== undefined) updateData.Fijado = updatedNote.isFavorite;

            await updateDoc(noteRef, updateData);
        } catch (error) {
            console.error("Error updating note: ", error);
        }
    };

    const deleteNote = async (id) => {
        if (!currentUser) return;

        try {
            await deleteDoc(doc(db, 'Notas', id));
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
    };

    return { notes, addNote, updateNote, deleteNote, loading };
}
