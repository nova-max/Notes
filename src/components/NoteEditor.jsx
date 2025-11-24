import React, { useState, useEffect } from 'react';
import { X, Save, Tag } from 'lucide-react';

export function NoteEditor({ note, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
            setTags(note.tags ? note.tags.join(', ') : '');
        } else {
            setTitle('');
            setContent('');
            setTags('');
        }
    }, [note]);

    const handleSave = () => {
        const processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        onSave({
            ...note,
            title,
            content,
            tags: processedTags,
            isFavorite: note?.isFavorite || false
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                <div className="editor-header">
                    <input
                        type="text"
                        className="editor-input-title"
                        placeholder="Título de la nota..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <button className="btn-icon" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="editor-body">
                    <textarea
                        className="editor-input-content"
                        placeholder="Escribe algo increíble..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <Tag size={18} className="text-secondary" />
                        <input
                            type="text"
                            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#94a3b8', width: '100%' }}
                            placeholder="Etiquetas (separadas por coma)..."
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                </div>

                <div className="editor-footer">
                    <button className="btn" style={{ color: '#94a3b8' }} onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} />
                        Guardar Nota
                    </button>
                </div>
            </div>
        </div>
    );
}
