import { useState, useEffect } from 'react';

export function useNotes() {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('premium-notes-app');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('premium-notes-app', JSON.stringify(notes));
    }, [notes]);

    const addNote = (note) => {
        setNotes([
            {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                ...note,
            },
            ...notes,
        ]);
    };

    const updateNote = (id, updatedNote) => {
        setNotes(notes.map((n) => (n.id === id ? { ...n, ...updatedNote } : n)));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter((n) => n.id !== id));
    };

    return { notes, addNote, updateNote, deleteNote };
}
