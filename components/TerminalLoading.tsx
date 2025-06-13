import React, { useEffect, useRef, useState } from 'react';

const STATUS_LIST = [
  'API-Football...',
  'The Odds API...',
  'SportMonks...',
  'Sportradar...',
  'Tipico Odds Feed...'
];

function getRandomDuration() {
  // 3.000 a 4.000 segundos, 3 casas decimais
  return +(Math.random() * (4 - 3) + 3).toFixed(3);
}

export default function TerminalLoading({ onDone }: { onDone: (duration: number) => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUS_LIST[0]);
  const [dots, setDots] = useState('');
  const [done, setDone] = useState(false);
  const [duration] = useState(getRandomDuration());
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusIndex = useRef(0);

  // Pontinhos piscando
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(d => (d.length < 3 ? d + '.' : ''));
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  // Progresso e status
  useEffect(() => {
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSec = (now - start) / 1000;
      setElapsed(elapsedSec);
      let pct = Math.min((elapsedSec / duration) * 100, 100);
      setProgress(pct);
      // Troca status a cada 0.7s
      if (elapsedSec > (statusIndex.current + 1) * 0.7 && statusIndex.current < STATUS_LIST.length - 1) {
        statusIndex.current++;
        setStatus(STATUS_LIST[statusIndex.current]);
      }
      if (pct >= 100) {
        setDone(true);
        clearInterval(intervalRef.current!);
      }
    }, 40);
    return () => clearInterval(intervalRef.current!);
  }, [duration]);

  // Responsividade
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const width = isMobile ? 280 : 420;
  const height = isMobile ? 180 : 220;

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
        width,
        height,
        background: '#101010',
        border: '2px solid #22c55e',
        borderRadius: 10,
        boxShadow: '0 0 24px #000a',
        fontFamily: 'Consolas, monospace',
        color: '#22c55e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 0,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 18px 0 18px', fontSize: 15, minHeight: 30 }}>
          <span style={{ color: '#fff' }}>// loading{dots}</span>
        </div>
        <div style={{ padding: '0 18px', fontSize: 13, color: '#22c55e', minHeight: 24 }}>
          {status}
        </div>
        <div style={{ padding: '0 18px', fontSize: 13, color: '#22c55e', minHeight: 24 }}>
          <span style={{ color: '#fff' }}>&#x5C; {Math.floor(progress)}%</span>
          <div style={{
            width: '100%',
            height: 18,
            background: '#222',
            border: '1px solid #22c55e',
            borderRadius: 4,
            margin: '6px 0 0 0',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#22c55e',
              transition: 'width 0.1s',
            }} />
          </div>
        </div>
        <div style={{ padding: '0 18px', fontSize: 13, color: '#22c55e', minHeight: 24, marginTop: 8 }}>
          {!done ? '' : `${duration.toFixed(3)}seg`}
        </div>
        <div style={{ marginTop: 8, color: '#22c55e', fontSize: 12 }}>
          {done ? 'Complete' : 'Loading'}...
        </div>
        {done && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <button
              onClick={() => onDone(duration)}
              style={{
                background: '#22c55e',
                color: '#101010',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                fontFamily: 'Consolas, monospace',
                fontSize: window.innerWidth <= 600 ? '12px' : '14px',
                padding: '6px 24px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #0006',
              }}
            >
              unagi results
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 