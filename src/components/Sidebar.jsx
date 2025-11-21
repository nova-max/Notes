import React from 'react';
import { Plus, Search, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ notes, activeNoteId, onSelectNote, onCreateNote }) => {
    const { logout, user } = useAuth();

    return (
        <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h3 className="font-medium truncate">{user?.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{user?.type === 'google' ? 'Cloud Sync' : 'Local Mode'}</p>
                    </div>
                </div>
                <button
                    onClick={onCreateNote}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Note
                </button>
            </div>

            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full bg-secondary/50 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {notes.map(note => (
                    <button
                        key={note.id}
                        onClick={() => onSelectNote(note.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex flex-col gap-1 ${activeNoteId === note.id ? 'bg-secondary text-secondary-foreground' : 'hover:bg-secondary/50 text-muted-foreground'
                            }`}
                    >
                        <span className="font-medium truncate">{note.title || 'Untitled Note'}</span>
                        <span className="text-xs opacity-70 truncate">{note.preview || 'No content'}</span>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-border mt-auto">
                <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
