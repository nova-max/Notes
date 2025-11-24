import React from 'react';
import { Trash2, Star, Calendar, CheckSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function NoteCard({ note, onEdit, onDelete, onToggleFavorite, index }) {
    const date = new Date(note.createdAt).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const hasReminder = note.reminder && new Date(note.reminder) > new Date();
    const reminderDate = hasReminder ? new Date(note.reminder).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : null;

    const completedTodos = note.todos?.filter(t => t.completed).length || 0;
    const totalTodos = note.todos?.length || 0;

    return (
        <div
            className={`note-card animate-fade-in ${hasReminder ? 'has-reminder' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onEdit(note)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="note-date">{date}</span>
                <button
                    className="btn-icon"
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(note.id); }}
                    style={{ color: note.isFavorite ? '#fbbf24' : 'inherit' }}
                >
                    <Star size={16} fill={note.isFavorite ? '#fbbf24' : 'none'} />
                </button>
            </div>

            <h3 className="note-title">{note.title || 'Sin título'}</h3>

            <div className="note-preview">
                <ReactMarkdown>{note.content?.substring(0, 200) || 'Sin contenido...'}</ReactMarkdown>
            </div>

            {/* Categoría */}
            {note.category && note.category !== 'general' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span className="category-badge" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                        📁 {note.category}
                    </span>
                </div>
            )}

            {/* Tareas */}
            {totalTodos > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <CheckSquare size={16} />
                    <span>{completedTodos}/{totalTodos} completadas</span>
                </div>
            )}

            {/* Recordatorio */}
            {hasReminder && (
                <div className="reminder-badge">
                    <Calendar size={14} />
                    {reminderDate}
                </div>
            )}

            {/* Etiquetas */}
            <div className="note-tags">
                {note.tags && note.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginTop: '1rem'
            }}>
                <button
                    className="btn-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Estás seguro de eliminar esta nota?')) {
                            onDelete(note.id);
                        }
                    }}
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
