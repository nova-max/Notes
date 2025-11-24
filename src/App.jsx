import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { SearchBar } from './components/SearchBar';
import { Login } from './components/Login';
import { SettingsModal } from './components/SettingsModal';
import { useNotes } from './hooks/useNotes';
import { useAuth, AuthProvider } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import { useCategories } from './hooks/useCategories';
import { FileText, Loader2 } from 'lucide-react';

function AppContent() {
    const { currentUser } = useAuth();
    const { notes, addNote, updateNote, deleteNote, loading } = useNotes();
    const { theme } = useTheme();
    const { categories, addCategory, deleteCategory } = useCategories();
    const [activeTab, setActiveTab] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const filteredNotes = useMemo(() => {
        let filtered = notes;

        // Filter by category
        if (activeCategory) {
            filtered = filtered.filter(n => n.category === activeCategory);
        }

        // Filter by tab
        if (activeTab === 'favorites') {
            filtered = filtered.filter(n => n.isFavorite);
        } else if (activeTab === 'recent') {
            filtered = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(n =>
                (n.title && n.title.toLowerCase().includes(query)) ||
                (n.content && n.content.toLowerCase().includes(query)) ||
                (n.tags && n.tags.some(t => t.toLowerCase().includes(query))) ||
                (n.category && n.category.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [notes, activeTab, activeCategory, searchQuery]);

    if (!currentUser) {
        return <Login />;
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent-color)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Cargando tus notas...</p>
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
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categories={categories}
                onNewNote={handleNewNote}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

            <main className="main-content">
                <header className="header">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
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
                            <FileText size={64} strokeWidth={1} style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                        <h2 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>No hay notas aquí</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {searchQuery ? 'No encontramos notas que coincidan con tu búsqueda.' : 'Crea tu primera nota para comenzar.'}
                        </p>
                        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleNewNote}>
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

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                categories={categories}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
                theme={theme}
            />
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

