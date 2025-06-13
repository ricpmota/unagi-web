"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from '../../contexts/TranslationContext';
import HeaderWithMenu from '../../components/HeaderWithMenu';
import { CheckCircle } from 'lucide-react';

const benefits = {
  en: [
    'Unlimited deepresults',
    '5 deepresults APIs',
    'Context memory',
    'Omni v4 model',
  ],
  pt: [
    'Análise ilimitada de deepresults',
    '5 API\'s de deepresults',
    'Memória de contexto',
    'Modelo omni v4',
  ],
};

export default function Plans() {
  const [annual, setAnnual] = React.useState(false);
  const [displayPrice, setDisplayPrice] = React.useState(4.99);
  const [pendingAnnual, setPendingAnnual] = React.useState(false);
  const animating = useRef(false);
  const { translate, setTranslate, lang } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Função para animar o preço (mais rápida)
  function animatePrice(target: number) {
    if (animating.current) return;
    animating.current = true;
    const start = displayPrice;
    const end = target;
    const duration = 840; // ms (30% mais rápido que 1200ms)
    const steps = 60;
    let currentStep = 0;
    function step() {
      currentStep++;
      const progress = currentStep / steps;
      const value = start + (end - start) * progress;
      setDisplayPrice(Number(value.toFixed(2)));
      if (currentStep < steps) {
        setTimeout(step, duration / steps);
      } else {
        setDisplayPrice(Number(end.toFixed(2)));
        animating.current = false;
      }
    }
    step();
  }

  function handleSwitch(val: boolean) {
    setAnnual(val); // Troca instantânea
    animatePrice(val ? 49.99 : 4.99);
  }

  const period = annual ? (lang === 'en' ? 'year' : 'ano') : (lang === 'en' ? 'month' : 'mês');
  const subscribeText = lang === 'en' ? 'Subscribe now' : 'Assine agora';

  // Responsividade para container
  const cardMaxWidth = isMobile ? Math.round(256 * 1.1) : Math.round(320 * 1.1); // 10% maior
  const cardPadding = isMobile ? Math.round(16 * 1.1) : Math.round(26 * 1.1);
  // Largura dinâmica baseada no texto selecionado
  const monthlyLabel = lang === 'en' ? 'Monthly' : 'Mensal';
  const annualLabel = lang === 'en' ? 'Annual' : 'Anual';
  // Estimar largura do texto + padding
  const getTextWidth = (text: string) => (text.length * 10 + 24); // 10px por letra + 24px de padding
  const monthlyWidth = getTextWidth(monthlyLabel);
  const annualWidth = getTextWidth(annualLabel);
  const switchWidth = monthlyWidth + annualWidth;
  const switchBtnWidth = annual ? annualWidth : monthlyWidth;
  const switchBtnLeft = annual ? monthlyWidth : 0;
  const extraOffset = 10;
  const switchBtnOffset = (switchWidth / 2 - switchBtnWidth) / 2 + 3;

  // Switch visual igual ao site, mas sincronizado com a animação do preço
  function Switch({ checked, onChange, label, disabled }: { checked: boolean, onChange: (v: boolean) => void, label: string, disabled?: boolean }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
        <button
          onClick={() => !disabled && onChange(!checked)}
          disabled={disabled}
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
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.4s',
            boxSizing: 'border-box',
            opacity: disabled ? 0.6 : 1,
          }}
          aria-label={label}
        >
          <div style={{
            width: 18.7,
            height: 18.7,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 4px #0006',
            transition: 'transform 0.4s',
          }} />
        </button>
        <span style={{ color: '#fff', fontFamily: 'Consolas, monospace', fontSize: 12, marginTop: 2 }}>{label}</span>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background, #000)',
      color: 'var(--foreground, #fff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'Consolas, monospace',
      padding: 16,
      position: 'relative',
    }}>
      <HeaderWithMenu dark={true} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 16 }}>
        <Image src="/logo.png" alt="logo" width={94} height={94} style={{ objectFit: 'contain', width: '2.5cm', height: '2.5cm' }} />
      </div>
      <div style={{
        background: 'rgba(16,16,16,0.95)',
        border: '2px solid #22c55e',
        borderRadius: 14,
        boxShadow: '0 0 24px #000a',
        padding: cardPadding,
        maxWidth: cardMaxWidth,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Switch checked={translate} onChange={setTranslate} label="translate" />
        </div>
        <h2 style={{ fontSize: 28, margin: 0, fontWeight: 700, letterSpacing: 1 }}>{lang === 'en' ? 'Plans' : 'Planos'}</h2>
        <div style={{ margin: '18px 0 8px', fontSize: 32, fontWeight: 700, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ display: 'inline-block', minWidth: 90, transition: 'color 0.2s' }}>
            ${displayPrice.toFixed(2)}
          </span>
          <span style={{ fontSize: 16, fontWeight: 400, marginLeft: 4 }}>/ {period}</span>
          {annual && (
            <span style={{ color: '#22c55e', fontSize: 15, fontWeight: 700, marginLeft: 8 }}>17% off</span>
          )}
        </div>
        {/* Switch animado sem borda verde, sincronizado com o preço */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div
            style={{
              background: '#18181b',
              border: 'none',
              borderRadius: 20,
              display: 'flex',
              width: switchWidth,
              height: 40,
              position: 'relative',
              cursor: 'pointer',
              userSelect: 'none',
              alignItems: 'center',
            }}
            onClick={() => handleSwitch(!annual)}
          >
            <div
              style={{
                position: 'absolute',
                top: 5,
                left: switchBtnLeft,
                width: switchBtnWidth,
                height: 30,
                background: '#22c55e',
                borderRadius: 16,
                transition: 'left 0.4s cubic-bezier(.4,2,.6,1), width 0.4s cubic-bezier(.4,2,.6,1)',
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: monthlyWidth,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: !annual ? '#101010' : '#22c55e',
                fontWeight: 'bold',
                fontSize: 17,
                transition: 'color 0.2s',
              }}
            >
              {monthlyLabel}
            </div>
            <div
              style={{
                width: annualWidth,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: annual ? '#101010' : '#22c55e',
                fontWeight: 'bold',
                fontSize: 17,
                transition: 'color 0.2s',
              }}
            >
              {annualLabel}
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {benefits[lang].map((b, i) => (
            <li key={i} style={{ marginBottom: 10 }}>• {b}</li>
          ))}
        </ul>
        <button
          style={{
            marginTop: 32,
            background: '#22c55e',
            color: '#101010',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            fontFamily: 'Consolas, monospace',
            fontSize: 18,
            padding: '12px 0',
            width: '100%',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0006',
          }}
        >
          {subscribeText}
        </button>
      </div>
    </div>
  );
} 