import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  languages: typeof SUPPORTED_LANGUAGES;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'SchemeGenie',
    'app.subtitle': 'Discover Benefits, Transform Lives',
    'nav.home': 'Home',
    'nav.assistant': 'AI Assistant',
    'nav.schemes': 'Browse Schemes',
    'nav.dashboard': 'Dashboard',
    'home.hero.title': 'Discover Government Benefits with AI',
    'home.hero.subtitle': 'Get personalized assistance to find and apply for benefit schemes worldwide',
    'home.features.ai': 'AI-Powered Matching',
    'home.features.multilingual': 'Multi-Language Support',
    'home.features.voice': 'Voice Assistance',
    'home.features.reminders': 'Smart Reminders',
    'common.getstarted': 'Get Started',
    'common.learnmore': 'Learn More',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'assistant.title': 'AI Assistant',
    'assistant.placeholder': 'Ask me anything about benefit schemes...',
    'assistant.voice.start': 'Start Voice Input',
    'assistant.voice.stop': 'Stop Voice Input',
    'schemes.title': 'Available Schemes',
    'schemes.filter.country': 'Filter by Country',
    'schemes.filter.category': 'Filter by Category',
    'schemes.apply': 'Apply Now',
    'schemes.details': 'View Details',
  },
  es: {
    'app.title': 'SchemeGenie',
    'app.subtitle': 'Descubre Beneficios, Transforma Vidas',
    'nav.home': 'Inicio',
    'nav.assistant': 'Asistente IA',
    'nav.schemes': 'Programas',
    'nav.formhelp': 'Ayuda Formularios',
    'nav.reminders': 'Recordatorios',
    'nav.dashboard': 'Panel',
    'home.hero.title': 'Descubre Beneficios Gubernamentales con IA',
    'home.hero.subtitle': 'Obtén asistencia personalizada para encontrar y solicitar programas de beneficios mundialmente',
    'common.getstarted': 'Comenzar',
    'common.learnmore': 'Saber Más',
    'assistant.title': 'Asistente IA',
    'assistant.placeholder': 'Pregúntame sobre programas de beneficios...',
    'schemes.title': 'Programas Disponibles',
    'schemes.apply': 'Aplicar Ahora',
  },
  fr: {
    'app.title': 'SchemeGenie',
    'app.subtitle': 'Découvrez les Avantages, Transformez les Vies',
    'nav.home': 'Accueil',
    'nav.assistant': 'Assistant IA',
    'nav.schemes': 'Programmes',
    'nav.formhelp': 'Aide Formulaires',
    'nav.reminders': 'Rappels',
    'nav.dashboard': 'Tableau de Bord',
    'home.hero.title': 'Découvrez les Avantages Gouvernementaux avec l\'IA',
    'home.hero.subtitle': 'Obtenez une assistance personnalisée pour trouver et postuler aux programmes d\'avantages mondialement',
    'common.getstarted': 'Commencer',
    'common.learnmore': 'En Savoir Plus',
    'assistant.title': 'Assistant IA',
    'assistant.placeholder': 'Demandez-moi tout sur les programmes d\'avantages...',
    'schemes.title': 'Programmes Disponibles',
    'schemes.apply': 'Postuler Maintenant',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('schemeGenie_language');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('schemeGenie_language', lang);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};