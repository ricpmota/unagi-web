'use client';

import React, { useEffect, useState, useRef, JSX } from 'react';
import Stars from './components/Stars';

// Função utilitária para normalizar nomes (remover acentos, caixa baixa)
function normalizeName(name: string) {
  // Remove acentos e converte para minúsculas
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
  const [teamList, setTeamList] = useState<string[]>([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [result, setResult] = useState<null | JSX.Element>(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsA, setSuggestionsA] = useState<string[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<string[]>([]);
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const [adversaries, setAdversaries] = useState<string[]>([]);
  const xRef = useRef<HTMLDivElement>(null);
  const [starCenter, setStarCenter] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [teamASelected, setTeamASelected] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedAdversary, setSelectedAdversary] = useState('');
  const [adversaryList, setAdversaryList] = useState<string[]>([]);
  const [showAdversarySuggestions, setShowAdversarySuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fontSizeH1 = isMobile ? 'clamp(12.8px, 3.2vw, 19.2px)' : 'clamp(16px, 4vw, 24px)';
  const fontSizeH2 = isMobile ? 'clamp(11.2px, 2.8vw, 16px)' : 'clamp(14px, 3.5vw, 20px)';
  const fontSizeInput = 10;
  const textoCentralMarginLeft = isMobile ? '-8mm' : '0';
  const conjuntoMarginLeft = isMobile ? '-4mm' : '0';
  const mainJustify = isMobile ? 'center' : 'center';
  const mainMinHeight = isMobile ? '100vh' : '100vh';
  const mainAlign = isMobile ? 'center' : 'center';

  useEffect(() => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    if (!menuBtn || !menu) return;

    // Toggle menu on button click
    const toggleMenu = (e: MouseEvent) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    };
    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    const closeMenu = (e: MouseEvent) => {
      if (menu.style.display === 'block' && !menu.contains(e.target as Node) && e.target !== menuBtn) {
        menu.style.display = 'none';
      }
    };
    document.addEventListener('click', closeMenu);

    // Close menu when clicking a link
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

  // Carregar times para autocomplete ao iniciar (simulado)
  useEffect(() => {
    setTeamList(['Real Madrid', 'Barcelona']);
  }, []);

  // Função para filtrar sugestões
  function filterSuggestions(value: string) {
    if (!value) return [];
    const searchTerm = normalizeName(value);
    const filtered = teamList.filter(name => normalizeName(name).includes(searchTerm));
    console.log('Termo de busca:', searchTerm); // Debug
    console.log('Times filtrados:', filtered); // Debug
    return filtered;
  }

  // Handlers para inputs
  function handleInputA(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    console.log('Valor digitado:', value); // Debug
    setTeamA(value);
    setResult(null);
    setTeamB('');
    setTeamASelected(false);
    const filtered = filterSuggestions(value);
    setSuggestionsA(filtered);
    setShowSuggestionsA(filtered.length > 0);
  }

  function handleInputB(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setTeamB(value);
    setResult(null);
    const filtered = adversaries.filter(name => normalizeName(name).includes(normalizeName(value)));
    setSuggestionsB(filtered);
    setShowSuggestionsB(filtered.length > 0);
  }

  function handleSuggestionClickA(name: string) {
    console.log('Time selecionado:', name); // Debug
    setTeamA(name);
    setSuggestionsA([]);
    setShowSuggestionsA(false);
    setTeamASelected(true);
    inputARef.current?.blur();
  }

  function handleSuggestionClickB(name: string) {
    setTeamB(name);
    setSuggestionsB([]);
    setShowSuggestionsB(false);
    inputBRef.current?.blur();
  }

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputARef.current && !inputARef.current.contains(event.target as Node)) {
        setShowSuggestionsA(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simular adversários
  useEffect(() => {
    if (teamASelected && normalizeName(teamA) === normalizeName('Real Madrid')) {
      setAdversaries(['Barcelona']);
    } else {
      setAdversaries([]);
    }
    setTeamB('');
    setSuggestionsB([]);
  }, [teamA, teamASelected]);

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setTeamList([]);
    setShowSuggestionsA(false);
    
    // Simulação para Real Madrid vs Barcelona
    if (team === 'Barcelona') {
      setSelectedAdversary('Real Madrid');
      setAdversaryList([]);
      setShowAdversarySuggestions(false);
      setTeamB('Real Madrid');
    } else if (team === 'Real Madrid') {
      setSelectedAdversary('Barcelona');
      setAdversaryList([]);
      setShowAdversarySuggestions(false);
      setTeamB('Barcelona');
    }
  };

  const handleAdversarySelect = (adversary: string) => {
    setSelectedAdversary(adversary);
    setAdversaryList([]);
    setShowAdversarySuggestions(false);
    setTeamB(adversary);
  };

  // Prever vencedor (simulado)
  async function predict() {
    if (!teamA.trim() || !teamB.trim()) return;
    setLoading(true);
    setResult(null);
    // Simular odds
    const oddsA = 1.80; // Real Madrid
    const oddsB = 2.20; // Barcelona
    const pctA = Math.round((1 / oddsA) / ((1 / oddsA) + (1 / oddsB)) * 100);
    const pctB = 100 - pctA;
    // Data de hoje
    const matchDate = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    const formattedDate = matchDate.toLocaleDateString('pt-BR', options);
    setResult(
      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16, color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>
          {formattedDate}
        </div>
        <div style={{ marginBottom: 8, color: '#d1d5db', fontSize: 15 }}>
          Real Madrid: <span style={{ color: 'white', fontWeight: 'bold' }}>{pctA}%</span> (odd {oddsA})
        </div>
        <div style={{ width: '100%', background: '#374151', borderRadius: 6, height: 12, marginBottom: 16 }}>
          <div style={{ background: '#22c55e', height: 12, borderRadius: 6, width: `${pctA}%` }}></div>
        </div>
        <div style={{ marginBottom: 8, color: '#d1d5db', fontSize: 15 }}>
          Barcelona: <span style={{ color: 'white', fontWeight: 'bold' }}>{pctB}%</span> (odd {oddsB})
        </div>
        <div style={{ width: '100%', background: '#374151', borderRadius: 6, height: 12 }}>
          <div style={{ background: '#ef4444', height: 12, borderRadius: 6, width: `${pctB}%` }}></div>
        </div>
      </div>
    );
    setLoading(false);
  }

  useEffect(() => {
    function updateStarCenter() {
      if (xRef.current) {
        const rect = xRef.current.getBoundingClientRect();
        setStarCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }
    updateStarCenter();
    window.addEventListener('resize', updateStarCenter);
    return () => window.removeEventListener('resize', updateStarCenter);
  }, []);

  return (
    <div style={{
      fontFamily: 'Consolas, monospace',
      background: '#0B0B0B',
      minHeight: '100vh',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      width: '100vw',
      boxSizing: 'border-box'
    }}>
      <Stars center={starCenter} />
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: mainAlign,
        justifyContent: mainJustify,
        textAlign: 'center',
        minHeight: mainMinHeight,
        gap: '24px',
        position: 'relative',
        zIndex: 10,
        transform: 'scale(1)',
        padding: '0 16px',
        fontFamily: 'Consolas, monospace',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          width: '100%',
          justifyContent: 'center',
          marginLeft: textoCentralMarginLeft,
        }}>
          <h1 style={{ 
            fontSize: fontSizeH1,
            letterSpacing: '0.05em', 
            fontFamily: 'Consolas, monospace', 
            margin: 0,
            lineHeight: 1.2,
            padding: '0 8px',
            textAlign: 'center'
          }}>Antes de apostar, pergunta à UNAGI</h1>
          <h2 style={{ 
            fontSize: fontSizeH2,
            letterSpacing: '0.05em', 
            fontFamily: 'Consolas, monospace',
            margin: 0,
            lineHeight: 1.2,
            padding: '0 8px',
            textAlign: 'center'
          }}>
            qualquer jogo, qualquer confronto
          </h2>
        </div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 8,
            width: '100%',
            maxWidth: 600,
            marginLeft: conjuntoMarginLeft,
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <input
              ref={inputARef}
              type="text"
              value={teamA}
              onChange={handleInputA}
              onFocus={() => {
                if (teamA.length >= 3) {
                  const filtered = filterSuggestions(teamA);
                  setSuggestionsA(filtered);
                  setShowSuggestionsA(true);
                }
              }}
              placeholder="Time A"
              style={{
                width: '100%',
                height: 44,
                background: '#18181b',
                color: 'white',
                border: '1px solid #333',
                borderRadius: 8,
                fontSize: fontSizeInput,
                padding: '0 10px',
                outline: 'none',
                fontFamily: 'Consolas, monospace',
                boxSizing: 'border-box',
              }}
              autoComplete="off"
            />
            {showSuggestionsA && suggestionsA.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: 46,
                left: 0,
                width: '100%',
                background: '#222',
                border: '1px solid #333',
                borderRadius: 8,
                maxHeight: 200,
                overflowY: 'auto',
                zIndex: 30,
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}>
                {suggestionsA.map(name => (
                  <li
                    key={name}
                    onMouseDown={() => handleSuggestionClickA(name)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      color: 'white',
                      background: name === teamA ? '#333' : 'none',
                      fontSize: 13,
                      textAlign: 'left',
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div ref={xRef} style={{ fontSize: 24, fontWeight: 'bold', color: '#d1d5db', margin: '0 2px', userSelect: 'none', flexShrink: 0 }}>X</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <select
              value={teamB}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setTeamB(e.target.value); setResult(null); }}
              disabled={!teamASelected || adversaries.length === 0}
              style={{
                width: '100%',
                height: 44,
                background: '#18181b',
                color: 'white',
                border: '1px solid #333',
                borderRadius: 8,
                fontSize: fontSizeInput,
                padding: '0 10px',
                outline: 'none',
                fontFamily: 'Consolas, monospace',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                cursor: !teamASelected || adversaries.length === 0 ? 'not-allowed' : 'pointer',
                boxSizing: 'border-box',
              }}
            >
              {!teamASelected ? (
                <option value="" disabled>Escolha o Time A</option>
              ) : adversaries.length === 0 ? (
                <option value="" disabled>Nenhum adversário encontrado</option>
              ) : (
                <option value="" disabled>Escolha o Time B</option>
              )}
              {adversaries.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <button
            id="predictBtn"
            onClick={predict}
            disabled={!teamA || !teamB}
            style={{
              background: '#222',
              border: '1px solid #333',
              borderRadius: 8,
              color: 'white',
              fontSize: 18,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 2,
              cursor: (!teamA || !teamB) ? 'not-allowed' : 'pointer',
              opacity: (!teamA || !teamB) ? 0.5 : 1,
              flexShrink: 0,
            }}
            aria-label="Buscar odds"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
        <div id="predictionResult" style={{ 
          width: '100%', 
          maxWidth: '600px',
          display: 'flex', 
          justifyContent: 'center',
          padding: '0 16px'
        }}>
          {result}
        </div>
      </main>
    </div>
  );
}
