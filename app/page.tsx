'use client';

import React, { useEffect, useState, useRef, JSX } from 'react';
import Stars from './components/Stars';

// Função utilitária para normalizar nomes (remover acentos, caixa baixa)
function normalizeName(name: string) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Cache em memória para jogos e odds
const matchesCache = new Map<string, any[]>();
const oddsCache = new Map<string, any>();

// Lista de competições a considerar para jogos/adversários
const competitions = [];

// Função para buscar jogos com cache
async function fetchMatchesWithCache(comp: string, status: string) {
  const cacheKey = `${comp}-${status}`;
  if (matchesCache.has(cacheKey)) {
    return matchesCache.get(cacheKey);
  }
  const today = new Date().toISOString().split('T')[0];
  const url = `/api/football-proxy?url=${encodeURIComponent(`https://api.football-data.org/v4/competitions/${comp}/matches?status=${status}&dateFrom=${today}&dateTo=${today}`)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const matches = data.matches || [];
      matchesCache.set(cacheKey, matches);
      return matches;
    } else {
      const errText = await res.text();
      console.error(`Erro da API [${comp}][${status}]:`, res.status, errText);
    }
  } catch (err) {
    console.error(`Erro de rede ao buscar jogos [${comp}][${status}]:`, err);
  }
  return [];
}

// Função para buscar odds com cache
async function fetchOddsWithCache(matchId: string) {
  if (oddsCache.has(matchId)) {
    return oddsCache.get(matchId);
  }
  
  const oddsUrl = `/api/football-proxy?url=${encodeURIComponent(`https://api.football-data.org/v4/matches/${matchId}/odds`)}`;
  const oddsRes = await fetch(oddsUrl);
  if (oddsRes.ok) {
    const oddsData = await oddsRes.json();
    oddsCache.set(matchId, oddsData);
    return oddsData;
  }
  return null;
}

export default function Home() {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [result, setResult] = useState<null | JSX.Element>(null);
  const [loading, setLoading] = useState(false);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const xRef = useRef<HTMLDivElement>(null);
  const [starCenter, setStarCenter] = useState<{x: number, y: number}>({x: 0, y: 0});

  useEffect(() => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    if (!menuBtn || !menu) return;

    const toggleMenu = (e: MouseEvent) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    };
    menuBtn.addEventListener('click', toggleMenu);

    const closeMenu = (e: MouseEvent) => {
      if (menu.style.display === 'block' && !menu.contains(e.target as Node) && e.target !== menuBtn) {
        menu.style.display = 'none';
      }
    };
    document.addEventListener('click', closeMenu);

    const links = menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menu.style.display = 'none';
      });
    });

    return () => {
      menuBtn.removeEventListener('click', toggleMenu);
      document.removeEventListener('click', closeMenu);
      links.forEach(link => {
        link.removeEventListener('click', () => {
          menu.style.display = 'none';
        });
      });
    };
  }, []);

  function handleInputA(e: React.ChangeEvent<HTMLInputElement>) {
    setTeamA(e.target.value);
    setResult(null);
  }

  function handleInputB(e: React.ChangeEvent<HTMLInputElement>) {
    setTeamB(e.target.value);
    setResult(null);
  }

  async function predict() {
    if (!teamA || !teamB) return;
    
    setLoading(true);
    try {
      // Simulação de previsão
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult(
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Probabilidade: 50% - 50%</p>
        </div>
      );
    } catch (error) {
      console.error('Erro ao fazer previsão:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      height: 'calc(100vh - 200px)',
      gap: '24px',
      position: 'relative',
      zIndex: 10,
      transform: 'scale(1)',
      padding: '0 16px',
      fontFamily: 'Consolas, monospace'
    }}>
      <h1 style={{ fontSize: '24px', letterSpacing: '0.05em', fontFamily: 'Consolas, monospace', marginBottom: 0, lineHeight: 1 }}>Antes de apostar, pergunta à UNAGI</h1>
      <h2 style={{ 
        fontSize: '24px', 
        letterSpacing: '0.05em', 
        fontFamily: 'Consolas, monospace',
        marginBottom: '4px',
        marginTop: 0,
        lineHeight: 1
      }}>
        qualquer jogo, qualquer confronto
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 4 }}>
        <div style={{ position: 'relative' }}>
          <input
            ref={inputARef}
            type="text"
            value={teamA}
            onChange={handleInputA}
            placeholder="Time A"
            style={{
              width: 220,
              height: 48,
              background: '#18181b',
              color: 'white',
              border: '1px solid #333',
              borderRadius: 8,
              fontSize: 20,
              padding: '0 16px',
              outline: 'none',
              fontFamily: 'Consolas, monospace',
            }}
            autoComplete="off"
          />
        </div>
        <div ref={xRef} style={{ fontSize: 32, fontWeight: 'bold', color: '#d1d5db', margin: '0 8px', userSelect: 'none' }}>X</div>
        <div style={{ position: 'relative' }}>
          <input
            ref={inputBRef}
            type="text"
            value={teamB}
            onChange={handleInputB}
            placeholder="Time B"
            style={{
              width: 220,
              height: 48,
              background: '#18181b',
              color: 'white',
              border: '1px solid #333',
              borderRadius: 8,
              fontSize: 20,
              padding: '0 16px',
              outline: 'none',
              fontFamily: 'Consolas, monospace',
            }}
            autoComplete="off"
          />
        </div>
        <button
          onClick={predict}
          disabled={!teamA || !teamB || loading}
          style={{
            background: '#22c55e',
            border: 'none',
            borderRadius: 8,
            color: 'white',
            fontSize: 24,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            cursor: (!teamA || !teamB || loading) ? 'not-allowed' : 'pointer',
            opacity: (!teamA || !teamB || loading) ? 0.5 : 1,
          }}
        >
          {loading ? '...' : '→'}
        </button>
      </div>
      <div id="predictionResult" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {result}
      </div>
    </main>
  );
}
