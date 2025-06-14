import React, { useState, useEffect, useRef } from 'react';

interface TeamSearchModalProps {
  open: boolean;
  onClose: () => void;
  teamList: string[];
  onSelect: (team: string) => void;
  dark?: boolean;
  title?: string;
  autoFocus?: boolean;
}

export default function TeamSearchModal({ open, onClose, teamList, onSelect, dark = true, title, autoFocus = true }: TeamSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<string[]>(teamList);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setFiltered(teamList);
      if (autoFocus) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [open, teamList, autoFocus]);

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
        background: dark
          ? 'rgba(24, 24, 27, 0.85)'
          : 'rgba(255,255,255,0.85)',
        borderRadius: 18,
        padding: 16,
        width: '100%',
        maxWidth: 270,
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px 0 rgba(34,197,94,0.18)',
        border: '2px solid #22c55e',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{
            color: '#22c55e',
            margin: 0,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 1,
            textShadow: '0 2px 8px #0006',
            textAlign: 'center',
            width: '100%'
          }}>{title || 'Search Team'}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: dark ? '#fff' : '#18181b',
              cursor: 'pointer',
              fontSize: 28,
              fontWeight: 700,
              marginLeft: 8,
              width: 38,
              height: 38,
              borderRadius: 19,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            aria-label="Close"
            onMouseOver={e => e.currentTarget.style.background = '#22c55e22'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
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
            border: '2px solid #22c55e',
            background: dark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
            color: dark ? '#fff' : '#18181b',
            fontSize: '16px',
            marginBottom: '14px',
            outline: 'none',
            fontFamily: 'Consolas, monospace',
            WebkitTextSizeAdjust: '100%',
            WebkitAppearance: 'none',
            appearance: 'none',
            boxShadow: '0 2px 8px #22c55e33',
            transition: 'border 0.2s, box-shadow 0.2s',
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
                  borderBottom: index < filtered.length - 1 ? '1px solid #22c55e' : 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  transition: 'background 0.2s, color 0.2s',
                  background: 'transparent',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#22c55e22';
                  e.currentTarget.style.color = '#22c55e';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = dark ? '#fff' : '#18181b';
                }}
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