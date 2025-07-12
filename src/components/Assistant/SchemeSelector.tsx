import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { firebaseService } from '../../services/firebase';

interface SchemeSelectorProps {
  onSchemeSelect: (scheme: any) => void;
  onStartConversation: () => void;
}

export const SchemeSelector: React.FC<SchemeSelectorProps> = ({ 
  onSchemeSelect, 
  onStartConversation 
}) => {
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    loadEligibleSchemes();
  }, []);

  const loadEligibleSchemes = async () => {
    try {
      setLoading(true);
      // Load demo schemes since no auth is needed
      const schemes = await firebaseService.getSchemes();
      setEligibleSchemes(schemes.slice(0, 8)); // Limit to 8 schemes for dropdown
    } catch (error) {
      console.error('Failed to load eligible schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeSelect = (schemeId: string) => {
    const scheme = eligibleSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setSelectedScheme(schemeId);
      setIsDropdownOpen(false);
      onSchemeSelect(scheme);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" text="Finding available schemes..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="text-center">
        <div className="w-12 h-12 bg-white rounded-2xl border border-orange-200 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose How You'd Like to Proceed
        </h3>
        <p className="text-gray-600 text-sm">
          I can help you with specific schemes or answer general questions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Scheme Selection Option */}
        <Card className="card-hover-shine">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Apply for Specific Scheme</h4>
                <p className="text-sm text-gray-600">Get help with a particular scheme</p>
              </div>
            </div>

            {eligibleSchemes.length > 0 ? (
              <div className="space-y-3">
                <div className="relative z-50">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-sm"
                  >
                    <span className="text-gray-700 font-medium">
                      {selectedScheme 
                        ? eligibleSchemes.find(s => s.id === selectedScheme)?.title 
                        : `Select from ${eligibleSchemes.length} available schemes`
                      }
                    </span>
                    <ChevronDown className={`h-5 w-5 text-orange-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-[9999] max-h-80 overflow-y-auto"
                      style={{ 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      {eligibleSchemes.map((scheme) => (
                        <button
                          key={scheme.id}
                          onClick={() => handleSchemeSelect(scheme.id)}
                          className="w-full px-4 py-4 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl group"
                        >
                          <div className="font-semibold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                            {scheme.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                            {scheme.description}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                              {scheme.country}
                            </span>
                            <span className="text-xs text-green-600 font-semibold">
                              {scheme.deadline === 'Rolling basis' ? 'Rolling basis' : `Due: ${new Date(scheme.deadline).toLocaleDateString()}`}
                            </span>
                            {scheme.amount && (
                              <span className="text-xs text-blue-600 font-semibold">
                                {scheme.amount}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {selectedScheme && (
                  <Button
                    onClick={() => handleSchemeSelect(selectedScheme)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Help with This Scheme
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="text-yellow-800 text-sm font-medium">No schemes found</p>
                  <p className="text-yellow-700 text-xs mt-1">Browse available schemes</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Conversation Option */}
        <Card className="card-hover-shine border-2 border-blue-200 hover:border-blue-300 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">General Questions & Chat</h4>
                <p className="text-sm text-gray-600">Ask me anything about schemes, eligibility, or application processes</p>
              </div>
            </div>

            <Button
              onClick={onStartConversation}
              variant="outline"
              className="w-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              Start Conversation
              <MessageSquare className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};