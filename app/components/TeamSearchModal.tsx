import React, { useState, useEffect, useRef } from 'react';

interface TeamSearchModalProps {
  open: boolean;
  onClose: () => void;
  teamList: string[];
  onSelect: (team: string) => void;
  dark?: boolean;
}

export default function TeamSearchModal({ open, onClose, teamList, onSelect, dark = true }: TeamSearchModalProps) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<string[]>(teamList);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setFiltered(teamList);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, teamList]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    setFiltered(
      term.length === 0
        ? []
        : teamList.filter(t => t.toLowerCase().includes(term))
    );
  }, [search, teamList]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 320,
        width: '90%',
        background: dark ? '#18181b' : '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px #000a',
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: dark ? '#fff' : '#18181b',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', color: dark ? '#fff' : '#18181b', fontSize: 22, cursor: 'pointer' }}>&times;</button>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 14, letterSpacing: 1 }}>Buscar Time</h2>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Digite o nome do time..."
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #333',
            background: dark ? '#222' : '#eee',
            color: dark ? '#fff' : '#18181b',
            fontSize: 15,
            marginBottom: 12,
            outline: 'none',
            fontFamily: 'Consolas, monospace',
          }}
        />
        <div style={{ width: '100%', maxHeight: 180, overflowY: 'auto', borderRadius: 8, background: dark ? '#222' : '#eee', border: '1px solid #333' }}>
          {search.trim().length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Digite para buscar</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nenhum time encontrado</div>
          ) : (
            filtered.map(team => (
              <div
                key={team}
                onClick={() => { onSelect(team); onClose(); }}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #333',
                  color: dark ? '#fff' : '#18181b',
                  fontSize: 15,
                  fontFamily: 'Consolas, monospace',
                  background: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseDown={e => e.preventDefault()}
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