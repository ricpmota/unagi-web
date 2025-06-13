'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderWithMenu from '../../components/HeaderWithMenu';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, {
            displayName: name
          });
          await sendEmailVerification(userCredential.user);
          setEmailSent(true);
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            setError('Essa conta já existe. Faça login.');
            setIsRegister(false);
            setEmailSent(false);
            setPassword('');
            return;
          } else {
            throw err;
          }
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Por favor, verifique seu e-mail antes de acessar.');
          await auth.signOut();
          setLoading(false);
          return;
        }
        router.push('/');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0B0B',
      color: '#fff',
      fontFamily: 'Consolas, monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <HeaderWithMenu dark={true} />
      <div style={{
        marginTop: 120,
        width: '100%',
        maxWidth: isMobile ? 202 : 400,
        background: '#18181b',
        borderRadius: 16,
        boxShadow: '0 4px 24px #000a',
        padding: isMobile ? 19 : 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ 
          fontSize: isMobile ? 18 : 28, 
          fontWeight: 'bold', 
          marginBottom: isMobile ? 14 : 24, 
          letterSpacing: 1 
        }}> {isRegister ? 'Cadastro' : 'Login'} </h1>
        {emailSent ? (
          <div style={{ 
            color: '#22c55e', 
            fontSize: isMobile ? 11 : 16, 
            textAlign: 'center', 
            marginBottom: 12 
          }}>
            Um link de verificação foi enviado para seu e-mail.<br />
            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.<br />
            Após a verificação, faça login normalmente.<br />
            <button
              onClick={() => { setIsRegister(false); setEmailSent(false); setEmail(''); setPassword(''); }}
              style={{ 
                marginTop: 12, 
                color: '#22c55e', 
                background: 'none', 
                border: 'none', 
                fontSize: isMobile ? 11 : 15, 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >Voltar para login</button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
          {isRegister && (
            <div>
              <label htmlFor="name" style={{ fontSize: isMobile ? 10 : 14, marginBottom: 3, display: 'block' }}>Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: isMobile ? 6 : 10, 
                  borderRadius: 8, 
                  border: '1px solid #333', 
                  background: '#222', 
                  color: 'white', 
                  fontSize: isMobile ? 11 : 16, 
                  marginBottom: 6 
                }}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" style={{ fontSize: isMobile ? 10 : 14, marginBottom: 3, display: 'block' }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: isMobile ? 6 : 10, 
                borderRadius: 8, 
                border: '1px solid #333', 
                background: '#222', 
                color: 'white', 
                fontSize: isMobile ? 11 : 16, 
                marginBottom: 6 
              }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ fontSize: isMobile ? 10 : 14, marginBottom: 3, display: 'block' }}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: isMobile ? 6 : 10, 
                borderRadius: 8, 
                border: '1px solid #333', 
                background: '#222', 
                color: 'white', 
                fontSize: isMobile ? 11 : 16, 
                marginBottom: 6 
              }}
            />
          </div>
          {error && (
            <div style={{ color: '#ef4444', fontSize: isMobile ? 10 : 14, marginBottom: 6 }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: isMobile ? 7 : 12,
              background: '#22c55e',
              color: '#18181b',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: isMobile ? 12 : 18,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: 6,
            }}
          >
            {loading ? (isRegister ? 'Cadastrando...' : 'Entrando...') : (isRegister ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>
        )}
        {!emailSent && (
        <button
          onClick={() => setIsRegister(r => !r)}
          style={{
            background: 'none',
            border: 'none',
            color: '#22c55e',
            fontSize: 12,
            marginTop: 6,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isRegister ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
        )}
      </div>
    </div>
  );
} 