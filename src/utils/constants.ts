console.log('Environment check:', {
  hasGemini: !!import.meta.env.VITE_GEMINI_API_KEY,
  hasFirebase: !!import.meta.env.VITE_FIREBASE_API_KEY
});

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const OPENROUTER_CONFIG = {
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'openai/gpt-4o',
  siteUrl: 'https://schemegenie.netlify.app',
  siteName: 'SchemeGenie'
};

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
export const ELEVEN_LABS_VOICE_ID = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || 'Yn7ZGcnIT42aEVtWJH4C';

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ABCDEF'
};

// Moved to separate file to reduce bundle size
export const REAL_INDIAN_SCHEMES_DATA = [
  {
    id: 'nmms-2024',
    title: 'National Means‑cum‑Merit Scholarship (NMMS)',
    description: 'Merit-based scholarship for economically disadvantaged students in classes 9-12.',
    category: 'education',
    country: 'IN',
    eligibility: ['Class 9–12 students', 'Income below limit', 'Merit-based'],
    benefits: ['₹12,000 per year', 'Renewable annually'],
    documents: ['Income certificate', 'School certificate', 'Bank details'],
    deadline: '2025-10-31',
    website: 'https://scholarships.gov.in',
    isActive: true,
    amount: '₹12,000 per year'
  },
  {
    id: 'pmrf-2024',
    title: 'Prime Minister\'s Research Fellowship (PMRF)',
    description: 'Fellowship for Ph.D. programs at premier institutes.',
    category: 'education',
    country: 'IN',
    eligibility: ['Ph.D. admission', 'Excellent academic record'],
    benefits: ['₹70,000-80,000/month', '₹2L contingency'],
    documents: ['Academic transcripts', 'Research proposal'],
    deadline: '2025-12-15',
    website: 'https://pmrf.in',
    isActive: true,
    amount: '₹70,000-80,000/month'
  }
];