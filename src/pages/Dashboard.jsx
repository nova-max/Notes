import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AnalysisPanel from '../components/AnalysisPanel';
import { Sparkles } from 'lucide-react';

const Dashboard = () => {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Project Ideas', content: '1. AI Note Taker\n2. Personal Finance App\n3. Task Manager', updatedAt: new Date().toISOString(), preview: '1. AI Note Taker...' },
        { id: 2, title: 'Meeting Notes', content: 'Discussed Q3 goals and marketing strategy.', updatedAt: new Date().toISOString(), preview: 'Discussed Q3 goals...' },
    ]);
    const [activeNoteId, setActiveNoteId] = useState(1);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const activeNote = notes.find(n => n.id === activeNoteId);

    const handleUpdateNote = (updatedNote) => {
        setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    };

    const handleCreateNote = () => {
        const newNote = {
            id: Date.now(),
            title: '',
            content: '',
            updatedAt: new Date().toISOString(),
            preview: 'New note'
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar
                notes={notes}
                activeNoteId={activeNoteId}
                onSelectNote={setActiveNoteId}
                onCreateNote={handleCreateNote}
            />

            <div className="flex-1 flex relative">
                <Editor
                    note={activeNote}
                    onUpdate={handleUpdateNote}
                />

                {/* Floating Analysis Button */}
                {activeNote && !showAnalysis && (
                    <button
                        onClick={() => setShowAnalysis(true)}
                        className="absolute top-6 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 z-10"
                        title="Analyze with Gemini"
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                )}

                {showAnalysis && (
                    <AnalysisPanel
                        note={activeNote}
                        onClose={() => setShowAnalysis(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
