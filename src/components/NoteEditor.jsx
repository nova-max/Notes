import React, { useState, useEffect } from 'react';
import { X, Save, Tag, Calendar, CheckSquare, Image as ImageIcon, Bold, Italic, List, Code, Eye, EyeOff, FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';

export function NoteEditor({ note, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('general');
    const [reminder, setReminder] = useState('');
    const [todos, setTodos] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
            setTags(note.tags ? note.tags.join(', ') : '');
            setCategory(note.category || 'general');
            setReminder(note.reminder || '');
            setTodos(note.todos || []);
        } else {
            setTitle('');
            setContent('');
            setTags('');
            setCategory('general');
            setReminder('');
            setTodos([]);
        }
    }, [note]);

    const handleSave = () => {
        const processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        onSave({
            ...note,
            title,
            content,
            tags: processedTags,
            category,
            reminder,
            todos,
            isFavorite: note?.isFavorite || false
        });
        onClose();
    };

    const insertMarkdown = (syntax) => {
        const textarea = document.getElementById('content-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let newText = '';
        switch (syntax) {
            case 'bold':
                newText = content.substring(0, start) + `**${selectedText || 'texto'}**` + content.substring(end);
                break;
            case 'italic':
                newText = content.substring(0, start) + `*${selectedText || 'texto'}*` + content.substring(end);
                break;
            case 'list':
                newText = content.substring(0, start) + `\n- ${selectedText || 'item'}\n` + content.substring(end);
                break;
            case 'code':
                newText = content.substring(0, start) + `\`${selectedText || 'código'}\`` + content.substring(end);
                break;
            case 'heading':
                newText = content.substring(0, start) + `## ${selectedText || 'Título'}\n` + content.substring(end);
                break;
            default:
                return;
        }
        setContent(newText);
    };

    const addTodo = () => {
        setTodos([...todos, { id: Date.now(), text: '', completed: false }]);
    };

    const updateTodo = (id, field, value) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, [field]: value } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(title || 'Sin título', 20, 20);
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, 40);
        doc.save(`${title || 'nota'}.pdf`);
    };

    const exportToTXT = () => {
        const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'nota'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" onClick={() => setShowPreview(!showPreview)} title="Vista previa">
                            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button className="btn-icon" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="editor-toolbar" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <button className="btn-icon" onClick={() => insertMarkdown('bold')} title="Negrita">
                        <Bold size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => insertMarkdown('italic')} title="Cursiva">
                        <Italic size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => insertMarkdown('list')} title="Lista">
                        <List size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => insertMarkdown('code')} title="Código">
                        <Code size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => insertMarkdown('heading')} title="Encabezado">
                        H
                    </button>
                    <button className="btn-icon" onClick={addTodo} title="Agregar tarea">
                        <CheckSquare size={18} />
                    </button>
                </div>

                <div className="editor-body">
                    {/* Tareas pendientes */}
                    {todos.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            {todos.map(todo => (
                                <div key={todo.id} className="todo-item">
                                    <input
                                        type="checkbox"
                                        className="todo-checkbox"
                                        checked={todo.completed}
                                        onChange={(e) => updateTodo(todo.id, 'completed', e.target.checked)}
                                    />
                                    <input
                                        type="text"
                                        className="todo-text"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            textDecoration: todo.completed ? 'line-through' : 'none'
                                        }}
                                        value={todo.text}
                                        onChange={(e) => updateTodo(todo.id, 'text', e.target.value)}
                                        placeholder="Nueva tarea..."
                                    />
                                    <button className="btn-icon" onClick={() => deleteTodo(todo.id)}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Contenido */}
                    {showPreview ? (
                        <div className="markdown-preview">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            id="content-textarea"
                            className="editor-input-content"
                            placeholder="Escribe algo increíble... (Soporta Markdown: **negrita**, *cursiva*, ## Título)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}

                    {/* Meta información */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={18} style={{ color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Etiquetas (separadas por coma)..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={reminder}
                                    onChange={(e) => setReminder(e.target.value)}
                                />
                            </div>

                            <select
                                className="form-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <option value="general">General</option>
                                <option value="personal">Personal</option>
                                <option value="trabajo">Trabajo</option>
                                <option value="ideas">Ideas</option>
                                <option value="proyectos">Proyectos</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="editor-footer">
                    <div className="footer-actions">
                        <button className="btn-icon" onClick={exportToPDF} title="Exportar a PDF">
                            <FileDown size={18} />
                            PDF
                        </button>
                        <button className="btn-icon" onClick={exportToTXT} title="Exportar a TXT">
                            <FileDown size={18} />
                            TXT
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            <Save size={18} />
                            Guardar Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
