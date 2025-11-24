import React from 'react';
import { LayoutGrid, Star, Clock, Settings, Plus } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, onNewNote }) {
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

            <div style={{ marginTop: 'auto' }}>
                <div className="nav-item">
                    <Settings size={20} />
                    <span>Configuración</span>
                </div>
            </div>
        </aside>
    );
}
