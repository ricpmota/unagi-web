"use client";
import React, { createContext, useContext, useState } from 'react';

interface TranslationContextType {
  translate: boolean;
  setTranslate: (v: boolean) => void;
  lang: 'en' | 'pt';
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const userLang = typeof window !== 'undefined' ? navigator.language.slice(0, 2) : 'en';
  const [translate, setTranslate] = useState(false);
  const lang: 'en' | 'pt' = translate ? (userLang === 'pt' ? 'pt' : 'en') : 'en';

  return (
    <TranslationContext.Provider value={{ translate, setTranslate, lang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within a TranslationProvider');
  return ctx;
} 