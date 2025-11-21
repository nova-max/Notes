import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, subscribeToNotes, saveNote, deleteNote } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiEdit, FiTrash2, FiPlus, FiLogOut, FiSearch, FiMenu,
    FiStar, FiTag, FiEye, FiEdit3, FiClock, FiSave, FiMoon, FiSun, FiCheck
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);
    const [newTag, setNewTag] = useState('');

    // Nuevos estados
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const unsubscribe = subscribeToNotes(setNotes);
            return () => unsubscribe();
        } else {
            setNotes([]);
        }
    }, [user]);

    // Efecto para Modo Oscuro
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleCreateNote = async () => {
        try {
            const newNote = {
                id: Date.now().toString(),
                title: '',
                content: '',
                tags: [],
                pinned: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Optimistic UI: Agregar inmediatamente a la lista y activar
            setActiveNote(newNote);
            setNotes(prev => [newNote, ...prev]);
            setPreviewMode(false);

            await saveNote(newNote);
        } catch (error) {
            console.error("Error creating note:", error);
            alert("Error al crear la nota.");
        }
    };

    const handleUpdateNote = (key, value) => {
        if (!activeNote) return;
        const updatedNote = {
            ...activeNote,
            [key]: value,
            updatedAt: new Date().toISOString()
        };

        setActiveNote(updatedNote);
        setNotes(prevNotes =>
            prevNotes.map(n => n.id === activeNote.id ? updatedNote : n)
        );

        // Auto-save
        saveNote(updatedNote);
    };

    const handleManualSave = async () => {
        if (!activeNote) return;
        setIsSaving(true);
        await saveNote(activeNote);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const togglePin = (e, note) => {
        e.stopPropagation();
        const updatedNote = { ...note, pinned: !note.pinned };
        saveNote(updatedNote);
        if (activeNote?.id === note.id) {
            setActiveNote(updatedNote);
        }
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            const tags = activeNote.tags || [];
            if (!tags.includes(newTag.trim())) {
                handleUpdateNote('tags', [...tags, newTag.trim()]);
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        const tags = activeNote.tags || [];
        handleUpdateNote('tags', tags.filter(t => t !== tagToRemove));
    };

    const handleDeleteNote = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar esta nota permanentemente?')) {
            await deleteNote(id);
            if (activeNote?.id === id) setActiveNote(null);
        }
    };

    const filteredNotes = notes.filter(n =>
        (n.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (n.content?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (n.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

    const pinnedNotes = filteredNotes.filter(n => n.pinned);
    const otherNotes = filteredNotes.filter(n => !n.pinned);

    if (loading) return <div className="loading">Cargando...</div>;

    if (!user) {
        return (
            <div className="login-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="login-card"
                >
                    <h1>Notely</h1>
                    <p>Tus pensamientos, organizados elegantemente.</p>
                    <button onClick={signInWithGoogle} className="google-btn">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="google-icon" />
                        Iniciar sesión con Google
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <motion.aside
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: sidebarOpen ? 0 : -280, opacity: 1, width: sidebarOpen ? 280 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="sidebar"
            >
                <div className="sidebar-header">
                    <div className="user-profile">
                        <img src={user.photoURL} alt="Profile" />
                        <div className="user-info">
                            <span className="user-name">{user.displayName}</span>
                            <span className="user-email">Premium Plan</span>
                        </div>
                    </div>
                    <div className="sidebar-controls">
                        <button onClick={toggleTheme} className="theme-btn" title="Cambiar tema">
                            {darkMode ? <FiSun /> : <FiMoon />}
                        </button>
                        <button onClick={() => setSidebarOpen(false)} className="close-sidebar-mobile">✕</button>
                    </div>
                </div>

                <div className="search-bar">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Buscar notas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateNote}
                    className="new-note-btn"
                >
                    <FiPlus /> Nueva Nota
                </motion.button>

                <div className="notes-list">
                    <AnimatePresence>
                        {pinnedNotes.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-title">📌 FIJADAS</motion.div>
                        )}
                        {pinnedNotes.map(note => (
                            <NoteItem
                                key={note.id}
                                note={note}
                                active={activeNote?.id === note.id}
                                onClick={() => setActiveNote(note)}
                                onDelete={handleDeleteNote}
                                onPin={togglePin}
                            />
                        ))}

                        {otherNotes.length > 0 && pinnedNotes.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-title">📝 NOTAS</motion.div>
                        )}
                        {otherNotes.map(note => (
                            <NoteItem
                                key={note.id}
                                note={note}
                                active={activeNote?.id === note.id}
                                onClick={() => setActiveNote(note)}
                                onDelete={handleDeleteNote}
                                onPin={togglePin}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <button onClick={logout} className="logout-btn">
                    <FiLogOut /> Cerrar Sesión
                </button>
            </motion.aside>

            <main className="editor-area">
                {!sidebarOpen && (
                    <button className="toggle-sidebar" onClick={() => setSidebarOpen(true)}>
                        <FiMenu />
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {activeNote ? (
                        <motion.div
                            key={activeNote.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="editor"
                        >
                            <div className="editor-header">
                                <div className="editor-meta">
                                    <span className="last-updated">
                                        <FiClock /> {isSaving ? 'Guardando...' : `Guardado ${formatDistanceToNow(new Date(activeNote.updatedAt || activeNote.createdAt), { addSuffix: true, locale: es })}`}
                                    </span>
                                </div>
                                <div className="editor-actions">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`action-btn ${activeNote.pinned ? 'active' : ''}`}
                                        onClick={(e) => togglePin(e, activeNote)}
                                        title="Fijar nota"
                                    >
                                        <FiStar />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`action-btn ${previewMode ? 'active' : ''}`}
                                        onClick={() => setPreviewMode(!previewMode)}
                                        title="Vista previa"
                                    >
                                        {previewMode ? <FiEdit3 /> : <FiEye />}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`action-btn save-btn ${isSaving ? 'saving' : ''}`}
                                        onClick={handleManualSave}
                                        title="Guardar ahora"
                                    >
                                        {isSaving ? <FiCheck /> : <FiSave />}
                                    </motion.button>
                                </div>
                            </div>

                            <input
                                type="text"
                                className="editor-title"
                                placeholder="Título de la nota"
                                value={activeNote.title}
                                onChange={(e) => handleUpdateNote('title', e.target.value)}
                            />

                            <div className="tags-input-container">
                                <FiTag className="tag-icon" />
                                <div className="tags-list">
                                    <AnimatePresence>
                                        {(activeNote.tags || []).map(tag => (
                                            <motion.span
                                                key={tag}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="tag-chip"
                                            >
                                                {tag}
                                                <button onClick={() => removeTag(tag)}>×</button>
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                    <input
                                        type="text"
                                        placeholder="Añadir etiqueta..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={addTag}
                                        className="tag-input"
                                    />
                                </div>
                            </div>

                            {previewMode ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="markdown-preview"
                                >
                                    <ReactMarkdown>{activeNote.content || '*Sin contenido*'}</ReactMarkdown>
                                </motion.div>
                            ) : (
                                <textarea
                                    className="editor-content"
                                    placeholder="Escribe algo increíble... (Soporta Markdown)"
                                    value={activeNote.content}
                                    onChange={(e) => handleUpdateNote('content', e.target.value)}
                                />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="empty-state"
                        >
                            <div className="empty-icon">✨</div>
                            <h2>Selecciona una nota o crea una nueva</h2>
                            <p>Tus ideas merecen un lugar hermoso.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

const NoteItem = ({ note, active, onClick, onDelete, onPin }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ scale: 1.02, x: 4 }}
        className={`note-item ${active ? 'active' : ''}`}
        onClick={onClick}
    >
        <div className="note-item-content">
            <h3>{note.title || 'Sin título'}</h3>
            <p>{note.content?.substring(0, 40) || '...'}</p>
            <div className="note-tags-preview">
                {(note.tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="mini-tag">#{tag}</span>
                ))}
            </div>
        </div>
        <div className="note-actions">
            <button
                className={`pin-btn ${note.pinned ? 'pinned' : ''}`}
                onClick={(e) => onPin(e, note)}
            >
                <FiStar />
            </button>
            <button
                className="delete-btn"
                onClick={(e) => onDelete(e, note.id)}
            >
                <FiTrash2 />
            </button>
        </div>
    </motion.div>
);

export default App;
