import React from 'react';
import { Sparkles, X } from 'lucide-react';

const AnalysisPanel = ({ note, onClose }) => {
    return (
        <div className="w-80 bg-card border-l border-border h-screen flex flex-col shadow-xl">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Sparkles className="w-4 h-4" />
                    Gemini Analysis
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {!note ? (
                    <div className="text-center text-muted-foreground text-sm mt-10">
                        Select a note to analyze
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary</h4>
                            <p className="text-sm leading-relaxed">
                                This note appears to be about <strong>{note.title}</strong>. It contains {note.content.length} characters.
                                (Gemini integration placeholder)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Points</h4>
                            <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
                                <li>Point 1 extracted from text</li>
                                <li>Point 2 extracted from text</li>
                                <li>Point 3 extracted from text</li>
                            </ul>
                        </div>

                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <h4 className="text-xs font-bold text-primary mb-1">Suggestion</h4>
                            <p className="text-xs text-primary/80">
                                Try adding more details about the implementation phase to get better insights.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 border-t border-border">
                <button className="w-full py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors">
                    Refresh Analysis
                </button>
            </div>
        </div>
    );
};

export default AnalysisPanel;
