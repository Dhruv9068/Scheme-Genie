import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.assistant'), href: '/assistant' },
    { name: t('nav.schemes'), href: '/schemes' },
    { name: t('nav.dashboard'), href: '/dashboard' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
        <div className="bg-white/90 backdrop-blur-sm border border-orange-100 rounded-full shadow-lg px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 bg-cream-200 rounded-full shadow-md flex items-center justify-center"
              >
                <img src="/Logo.png" alt="SchemeGenie" className="w-7 h-7" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                SchemeGenie
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive(item.href)
                      ? 'text-orange-600 bg-orange-50 shadow-sm'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.open('https://drive.google.com/file/d/1AyjKXPKP8m8TU5uzvvYs6i8X0S6nEM9N/view?usp=sharing', '_blank')}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-full"
              >
                <Download className="h-4 w-4" />
                <span>Extension</span>
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-full"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-orange-100 pt-4 mt-4"
            >
              <nav className="space-y-2">
                {[
                  ...navigation,
                  {name: 'Download Extension', href: 'https://drive.google.com/file/d/1AyjKXPKP8m8TU5uzvvYs6i8X0S6nEM9N/view?usp=sharing'},
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.href.startsWith('http')) {
                        window.open(item.href, '_blank');
                      }
                    }}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-full ${
                      isActive(item.href)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    } w-full text-left`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};