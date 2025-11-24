import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useDriveBackup } from '../hooks/useDriveBackup';

export function SettingsModal({ isOpen, onClose, categories, onAddCategory, onDeleteCategory, theme, notes }) {
    const [newCategory, setNewCategory] = useState({ label: '', icon: '📁' });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const { uploadBackup, getLastBackupInfo, isBackingUp, backupStatus, hasAccessToken } = useDriveBackup();
    const [lastBackupInfo, setLastBackupInfo] = useState(null);

    const emojiList = ['📁', '📂', '📚', '📖', '📝', '✨', '🎯', '🎨', '🏃', '💻', '🎵', '🎮', '📱', '🏠', '🌟', '💎', '🔥', '⚡', '🌈', '🎪'];

    useEffect(() => {
        if (isOpen && hasAccessToken) {
            getLastBackupInfo().then(info => setLastBackupInfo(info));
        }
    }, [isOpen, hasAccessToken]);

    if (!isOpen) return null;

    const handleAddCategory = () => {
        if (newCategory.label.trim()) {
            onAddCategory(newCategory);
            setNewCategory({ label: '', icon: '📁' });
            setIsAddingCategory(false);
        }
    };

    const handleBackup = async () => {
        try {
            await uploadBackup(notes);
            const info = await getLastBackupInfo();
            setLastBackupInfo(info);
        } catch (error) {
            console.error('Backup failed:', error);
        }
    };

    const customCategories = categories.filter(c => !c.isDefault);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="editor-header">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                        ⚙️ Configuración
                    </h2>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="editor-body">
                    {/* Theme Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-color)' }}>
                            🎨 Apariencia
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Tema actual: <strong>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</strong>
                        </p>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            Usa el botón en la barra lateral para cambiar el tema.
                        </p>
                    </div>

                    {/* Backup Section */}
                    {hasAccessToken && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-color)' }}>
                                💾 Copias de Seguridad (Google Drive)
                            </h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    Crea una copia de seguridad de todas tus notas en Google Drive.
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleBackup}
                                    disabled={isBackingUp}
                                    style={{ width: '100%' }}
                                >
                                    {isBackingUp ? '⏳ Creando respaldo...' : '💾 Crear Copia de Seguridad'}
                                </button>
                            </div>

                            {backupStatus.message && (
                                <div
                                    className="glass"
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        background: backupStatus.success === true
                                            ? 'rgba(16, 185, 129, 0.1)'
                                            : backupStatus.success === false
                                                ? 'rgba(239, 68, 68, 0.1)'
                                                : 'var(--input-bg)',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: backupStatus.success === true
                                            ? 'var(--success-color)'
                                            : backupStatus.success === false
                                                ? 'var(--danger-color)'
                                                : 'var(--text-secondary)'
                                    }}>
                                        {backupStatus.message}
                                    </p>
                                </div>
                            )}

                            {lastBackupInfo && (
                                <div className="glass" style={{ padding: '1rem', borderRadius: '12px', background: 'var(--input-bg)' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                        📅 Última copia: {new Date(lastBackupInfo.date).toLocaleString('es-ES')}
                                        <br />
                                        📝 Notas respaldadas: {lastBackupInfo.notesCount}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Categories Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-color)' }}>
                                📁 Carpetas Personalizadas
                            </h3>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                onClick={() => setIsAddingCategory(!isAddingCategory)}
                            >
                                <Plus size={16} />
                                Nueva Carpeta
                            </button>
                        </div>

                        {/* Add Category Form */}
                        {isAddingCategory && (
                            <div className="glass" style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label className="form-label">Nombre de la carpeta</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej: Recetas, Gimnasio, Proyectos..."
                                        value={newCategory.label}
                                        onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label className="form-label">Ícono</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {emojiList.map(emoji => (
                                            <button
                                                key={emoji}
                                                className="btn-icon"
                                                style={{
                                                    fontSize: '1.5rem',
                                                    padding: '0.5rem',
                                                    background: newCategory.icon === emoji ? 'var(--accent-color)' : 'transparent'
                                                }}
                                                onClick={() => setNewCategory({ ...newCategory, icon: emoji })}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        onClick={() => setIsAddingCategory(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        onClick={handleAddCategory}
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Categories List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {customCategories.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
                                    No tienes carpetas personalizadas aún. ¡Crea una!
                                </p>
                            ) : (
                                customCategories.map(category => (
                                    <div
                                        key={category.id}
                                        className="glass"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                                            <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>{category.label}</span>
                                        </div>
                                        <button
                                            className="btn-icon"
                                            onClick={() => {
                                                if (confirm(`¿Eliminar la carpeta "${category.label}"?`)) {
                                                    onDeleteCategory(category.id);
                                                }
                                            }}
                                            style={{ color: 'var(--danger-color)' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="glass" style={{ padding: '1rem', borderRadius: '12px', background: 'var(--input-bg)' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                            ℹ️ Información
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Las carpetas por defecto (General, Personal, Trabajo, Ideas, Proyectos) no se pueden eliminar.
                            Tus carpetas personalizadas se guardan en la nube y estarán disponibles en todos tus dispositivos.
                        </p>
                    </div>
                </div>

                <div className="editor-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
