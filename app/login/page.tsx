'use client';

import { useState } from 'react';
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
  const router = useRouter();

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
      color: 'white',
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
        maxWidth: 400,
        background: '#18181b',
        borderRadius: 16,
        boxShadow: '0 4px 24px #000a',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 1 }}> {isRegister ? 'Cadastro' : 'Login'} </h1>
        {emailSent ? (
          <div style={{ color: '#22c55e', fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
            Um link de verificação foi enviado para seu e-mail.<br />
            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.<br />
            Após a verificação, faça login normalmente.<br />
            <button
              onClick={() => { setIsRegister(false); setEmailSent(false); setEmail(''); setPassword(''); }}
              style={{ marginTop: 16, color: '#22c55e', background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', textDecoration: 'underline' }}
            >Voltar para login</button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isRegister && (
            <div>
              <label htmlFor="name" style={{ fontSize: 14, marginBottom: 4, display: 'block' }}>Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: 'white', fontSize: 16, marginBottom: 8 }}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" style={{ fontSize: 14, marginBottom: 4, display: 'block' }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: 'white', fontSize: 16, marginBottom: 8 }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ fontSize: 14, marginBottom: 4, display: 'block' }}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: 'white', fontSize: 16, marginBottom: 8 }}
            />
          </div>
          {error && (
            <div style={{ color: '#ef4444', fontSize: 14, marginBottom: 8 }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              background: '#22c55e',
              color: '#18181b',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: 18,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: 8,
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
            fontSize: 15,
            marginTop: 8,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>
        )}
      </div>
    </div>
  );
} 