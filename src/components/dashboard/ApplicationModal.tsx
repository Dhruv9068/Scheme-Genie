import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MatchedScheme } from './MatchedSchemes';
import { firebaseService } from '../../services/firebase';
import toast from 'react-hot-toast';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: MatchedScheme | null;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  income: string;
  reason: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  scheme
}) => {
  const [step, setStep] = useState<'questions' | 'options'>('questions');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    income: '',
    reason: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    setStep('options');
  };

  const handleSubmitOnSchemeGenie = () => {
    handleSaveApplication('submitted');
  };

  const handleSaveApplication = async (status: 'draft' | 'submitted') => {
    if (!scheme) return;
    
    try {
      // Save to demo storage
      const applicationData = {
        schemeId: scheme.id,
        schemeTitle: scheme.title,
        schemeData: scheme,
        applicationData: formData,
        status,
        amount: scheme.amount,
        createdAt: new Date(),
        id: `app_${Date.now()}`
      };
      
      // Store in localStorage for demo
      const existingApps = JSON.parse(localStorage.getItem('demo_applications') || '[]');
      existingApps.push(applicationData);
      localStorage.setItem('demo_applications', JSON.stringify(existingApps));
      
      toast.success(
        status === 'submitted' 
          ? 'Application submitted successfully!' 
          : 'Application saved to your dashboard!'
      );
    } catch (error) {
      console.error('Failed to save application:', error);
      toast.error('Failed to save application');
    }
    
    onClose();
  };

  const handleFillOnGovernmentPortal = () => {
    // Open government portal
    const portalUrl = scheme?.officialPortal || scheme?.website;
    if (portalUrl) {
      window.open(portalUrl, '_blank');
    }
    onClose();
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  if (!isOpen || !scheme) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Apply for Scheme</h2>
                  <p className="text-orange-100 text-sm">{scheme.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'questions' && (
                <div className="space-y-6 card-hover-shine">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-white rounded-2xl border border-orange-200 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Quick Application Questions</h3>
                      <p className="text-sm text-gray-600">Help us prepare your application</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Full Name *"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full legal name"
                    />

                    <Input
                      label="Email Address *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />

                    <Input
                      label="Phone Number *"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />

                    <Input
                      label="Annual Income *"
                      type="number"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                      placeholder="Enter your annual income in USD"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Why are you applying for this scheme? *
                      </label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        placeholder="Briefly explain your situation and why you need this assistance..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleContinue}
                    disabled={!isFormValid}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl"
                  >
                    Continue to Application Options
                  </Button>
                </div>
              )}

              {step === 'options' && (
                <div className="space-y-6 card-hover-shine">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-white rounded-2xl border border-orange-200 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Choose Application Method</h3>
                      <p className="text-sm text-gray-600">How would you like to submit your application?</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {scheme.govApiSupport && (
                      <div className="border border-green-200 rounded-2xl p-6 bg-green-50 card-hover-shine">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">Submit on SchemeGenie</h4>
                            <p className="text-sm text-gray-600 mb-4">
                              We'll submit your application directly to the government portal using our secure API integration.
                            </p>
                            <Button
                              onClick={handleSubmitOnSchemeGenie}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                            >
                              Submit on SchemeGenie
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border border-orange-200 rounded-xl p-6 bg-orange-50">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                          <ExternalLink className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">Fill on Government Portal</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Visit the official government website. Use our Chrome Extension to auto-fill this form with your information.
                          </p>
                          <div className="bg-white border border-orange-200 rounded-lg p-3 mb-4">
                            <p className="text-xs text-gray-600 mb-2 flex items-center">
                              <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                                <span className="text-xs">💡</span>
                              </div>
                              Pro Tip:
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Download our Chrome Extension</strong> to automatically fill forms on the government portal. 
                              <br />
                              <span className="text-orange-600">Download file → Unzip it → Upload to your extension</span>
                            </p>
                          </div>
                          <Button
                            onClick={handleFillOnGovernmentPortal}
                            variant="outline"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl"
                          >
                            <div className="w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center mr-2">
                              <ExternalLink className="h-3 w-3 text-orange-600" />
                            </div>
                            Open Government Portal
                          </Button>
                          <Button
                            onClick={() => handleSaveApplication('draft')}
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl mt-2"
                          >
                            Save to Dashboard
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};