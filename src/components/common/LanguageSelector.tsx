import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const currentLang = languages[currentLanguage as keyof typeof languages];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200 rounded-lg hover:bg-gray-50"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang?.flag}</span>
        <span className="hidden lg:inline">{currentLang?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto"
          >
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  currentLanguage === code ? 'bg-yellow-50 text-black' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLanguage === code && (
                  <span className="ml-auto text-yellow-500">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};