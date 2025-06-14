"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import HeaderWithMenu from '../../components/HeaderWithMenu';
import Image from 'next/image';

const benefits = {
  en: [
    'Unlimited deepresults',
    '5 deepresults APIs',
    'Context memory',
    'Omni v4 model'
  ],
  pt: [
    'Deepresults ilimitados',
    '5 APIs de deepresults',
    'Memória de contexto',
    'Modelo Omni v4'
  ]
};

const translations = {
  en: {
    title: 'Plans',
    monthly: 'Monthly',
    annual: 'Annual',
    subscribe: 'Subscribe now'
  },
  pt: {
    title: 'Planos',
    monthly: 'Mensal',
    annual: 'Anual',
    subscribe: 'Assinar agora'
  }
};

export default function PlansPage() {
  const { lang, translate, setTranslate } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
  const [price, setPrice] = useState('49.99');

  useEffect(() => {
    if (isAnnual) {
      let currentValue = 4.99;
      const targetValue = 49.99;
      const duration = 1000; // 1 segundo
      const steps = 20;
      const increment = (targetValue - currentValue) / steps;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        currentValue += increment;
        setPrice(currentValue.toFixed(2));
        if (step >= steps) {
          clearInterval(timer);
          setPrice('49.99');
        }
      }, interval);

      return () => clearInterval(timer);
    } else {
      let currentValue = 49.99;
      const targetValue = 4.99;
      const duration = 1000; // 1 segundo
      const steps = 20;
      const increment = (targetValue - currentValue) / steps;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        currentValue += increment;
        setPrice(currentValue.toFixed(2));
        if (step >= steps) {
          clearInterval(timer);
          setPrice('4.99');
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isAnnual]);

  const handleTranslate = () => {
    setTranslate(!translate);
  };

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
        padding: 18,
        maxWidth: 270,
        width: '100%',
        textAlign: 'center',
        boxSizing: 'border-box',
        margin: '0 auto',
        ...(typeof window !== 'undefined' && window.innerWidth < 340 ? { maxWidth: window.innerWidth - 20 } : {})
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
            <button
              onClick={handleTranslate}
              style={{
                width: 46,
                height: 24,
                borderRadius: 17,
                background: translate ? '#22c55e' : '#444',
                border: `2px solid ${translate ? '#22c55e' : '#444'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 2.5,
                cursor: 'pointer',
                transition: 'background 0.4s, border 0.4s',
                boxSizing: 'border-box',
                opacity: 1
              }}
              aria-label="translate"
            >
              <div style={{
                width: 18.7,
                height: 18.7,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px #0006',
                transition: 'transform 0.4s',
                transform: translate ? 'translateX(22px)' : 'translateX(0)'
              }} />
            </button>
            <span style={{ color: '#fff', fontFamily: 'Consolas, monospace', fontSize: 12, marginTop: 2 }}>translate</span>
          </div>
        </div>
        <h2 style={{ fontSize: 28, margin: 0, fontWeight: 700, letterSpacing: 1 }}>{translations[lang].title}</h2>
        <div style={{ margin: '18px 0 8px', fontSize: 32, fontWeight: 700, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ display: 'inline-block', minWidth: 90, transition: 'color 0.2s' }}>
            ${price}
          </span>
          <span style={{ fontSize: 16, fontWeight: 400, marginLeft: 4 }}>
            / {isAnnual ? (lang === 'en' ? 'year' : 'ano') : (lang === 'en' ? 'month' : 'mês')}
          </span>
          {isAnnual && (
            <span style={{
              marginLeft: 10,
              background: '#22c55e',
              color: '#101010',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 15,
              padding: '2px 8px',
              letterSpacing: 1
            }}>17% off</span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              background: '#18181b',
              border: 'none',
              borderRadius: 20,
              display: 'flex',
              width: 178,
              height: 40,
              position: 'relative',
              cursor: 'pointer',
              userSelect: 'none',
              alignItems: 'center'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 5,
              left: isAnnual ? 84 : 0,
              width: 94,
              height: 30,
              background: '#22c55e',
              borderRadius: 16,
              transition: 'left 0.4s cubic-bezier(.4,2,.6,1), width 0.4s cubic-bezier(.4,2,.6,1)',
              zIndex: 1
            }} />
            <div style={{
              width: 94,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isAnnual ? '#22c55e' : '#101010',
              fontWeight: 'bold',
              fontSize: 17,
              transition: 'color 0.2s'
            }}>
              {translations[lang].monthly}
            </div>
            <div style={{
              width: 84,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isAnnual ? '#101010' : '#22c55e',
              fontWeight: 'bold',
              fontSize: 17,
              transition: 'color 0.2s'
            }}>
              {translations[lang].annual}
            </div>
          </div>
        </div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '24px 0 0 0',
          textAlign: 'left',
          color: '#fff',
          fontSize: 16,
        }}>
          {benefits[lang].map((b, i) => (
            <li key={i} style={{ marginBottom: 10 }}>• {b}</li>
          ))}
        </ul>
        <button style={{
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
          boxShadow: '0 2px 8px #0006'
        }}>
          {translations[lang].subscribe}
        </button>
      </div>
    </div>
  );
} 