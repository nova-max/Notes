import React from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <Search size={20} className="text-secondary" />
            <input
                type="text"
                className="search-input"
                placeholder="Buscar en tus notas..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
