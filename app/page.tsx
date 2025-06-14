'use client';

import React, { useEffect, useState, useRef, JSX } from 'react';
import Stars from './components/Stars';
import HeaderWithMenu from '../components/HeaderWithMenu';
import TerminalLoading from '../components/TerminalLoading';
import LoginModal from './login/LoginModal';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/TranslationContext';
import TeamSearchModal from './components/TeamSearchModal';

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

function Switch({ checked, onChange, label, dark }: { checked: boolean, onChange: (v: boolean) => void, label: string, dark: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 46,
          height: 24,
          borderRadius: 17,
          background: checked ? '#22c55e' : '#444',
          border: '2px solid ' + (checked ? '#22c55e' : '#444'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: checked ? 'flex-end' : 'flex-start',
          padding: 2.5,
          cursor: 'pointer',
          transition: 'background 0.2s',
          boxSizing: 'border-box',
        }}
        aria-label={label}
      >
        <div style={{
          width: 18.7,
          height: 18.7,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px #0006',
          transition: 'transform 0.2s',
        }} />
      </button>
      <span style={{ color: dark ? '#fff' : '#18181b', fontFamily: 'Consolas, monospace', fontSize: 12, marginTop: 2 }}>{label}</span>
    </div>
  );
}

const translations = {
  en: {
    title: 'Before betting, ask UNAGI',
    subtitle: 'any game, any match',
    teamA: 'Team A',
    chooseTeamA: 'Choose Team A',
    chooseTeamB: 'Choose Team B',
    noOpponent: 'No opponent found',
    search: 'Search odds',
    login: 'Login',
    realMadrid: 'Real Madrid',
    barcelona: 'Barcelona',
    odd: 'odd',
  },
  pt: {
    title: 'Antes de apostar, pergunta à UNAGI',
    subtitle: 'qualquer jogo, qualquer confronto',
    teamA: 'Time A',
    chooseTeamA: 'Escolha o Time A',
    chooseTeamB: 'Escolha o Time B',
    noOpponent: 'Nenhum adversário encontrado',
    search: 'Buscar odds',
    login: 'Entrar',
    realMadrid: 'Real Madrid',
    barcelona: 'Barcelona',
    odd: 'odd',
  }
};

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
  const [dark, setDark] = useState(true);
  const [universe, setUniverse] = useState(true);
  const [sound, setSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { translate, setTranslate, lang } = useTranslation();
  const [showTerminal, setShowTerminal] = useState(false);
  const [pendingPredict, setPendingPredict] = useState<null | (() => void)>(null);
  const { user, loading: authLoading } = useAuth();
  const [blurResult, setBlurResult] = useState(false);
  const [showTeamSearchModal, setShowTeamSearchModal] = useState(false);
  const [showTeamSearchModalB, setShowTeamSearchModalB] = useState(false);
  // Ref para saber se restaurou do localStorage
  const restoredFromStorage = useRef(false);

  // Cores dinâmicas
  const bgColor = dark ? '#0B0B0B' : '#fff';
  const fgColor = dark ? 'white' : '#18181b';
  const inputBg = dark ? '#18181b' : '#f3f3f3';
  const inputColor = dark ? 'white' : '#18181b';
  const inputBorder = dark ? '#333' : '#bbb';
  const selectBg = inputBg;
  const selectColor = inputColor;
  const selectBorder = inputBorder;
  const btnBg = dark ? '#222' : '#eee';
  const btnColor = dark ? 'white' : '#18181b';
  const btnBorder = dark ? '#333' : '#bbb';
  const xColor = dark ? '#d1d5db' : '#444';
  const suggestionBg = dark ? '#222' : '#eee';
  const suggestionColor = dark ? 'white' : '#18181b';
  const suggestionActiveBg = dark ? '#333' : '#ccc';

  // Restaurar times do localStorage ao carregar
  useEffect(() => {
    const savedA = localStorage.getItem('teamA');
    const savedB = localStorage.getItem('teamB');
    if (savedA) setTeamA(savedA);
    if (savedB) setTeamB(savedB);
    if (savedA) setTeamASelected(true);
    if (savedA || savedB) restoredFromStorage.current = true;
    // Restaurar adversaries se teamA foi restaurado
    if (savedA && normalizeName(savedA) === normalizeName('Real Madrid')) {
      setAdversaries(['Barcelona']);
    } else if (savedA) {
      setAdversaries([]);
    }
    // Limpar localStorage após restaurar
    localStorage.removeItem('teamA');
    localStorage.removeItem('teamB');
  }, []);

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
  const fontSizeInput = isMobile ? '12px' : '13px';
  const textoCentralMarginLeft = isMobile ? '2mm' : '0';
  const conjuntoMarginLeft = isMobile ? '3mm' : '0';
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
    // Não limpar o campo B automaticamente aqui
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
    setShowTerminal(true);
    setPendingPredict(() => async () => {
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
        <div style={{ marginTop: 24, color: dark ? undefined : '#18181b' }}>
          <div style={{ marginBottom: 16, color: dark ? '#9ca3af' : '#444', fontSize: 14, textAlign: 'center' }}>
            {formattedDate}
          </div>
          <div style={{ marginBottom: 8, color: dark ? '#d1d5db' : '#18181b', fontSize: 15 }}>
            {translations[lang].realMadrid}: <span style={{ color: dark ? 'white' : '#18181b', fontWeight: 'bold' }}>{pctA}%</span> ({translations[lang].odd} {oddsA})
          </div>
          <div style={{ width: '100%', background: dark ? '#374151' : '#bbb', borderRadius: 6, height: 12, marginBottom: 16 }}>
            <div style={{ background: '#22c55e', height: 12, borderRadius: 6, width: `${pctA}%` }}></div>
          </div>
          <div style={{ marginBottom: 8, color: dark ? '#d1d5db' : '#18181b', fontSize: 15 }}>
            {translations[lang].barcelona}: <span style={{ color: dark ? 'white' : '#18181b', fontWeight: 'bold' }}>{pctB}%</span> ({translations[lang].odd} {oddsB})
          </div>
          <div style={{ width: '100%', background: dark ? '#374151' : '#bbb', borderRadius: 6, height: 12 }}>
            <div style={{ background: '#ef4444', height: 12, borderRadius: 6, width: `${pctB}%` }}></div>
          </div>
        </div>
      );
      setLoading(false);
      setBlurResult(!user);
    });
  }

  function handleTerminalDone() {
    setShowTerminal(false);
    if (pendingPredict) {
      pendingPredict();
      setPendingPredict(null);
    }
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

  useEffect(() => {
    if (audioRef.current) {
      if (sound) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [sound]);

  return (
    <div style={{
      fontFamily: 'Consolas, monospace',
      background: bgColor,
      minHeight: '100vh',
      color: fgColor,
      position: 'relative',
      overflow: 'hidden',
      width: '100vw',
      boxSizing: 'border-box'
    }}>
      <HeaderWithMenu dark={dark} />
      <audio ref={audioRef} src="/music.mp3" loop />
      {universe && <Stars center={starCenter} dark={dark} />}
      {/* Switches - logo abaixo do header */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 16,
        gap: 2,
        zIndex: 20,
        position: 'relative',
      }}>
        <Switch checked={dark} onChange={setDark} label="dark" dark={dark} />
        <Switch checked={universe} onChange={setUniverse} label="universe" dark={dark} />
        <Switch checked={sound} onChange={() => {
          setSound((prev) => {
            if (audioRef.current) {
              if (!prev) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
            }
            return !prev;
          });
        }} label="sound" dark={dark} />
        <Switch checked={translate} onChange={setTranslate} label="translate" dark={dark} />
      </div>
      {/* Centralizar verticalmente só o texto e pesquisa */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: mainAlign,
          justifyContent: mainJustify,
          textAlign: 'center',
          gap: '24px',
          width: '100%',
          maxWidth: '1200px',
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
              textAlign: 'center',
              color: fgColor
            }}>{translations[lang].title}</h1>
            <h2 style={{ 
              fontSize: fontSizeH2,
              letterSpacing: '0.05em', 
              fontFamily: 'Consolas, monospace',
              margin: 0,
              lineHeight: 1.2,
              padding: '0 8px',
              textAlign: 'center',
              color: fgColor
            }}>
              {translations[lang].subtitle}
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
              <button
                type="button"
                onClick={() => setShowTeamSearchModal(true)}
                style={{
                  width: '100%',
                  height: 44,
                  background: inputBg,
                  color: inputColor,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: 8,
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '12px',
                  padding: '0 10px',
                  outline: 'none',
                  fontFamily: 'Consolas, monospace',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  letterSpacing: 0,
                }}
              >
                {teamA ? (
                  <span style={{ fontSize: '12px', fontWeight: 400, color: inputColor }}>{teamA}</span>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 400, color: '#888' }}>{translations[lang].teamA}</span>
                )}
              </button>
            </div>
            <div ref={xRef} style={{ fontSize: 24, fontWeight: 'bold', color: xColor, margin: '0 2px', userSelect: 'none', flexShrink: 0 }}>X</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '100%',
                  height: 44,
                  background: selectBg,
                  color: selectColor,
                  border: `1px solid ${selectBorder}`,
                  borderRadius: 8,
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '12px',
                  padding: '0 10px',
                  outline: 'none',
                  fontFamily: 'Consolas, monospace',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: teamA ? 1 : 0.5,
                  letterSpacing: 0,
                }}
              >
                {teamB ? (
                  <span style={{ fontSize: '12px', fontWeight: 400, color: selectColor }}>{teamB}</span>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 400, color: '#888' }}>{translations[lang].chooseTeamB || 'Team B'}</span>
                )}
              </div>
            </div>
            <button
              id="predictBtn"
              onClick={predict}
              disabled={!teamA || !teamB}
              style={{
                background: btnBg,
                border: `1px solid ${btnBorder}`,
                borderRadius: 8,
                color: btnColor,
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
              aria-label={translations[lang].search}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
            </button>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div id="predictionResult" style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center',
              padding: '0 16px',
              filter: blurResult ? 'blur(7px)' : undefined,
              transition: 'filter 0.3s',
              position: 'relative',
              zIndex: 1,
            }}>
              {result}
            </div>
            {!user && blurResult && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                pointerEvents: 'none',
              }}>
                <a
                  href="/login"
                  style={{
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    fontFamily: 'Consolas, monospace',
                    fontSize: 16,
                    padding: '12px 32px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px #0006',
                    pointerEvents: 'auto',
                    opacity: 1,
                  }}
                >
                  {translations[lang].login}
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
      {showTerminal && <TerminalLoading onDone={handleTerminalDone} />}
      <TeamSearchModal
        open={showTeamSearchModal}
        onClose={() => setShowTeamSearchModal(false)}
        teamList={teamList}
        title="Select Team A"
        onSelect={name => {
          setTeamA(name);
          setTeamASelected(true);
          setResult(null);
          setShowTeamSearchModal(false);
          setTimeout(() => setShowTeamSearchModalB(true), 400); // delay maior para evitar zoom
        }}
        dark={dark}
        autoFocus={true}
      />
      <TeamSearchModal
        open={showTeamSearchModalB}
        onClose={() => setShowTeamSearchModalB(false)}
        teamList={adversaries}
        title="Select Team B"
        onSelect={name => {
          setTeamB(name);
          setResult(null);
          localStorage.setItem('teamA', teamA);
          localStorage.setItem('teamB', name);
        }}
        dark={dark}
        autoFocus={false}
      />
    </div>
  );
}
