import React, { useState, useEffect, useRef } from 'react';

interface TeamSearchModalProps {
  open: boolean;
  onClose: () => void;
  teamList: string[];
  onSelect: (team: string) => void;
  dark?: boolean;
}

export default function TeamSearchModal({ open, onClose, teamList, onSelect, dark = true }: TeamSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<string[]>(teamList);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setFiltered(teamList);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, teamList]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    setFiltered(
      term.length === 0
        ? []
        : teamList.filter(t => t.toLowerCase().includes(term))
    );
  }, [searchTerm, teamList]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: dark ? '#18181b' : '#fff',
        borderRadius: 12,
        padding: 12,
        width: '100%',
        maxWidth: 290,
        boxSizing: 'border-box',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: dark ? '#fff' : '#18181b', margin: 0 }}>Search Team</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: dark ? '#fff' : '#18181b',
              cursor: 'pointer',
              fontSize: 20
            }}
          >
            ×
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent border-none outline-none text-base"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #333',
            background: dark ? '#222' : '#eee',
            color: dark ? '#fff' : '#18181b',
            fontSize: '16px',
            marginBottom: '12px',
            outline: 'none',
            fontFamily: 'Consolas, monospace',
            WebkitTextSizeAdjust: '100%',
            WebkitAppearance: 'none',
            appearance: 'none'
          }}
        />
        <div style={{ width: '100%', maxHeight: 140, overflowY: 'auto', borderRadius: 8, background: dark ? '#222' : '#eee', border: '1px solid #333' }}>
          {searchTerm.trim().length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Type to search</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', color: '#aaa', fontSize: 14 }}>No team found</div>
          ) : (
            filtered.map((team, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelect(team);
                  onClose();
                }}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  color: dark ? '#fff' : '#18181b',
                  borderBottom: index < filtered.length - 1 ? '1px solid #333' : 'none',
                  fontSize: 14,
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = dark ? '#333' : '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {team}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 