import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, Send as SendIcon } from 'lucide-react';
import { Send, User, Mic, MicOff, Volume2, VolumeX, Globe, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';
import { geminiService } from '../../services/gemini';
import { speechService } from '../../services/speech';
import { elevenLabsService } from '../../services/elevenLabs';
import { firebaseService } from '../../services/firebase';
import { Card } from '../ui/Card';
import { ChatMessage } from '../../utils/types';
import toast from 'react-hot-toast';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const { currentLanguage, t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [availableSchemes, setAvailableSchemes] = useState<any[]>([]);
  const [isSchemeDropdownOpen, setIsSchemeDropdownOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    loadAvailableSchemes();
    initializeChat();
  }, []);

  useEffect(() => {
    if (selectedScheme) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Great! I'll help you with the **"${selectedScheme.title}"** scheme. I can:

• **Explain eligibility requirements**
• **Guide you through the application process**
• **Help fill out forms automatically**
• **Answer specific questions about this scheme**

What would you like to know about this scheme?`,
        isUser: false,
        timestamp: new Date(),
        language: 'en',
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedScheme]);

  const loadAvailableSchemes = async () => {
    try {
      const schemes = await firebaseService.getSchemes();
      setAvailableSchemes(schemes.slice(0, 8));
    } catch (error) {
      console.error('Failed to load schemes:', error);
    }
  };

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: `Hello! I'm your **SchemeGenie AI assistant**. I can help you:

• **Find schemes you're eligible for**
• **Understand eligibility requirements**
• **Guide you through application processes**
• **Fill out applications automatically**

What questions do you have about government schemes?`,
      isUser: false,
      timestamp: new Date(),
      language: 'en',
    };
    setMessages([welcomeMessage]);
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .split('\n')
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
      ));
  };

  const handleSchemeSelect = (scheme: any) => {
    setSelectedScheme(scheme);
    setIsSchemeDropdownOpen(false);
    
    // Save user's interest in this scheme
    try {
      firebaseService.saveUserApplication('demo-user', {
        schemeId: scheme.id,
        schemeTitle: scheme.title,
        status: 'interested',
        schemeData: scheme
      });
    } catch (error) {
      console.error('Failed to save user interest:', error);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Stop any current speech
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsSpeaking(false);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      language: 'en',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check if user wants to apply for a scheme
    if (text.toLowerCase().includes('apply') || text.toLowerCase().includes('fill form') || text.toLowerCase().includes('start application')) {
      if (selectedScheme) {
        try {
          const formData = {
            fullName: 'Demo User',
            email: 'demo@schemegenie.com',
            phone: '+91-9876543210',
            age: '22',
            income: '25000',
            education: 'Bachelor of Engineering',
            employment: 'Student',
            location: 'Bangalore, Karnataka',
            schemeId: selectedScheme.id,
            schemeTitle: selectedScheme.title
          };

          setApplicationData(formData);
          setShowApplicationForm(true);
          setIsLoading(false);

          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: `✅ **Application Form Generated!**

I've automatically pre-filled your application for **"${selectedScheme.title}"** using your profile data.

**Pre-filled Information:**
• **Name:** ${formData.fullName}
• **Email:** ${formData.email}
• **Age:** ${formData.age}
• **Education:** ${formData.education}
• **Income:** ₹${formData.income}

**Next Steps:**
1. **Review the form below**
2. **Click "Save to Dashboard" to save as draft**
3. **Click "Submit Application" when ready**
4. **Use Chrome Extension on government portals**

The form is ready for submission!`,
            isUser: false,
            timestamp: new Date(),
            language: 'en',
          };

          setMessages(prev => [...prev, botMessage]);
          return;
        } catch (error) {
          console.error('Failed to generate form:', error);
        }
      }
    }

    try {
      const languageInstruction = currentLanguage !== 'en' 
        ? `Please respond in ${currentLanguage} language. ` 
        : '';

      const enhancedPrompt = selectedScheme 
        ? `${languageInstruction}You are SchemeGenie AI assistant helping automate the application for "${selectedScheme.title}".
        
        Scheme Details:
        - Title: ${selectedScheme.title}
        - Description: ${selectedScheme.description}
        - Country: ${selectedScheme.country}
        - Category: ${selectedScheme.category}
        - Eligibility: ${selectedScheme.eligibility?.join(', ') || 'Not specified'}
        - Benefits: ${selectedScheme.benefits?.join(', ') || 'Not specified'}
        - Deadline: ${selectedScheme.deadline || 'Not specified'}
        - Website: ${selectedScheme.website || 'Not specified'}
        - Application Process: ${selectedScheme.applicationProcess || 'Standard process'}
        - Amount: ${selectedScheme.amount || 'Varies'}
        
        User question: "${text}"
        
        Your role is to AUTOMATE the application process:
        1. If they ask about requirements: Explain eligibility and help them check if they qualify
        2. If they want to apply: Offer to pre-fill the application form using their profile
        3. If they need documents: List exactly what's needed and help them prepare
        4. If they're ready to submit: Guide them to use our Chrome Extension or direct submission
        
        ALWAYS mention:
        - "I can pre-fill your application form automatically"
        - "Use our Chrome Extension to auto-fill government forms"
        - "I'll save your progress in the dashboard for approval"
        
        Be specific, actionable, and focus on automation. Format your response with proper bullet points and bold text for important information.`
        : `${languageInstruction}You are SchemeGenie AI assistant. The user said: "${text}"
      
      Your role is to:
      1. Help users find eligible government schemes
      2. Guide them through application processes
      3. Provide specific, actionable advice
      4. AUTOMATE application filling process
      
      If they ask about schemes or eligibility, offer to:
      - Show them personalized scheme matches
      - Pre-fill applications automatically using AI
      - Explain requirements and deadlines
      - Use Chrome Extension for government portals
      
      If they want to apply for a scheme, offer to automate the entire process.
      
      ALWAYS mention our automation features:
      - AI pre-fills applications
      - Chrome Extension auto-fills government forms
      - Dashboard for approval and tracking
      
      Keep responses helpful, specific, and focused on automation. Format your response with proper bullet points and bold text for important information.`;

      let response;
      try {
        response = await geminiService.generateContent(enhancedPrompt, 'en');
      } catch (error) {
        console.error('AI service failed:', error);
        response = selectedScheme 
          ? `I can help you with **"${selectedScheme.title}"**! This scheme offers **${selectedScheme.amount}** and is perfect for your profile. 
          
Here's what I can do:
✅ **Pre-fill your application automatically**
✅ **Check all eligibility requirements**  
✅ **Guide you through document preparation**
✅ **Use our Chrome Extension for government portals**

Would you like me to start preparing your application?`
          : `I'm here to help you discover and apply for government schemes! 
          
I can:
🎯 **Find schemes you're eligible for**
📝 **Auto-fill applications using AI**  
🔔 **Send deadline reminders**
🌐 **Work with government portals via Chrome Extension**

What type of assistance are you looking for today?`;
      }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        language: 'en',
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Auto-speak the response if enabled
      if (autoSpeak && !isSpeaking) {
        handleSpeak(response);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `I'm here to help with government schemes! While my AI is temporarily unavailable, I can still:
        
✅ **Show you eligible schemes in your dashboard**
✅ **Help with NMMS, PMRF, and other scholarships**  
✅ **Guide you through application processes**
✅ **Use Chrome Extension for form filling**

What would you like to know about government benefits?`,
        isUser: false,
        timestamp: new Date(),
        language: 'en',
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApplication = async () => {
    if (!applicationData) return;
    
    try {
      await firebaseService.saveUserApplication('demo-user', {
        schemeId: applicationData.schemeId,
        schemeTitle: applicationData.schemeTitle,
        applicationData,
        status: 'draft',
        amount: selectedScheme?.amount || 'Varies'
      });
      
      toast.success('Application saved to dashboard!');
      setShowApplicationForm(false);
      
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `✅ **Application Saved Successfully!**

Your application for **"${applicationData.schemeTitle}"** has been saved to your dashboard.

**What's Next:**
1. **Go to Dashboard to review and approve**
2. **Once approved, use Chrome Extension on government portals**
3. **The extension will auto-fill forms with this data**

Would you like me to help with another scheme?`,
        isUser: false,
        timestamp: new Date(),
        language: 'en',
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to save application:', error);
      toast.error('Failed to save application');
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationData) return;
    
    try {
      await firebaseService.saveUserApplication('demo-user', {
        ...applicationData,
        status: 'submitted'
      });
      
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error('Failed to submit application');
    }
  };

  const handleVoiceInput = async () => {
    if (!speechService.isSupported()) {
      toast.error('Voice input is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      speechService.stopListening?.();
      return;
    }

    try {
      setIsListening(true);
      toast.success('Listening... Speak now!');
      
      const transcript = await speechService.startListening('en-US');
      setIsListening(false);
      
      if (transcript && transcript.trim()) {
        toast.success('Voice input captured!');
        handleSendMessage(transcript);
      } else {
        toast.error('No speech detected. Please try again.');
      }
    } catch (error) {
      console.error('Voice input failed:', error);
      setIsListening(false);
      toast.error('Voice input failed. Please check your microphone.');
    }
  };

  const handleSpeak = async (text: string) => {
    // Stop any current speech first
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsSpeaking(false);
      setCurrentAudio(null);
    }
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      
      // Clean text for speech (remove markdown and HTML)
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/<[^>]*>/g, '')
        .replace(/•/g, '')
        .trim();
      
      // Try ElevenLabs first with the specified voice ID
      try {
        const audioBlob = await elevenLabsService.generateSpeech(cleanText, 'Yn7ZGcnIT42aEVtWJH4C');
        const audio = new Audio(URL.createObjectURL(audioBlob));
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentAudio(null);
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          setCurrentAudio(null);
        };
        
        await audio.play();
      } catch (elevenLabsError) {
        console.warn('ElevenLabs failed, falling back to browser speech:', elevenLabsError);
        // Fallback to browser speech synthesis
        speechService.stopSpeaking();
        await speechService.speak(cleanText, 'en-US');
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setIsSpeaking(false);
      toast.error('Speech output failed');
    }
  };

  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const handleContinuousConversation = async () => {
    if (!speechService.isSupported()) {
      toast.error('Voice input is not supported in your browser.');
      return;
    }

    try {
      setIsListening(true);
      toast.success('Continuous conversation mode activated! Speak your question...');
      
      const transcript = await speechService.startListening('en-US');
      setIsListening(false);
      
      if (transcript && transcript.trim()) {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          text: transcript,
          isUser: true,
          timestamp: new Date(),
          language: 'en',
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
          const response = await geminiService.generateContent(transcript, 'en');
          
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: response,
            isUser: false,
            timestamp: new Date(),
            language: 'en',
          };

          setMessages(prev => [...prev, botMessage]);
          
          // Automatically speak the response
          await handleSpeak(response);
          
        } catch (error) {
          console.error('Failed to get AI response:', error);
          toast.error('Failed to get AI response');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Continuous conversation failed:', error);
      setIsListening(false);
      toast.error('Voice conversation failed');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[700px]">
      {/* Header with Scheme Selector */}
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full shadow-sm border border-orange-100 flex items-center justify-center">
              <img src="/Logo.png" alt="SchemeGenie" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">SchemeGenie AI Assistant</h3>
              <p className="text-xs text-gray-600">Choose a scheme or ask general questions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setAutoSpeak(!autoSpeak)}
              variant="ghost"
              size="sm"
              className={`p-2 ${autoSpeak ? 'text-orange-600 bg-orange-100' : 'text-gray-400'}`}
              title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
            >
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="ghost"
                size="sm"
                className="p-2 text-red-600 bg-red-100 animate-pulse"
                title="Stop speaking"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleContinuousConversation}
              variant="ghost"
              size="sm"
              className={`p-2 ${isListening ? 'text-red-600 bg-red-100 animate-pulse' : 'text-blue-600 bg-blue-100'}`}
              title="Start voice conversation"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scheme Selector */}
        <div className="relative">
          <button
            onClick={() => setIsSchemeDropdownOpen(!isSchemeDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-sm"
          >
            <span className="text-gray-700 font-medium">
              {selectedScheme 
                ? `🎯 ${selectedScheme.title}` 
                : `💬 General Questions (or select a specific scheme)`
              }
            </span>
            <ChevronDown className={`h-5 w-5 text-orange-500 transition-transform duration-200 ${isSchemeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSchemeDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-[9999] max-h-80 overflow-y-auto"
            >
              <button
                onClick={() => {
                  setSelectedScheme(null);
                  setIsSchemeDropdownOpen(false);
                  initializeChat();
                }}
                className="w-full px-4 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 first:rounded-t-xl group"
              >
                <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                  💬 General Questions & Chat
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Ask me anything about schemes, eligibility, or application processes
                </div>
              </button>
              
              {availableSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => handleSchemeSelect(scheme)}
                  className="w-full px-4 py-4 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 last:rounded-b-xl group"
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-orange-500 text-white' : 'bg-white border border-orange-100'
                }`}>
                  {message.isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <img src="/Logo.png" alt="SchemeGenie" className="w-5 h-5" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-lg relative ${
                  message.isUser 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  <div className="text-sm leading-relaxed">
                    {formatMessage(message.text)}
                  </div>
                  {!message.isUser && (
                    <button
                      onClick={() => handleSpeak(message.text)}
                      disabled={isSpeaking}
                      className={`absolute -right-2 -top-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSpeaking 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'
                      }`}
                      title={isSpeaking ? 'Stop speaking' : 'Speak message'}
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center">
                <img src="/Logo.png" alt="SchemeGenie" className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
                <LoadingSpinner size="sm" text="Thinking..." />
              </div>
            </div>
          </motion.div>
        )}
        
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-blue-100 border border-blue-200 px-4 py-3 rounded-lg flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 text-sm font-medium">Listening... Speak now!</span>
              <Mic className="h-4 w-4 text-blue-600" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Application Form Modal */}
      {showApplicationForm && applicationData && (
        <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Application Form - {applicationData.schemeTitle}
              </h3>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={applicationData.fullName} className="w-full p-2 border rounded" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={applicationData.email} className="w-full p-2 border rounded" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="text" value={applicationData.age} className="w-full p-2 border rounded" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income</label>
                  <input type="text" value={`₹${applicationData.income}`} className="w-full p-2 border rounded" readOnly />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button onClick={handleSaveApplication} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Save to Dashboard
                </Button>
                <Button onClick={handleSubmitApplication} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question or use voice input..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isListening}
              className="bg-white"
            />
          </div>
          <Button
            onClick={handleVoiceInput}
            variant={isListening ? 'primary' : 'outline'}
            size="md"
            className={`px-3 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            disabled={isLoading}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading || isListening}
            className="px-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>💡 {selectedScheme ? 'Ask about requirements, deadlines, or application process' : 'Try: "What schemes am I eligible for?"'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`flex items-center space-x-1 ${autoSpeak ? 'text-orange-600' : 'text-gray-400'}`}>
              <Volume2 className="h-3 w-3" />
              <span>Auto-speak {autoSpeak ? 'ON' : 'OFF'}</span>
            </span>
            <span className="text-gray-400">English Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};