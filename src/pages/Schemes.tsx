import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { SchemeFilter } from '../components/Schemes/SchemeFilter';
import { SchemeCard } from '../components/Schemes/SchemeCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { firebaseService } from '../services/firebase';
import { emailService } from '../services/emailjs';
import { Scheme } from '../utils/types';
import toast, { Toaster } from 'react-hot-toast';

export const Schemes: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    loadSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm, selectedCountry, selectedCategory]);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      const schemesData = await firebaseService.getSchemes(undefined, undefined, true);
      setSchemes(schemesData);
    } catch (error) {
      console.error('Failed to load schemes:', error);
      toast.error('Failed to load schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = [...schemes];

    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(scheme => scheme.country === selectedCountry);
    }

    if (selectedCategory) {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    setFilteredSchemes(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedCategory('');
  };

  const handleApplyScheme = async (scheme: Scheme) => {
    try {
      // Navigate to AI Assistant with scheme context
      window.location.href = `/assistant?scheme=${scheme.id}`;
      toast.success(`Opening AI Assistant for ${scheme.title}!`);
    } catch (error) {
      console.error('Failed to initiate application:', error);
      toast.error('Failed to initiate application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading schemes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid grid-hover-effect pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl shadow-lg border-2 border-orange-200 flex items-center justify-center animate-float">
            <img src="/Logo.png" alt="SchemeGenie" className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Browse Government Schemes
            <div className="inline-block ml-2 w-8 h-8 bg-white rounded-2xl border border-orange-200 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-orange-600" />
            </div>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Discover government benefit schemes and social programs tailored to your needs.
            Filter by country, category, or search for specific programs.
          </p>
          <Button 
            variant="outline" 
            onClick={loadSchemes}
            className="rounded-xl"
          >
            Refresh Real-Time Data
          </Button>
        </motion.div>

        <SchemeFilter
          searchTerm={searchTerm}
          selectedCountry={selectedCountry}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCountryChange={setSelectedCountry}
          onCategoryChange={setSelectedCategory}
          onClearFilters={handleClearFilters}
        />

        {filteredSchemes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-12 h-12 bg-white rounded-2xl border border-orange-200 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find more schemes.
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SchemeCard
                  scheme={scheme}
                  onApply={handleApplyScheme}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredSchemes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              Showing {filteredSchemes.length} of {schemes.length} real-time schemes
            </p>
            <Button variant="outline" onClick={loadSchemes}>
              Refresh Schemes
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};