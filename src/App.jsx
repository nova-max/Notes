import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { SearchBar } from './components/SearchBar';
import { Login } from './components/Login';
import { useNotes } from './hooks/useNotes';
import { useAuth, AuthProvider } from './context/AuthContext';
import { FileText, Loader2 } from 'lucide-react';

function AppContent() {
    const { currentUser } = useAuth();
    const { notes, addNote, updateNote, deleteNote, loading } = useNotes();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const filteredNotes = useMemo(() => {
        let filtered = notes;

        // Filter by tab
        if (activeTab === 'favorites') {
            filtered = filtered.filter(n => n.isFavorite);
        } else if (activeTab === 'recent') {
            // Already sorted by date in useNotes
            filtered = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(n =>
                (n.title && n.title.toLowerCase().includes(query)) ||
                (n.content && n.content.toLowerCase().includes(query)) ||
                (n.tags && n.tags.some(t => t.toLowerCase().includes(query)))
            );
        }

        return filtered;
    }, [notes, activeTab, searchQuery]);

    if (!currentUser) {
        return <Login />;
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    const handleNewNote = () => {
        setEditingNote(null);
        setIsEditorOpen(true);
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setIsEditorOpen(true);
    };

    const handleSaveNote = (noteData) => {
        if (editingNote) {
            updateNote(editingNote.id, noteData);
        } else {
            addNote(noteData);
        }
    };

    const toggleFavorite = (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            updateNote(id, { isFavorite: !note.isFavorite });
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onNewNote={handleNewNote}
            />

            <main className="main-content">
                <header className="header">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            {filteredNotes.length} notas
                        </span>
                    </div>
                </header>

                {filteredNotes.length > 0 ? (
                    <div className="notes-grid">
                        {filteredNotes.map((note, index) => (
                            <NoteCard
                                key={note.id}
                                index={index}
                                note={note}
                                onEdit={handleEditNote}
                                onDelete={deleteNote}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state animate-fade-in">
                        <div className="empty-icon">
                            <FileText size={64} strokeWidth={1} />
                        </div>
                        <h2>No se encontraron notas</h2>
                        <p>Crea una nueva nota para empezar o ajusta tu búsqueda.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleNewNote}>
                            Crear Nota
                        </button>
                    </div>
                )}
            </main>

            {isEditorOpen && (
                <NoteEditor
                    note={editingNote}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSaveNote}
                />
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
