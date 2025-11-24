import React from 'react';
import { LayoutGrid, Star, Clock, Settings, Plus, LogOut, Folder, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export function Sidebar({ activeTab, setActiveTab, onNewNote, activeCategory, setActiveCategory, categories, onOpenSettings }) {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'all', icon: LayoutGrid, label: 'Todas las Notas' },
        { id: 'favorites', icon: Star, label: 'Favoritos' },
        { id: 'recent', icon: Clock, label: 'Recientes' },
    ];

    return (
        <aside className="sidebar glass">
            <div className="logo">
                <span style={{ fontSize: '2rem' }}>✨</span> Notely AI
            </div>

            {currentUser && (
                <div className="user-profile">
                    <img
                        src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.email}&background=random`}
                        alt="Profile"
                        className="user-avatar"
                    />
                    <div className="user-info">
                        <span className="user-name">{currentUser.displayName || 'Usuario'}</span>
                        <span className="user-email">{currentUser.email}</span>
                    </div>
                </div>
            )}

            <button className="btn btn-primary" onClick={onNewNote}>
                <Plus size={20} />
                Nueva Nota
            </button>

            <nav style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>

            <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Folder size={16} />
                    Carpetas
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className={`nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="nav-item" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                </div>
                <div className="nav-item" onClick={onOpenSettings}>
                    <Settings size={20} />
                    <span>Configuración</span>
                </div>
                <div className="nav-item" onClick={logout} style={{ color: 'var(--danger-color)' }}>
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </div>
            </div>
        </aside>
    );
}
