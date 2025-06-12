"use client";
import { useState, useEffect } from 'react';

export default function HeaderWithMenu({ dark = true }: { dark?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fontSizeLogo = isMobile ? '1.6rem' : '2rem';
  const fontSizeSub = isMobile ? '0.8rem' : '1rem';

  const fg = dark ? '#fff' : '#18181b';
  const fgSub = dark ? '#9ca3af' : '#444';
  const bgMenu = dark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)';
  const borderMenu = dark ? '#374151' : '#bbb';
  const borderItem = dark ? '#222' : '#eee';
  const menuLink = dark ? '#fff' : '#18181b';

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '1.5rem 2rem 0.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 50,
      background: 'rgba(0, 0, 0, 0.0)',
      fontFamily: 'monospace',
      pointerEvents: 'none',
    }}>
      <div style={{ color: fg, fontFamily: 'monospace', pointerEvents: 'auto' }}>
        <div style={{ fontWeight: 'bold', fontSize: fontSizeLogo, lineHeight: 1 }}>{'unagi'}</div>
        <div style={{ color: fgSub, fontSize: fontSizeSub, letterSpacing: 1 }}>powered by AI</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24, pointerEvents: 'auto' }}>
        <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          <div style={{ color: fg, fontSize: fontSizeSub, letterSpacing: 1 }}>AI omni v4</div>
          <div style={{ color: fgSub, fontSize: fontSizeSub, letterSpacing: 1 }}>unagi.bet</div>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: fg,
              fontSize: 28,
              marginLeft: 8,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 40,
                right: 0,
                background: bgMenu,
                border: `1px solid ${borderMenu}`,
                borderRadius: 8,
                boxShadow: '0 4px 24px #000a',
                minWidth: 180,
                zIndex: 100,
                fontFamily: 'monospace',
              }}
              onClick={e => e.stopPropagation()}
            >
              <a href="/" style={{ display: 'block', color: menuLink, textDecoration: 'none', padding: '12px 20px', borderBottom: `1px solid ${borderItem}` }}>Home</a>
              <a href="/statistics" style={{ display: 'block', color: menuLink, textDecoration: 'none', padding: '12px 20px', borderBottom: `1px solid ${borderItem}` }}>Estatísticas</a>
              <a href="/banking" style={{ display: 'block', color: menuLink, textDecoration: 'none', padding: '12px 20px', borderBottom: `1px solid ${borderItem}` }}>Banking</a>
              <a href="/crowdmarketing" style={{ display: 'block', color: menuLink, textDecoration: 'none', padding: '12px 20px' }}>Crowd Marketing</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 