import React from 'react';
import { Trash2, Edit2, Star } from 'lucide-react';

export function NoteCard({ note, onEdit, onDelete, onToggleFavorite, index }) {
    const date = new Date(note.createdAt).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div
            className={`note-card animate-fade-in`}
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
            <p className="note-preview">{note.content || 'Sin contenido...'}</p>

            <div className="note-tags">
                {note.tags && note.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginTop: '1rem',
                opacity: 0.5,
                transition: 'opacity 0.2s'
            }}
                className="card-actions"
            >
                <button
                    className="btn-icon"
                    onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
