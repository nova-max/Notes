import React from 'react';

const Editor = ({ note, onUpdate }) => {
    if (!note) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a note or create a new one
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <div className="p-8 pb-4 border-b border-border/40">
                <input
                    type="text"
                    value={note.title}
                    onChange={(e) => onUpdate({ ...note, title: e.target.value })}
                    placeholder="Note Title"
                    className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                />
                <div className="text-sm text-muted-foreground mt-2">
                    {new Date(note.updatedAt).toLocaleString()}
                </div>
            </div>
            <div className="flex-1 p-8 pt-4 overflow-y-auto">
                <textarea
                    value={note.content}
                    onChange={(e) => onUpdate({ ...note, content: e.target.value })}
                    placeholder="Start typing..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed placeholder:text-muted-foreground/30"
                />
            </div>
        </div>
    );
};

export default Editor;
