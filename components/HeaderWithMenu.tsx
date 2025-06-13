"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';

export default function HeaderWithMenu({ dark = true }: { dark?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const fontSizeLogo = isMobile ? '1.6rem' : '2rem';
  const fontSizeSub = isMobile ? '0.8rem' : '1rem';

  const fg = dark ? '#fff' : '#18181b';
  const fgSub = dark ? '#9ca3af' : '#444';
  const bgMenu = dark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)';
  const borderMenu = dark ? '#374151' : '#bbb';
  const borderItem = dark ? '#222' : '#eee';
  const menuLink = dark ? '#fff' : '#18181b';

  return (
    <>
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
          <div style={{ textAlign: 'right', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ color: fg, fontSize: fontSizeSub, letterSpacing: 1 }}>AI omni v4</div>
            {!loading && (
              user ? (
                <button
                  onClick={handleLogout}
                  style={{
                    background: fgSub,
                    color: fg,
                    fontFamily: 'Consolas, monospace',
                    fontSize: '12px',
                    borderRadius: 14,
                    padding: '2px 18px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginTop: 4,
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '1.6rem',
                    minWidth: 0,
                    border: 'none',
                    cursor: 'pointer',
                    gap: 8,
                    lineHeight: '1',
                    letterSpacing: '0.5px',
                  }}
                >
                  <span style={{ fontSize: '12px' }}>{user.displayName || user.email?.split('@')[0]} (logout)</span>
                </button>
              ) : (
                <a
                  href="/login"
                  style={{
                    background: fgSub,
                    color: fg,
                    fontFamily: 'Consolas, monospace',
                    fontSize: fontSizeSub,
                    borderRadius: 14,
                    padding: '2px 18px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginTop: 4,
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '1.6rem',
                    minWidth: 0,
                  }}
                >
                  Login
                </a>
              )
            )}
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

      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: dark ? '#18181b' : '#fff',
            borderRadius: 16,
            padding: '24px',
            width: '90%',
            maxWidth: 400,
            boxShadow: '0 4px 24px #000a',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <h3 style={{
              color: fg,
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
              fontFamily: 'Consolas, monospace',
            }}>
              Are you sure you want to logout?
            </h3>
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
            }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  background: fgSub,
                  color: fg,
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'Consolas, monospace',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  background: '#22c55e',
                  color: '#18181b',
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'Consolas, monospace',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 