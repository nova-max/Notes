import React from 'react';
import { LayoutGrid, Star, Clock, Settings, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ activeTab, setActiveTab, onNewNote }) {
    const { currentUser, logout } = useAuth();

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

            <nav style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="nav-item">
                    <Settings size={20} />
                    <span>Configuración</span>
                </div>
                <div className="nav-item" onClick={logout} style={{ color: '#ef4444' }}>
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </div>
            </div>
        </aside>
    );
}
