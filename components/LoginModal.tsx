        {emailSent ? (
          <div style={{ color: '#22c55e', fontSize: isMobile ? 11 : 16, textAlign: 'center', marginBottom: 12 }}>
            Um link de verificação foi enviado para seu e-mail.<br />
            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.<br />
            Após a verificação, faça login normalmente.<br />
            <button
              onClick={() => { setIsRegister(false); setEmailSent(false); setEmail(''); setPassword(''); }}
              style={{ marginTop: 12, color: '#22c55e', background: 'none', border: 'none', fontSize: isMobile ? 11 : 15, cursor: 'pointer', textDecoration: 'underline' }}
            >Voltar para login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
            {isRegister && (
              <div>
                <label htmlFor="name" style={{ fontSize: isMobile ? 10 : 14, marginBottom: 3, display: 'block', color: '#fff' }}>Nome</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: isMobile ? 6 : 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: isMobile ? 11 : 16, marginBottom: 6 }}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" style={{ fontSize: isMobile ? 10 : 14, marginBottom: 3, display: 'block', color: '#fff' }}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: isMobile ? 6 : 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: isMobile ? 11 : 16, marginBottom: 6 }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ fontSize: isMobile ? 10 : 14, marginBottom: 3, display: 'block', color: '#fff' }}>Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: isMobile ? 6 : 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: isMobile ? 11 : 16, marginBottom: 6 }}
              />
            </div>
            {error && (
              <div style={{ color: '#ef4444', fontSize: isMobile ? 10 : 14, marginBottom: 6 }}>{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: isMobile ? 7 : 12, background: '#22c55e', color: '#18181b', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: isMobile ? 12 : 18, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: 6 }}
            >
              {loading ? (isRegister ? 'Cadastrando...' : 'Entrando...') : (isRegister ? 'Cadastrar' : 'Entrar')}
            </button>
          </form>
        )}
        <button
          onClick={() => setIsRegister(r => !r)}
          style={{ background: 'none', border: 'none', color: '#22c55e', fontSize: 12, marginTop: 6, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegister ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button> 