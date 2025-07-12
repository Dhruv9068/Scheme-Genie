import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, Mic, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ChatBot } from '../components/Assistant/ChatBot';
import { useLanguage } from '../context/LanguageContext';

export const Assistant: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: MessageCircle,
      title: 'Smart Conversations',
      description: 'Ask questions in natural language and get personalized responses',
    },
    {
      icon: Mic,
      title: 'Voice Support',
      description: 'Speak your questions and hear responses back for accessibility',
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Get help in your preferred language from our 20+ supported languages',
    },
    {
      icon: Bot,
      title: 'AI Powered',
      description: 'Advanced AI understands your needs and provides accurate guidance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-white pt-20">
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
            AI-Powered Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your intelligent companion for discovering and applying to benefit schemes worldwide.
            Ask me anything about government programs, eligibility, or application processes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] relative overflow-visible z-10 shadow-2xl border-2 border-orange-100" style={{ zIndex: 10 }}>
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full shadow-md flex items-center justify-center">
                    <img src="/Logo.png" alt="SchemeGenie" className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">SchemeGenie Assistant</h2>
                    <p className="text-sm text-orange-100">Online and ready to help</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full relative overflow-visible" style={{ zIndex: 20 }}>
                <ChatBot />
              </CardContent>
            </Card>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">🎯 How I Can Help</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <p className="text-sm text-gray-600">**Speak naturally** to describe your situation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <p className="text-sm text-gray-600">Get **instant voice responses** with ElevenLabs</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <p className="text-sm text-gray-600">**Continuous conversation** mode available</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    <p className="text-sm text-gray-600">**Auto-speak responses** for hands-free use</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <p className="text-sm text-gray-600">**Multilingual voice** support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="cursor-default card-hover-shine">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg flex items-center justify-center">
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🎤 Voice Tips</h4>
                <p className="text-sm text-gray-600">
                  Speak clearly and naturally. Try saying: **"I'm a 25-year-old student in India looking for education funding"** 
                  or **"What housing schemes are available for low-income families?"**
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🚀 Extension Demo</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Try our **Chrome Extension** to auto-fill government forms!
                </p>
                <div className="space-y-2">
                  <a 
                    href="/NMMS.html" 
                    target="_blank"
                    className="block text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    📚 NMMS Form Demo
                  </a>
                  <a 
                    href="/PMRF.html" 
                    target="_blank"
                    className="block text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    🔬 PMRF Form Demo
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};