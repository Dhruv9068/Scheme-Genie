import OpenAI from 'openai';
import { GEMINI_API_KEY, GEMINI_API_URL, OPENROUTER_CONFIG } from '../utils/constants';

export class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private openai: OpenAI;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.apiUrl = GEMINI_API_URL;
    
    console.log('Gemini API Key available:', !!this.apiKey);
    console.log('OpenRouter API Key available:', !!OPENROUTER_CONFIG.apiKey);
    
    // Initialize OpenRouter as fallback
    this.openai = new OpenAI({
      baseURL: OPENROUTER_CONFIG.baseURL,
      apiKey: OPENROUTER_CONFIG.apiKey,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'HTTP-Referer': OPENROUTER_CONFIG.siteUrl,
        'X-Title': OPENROUTER_CONFIG.siteName,
      },
    });
  }

  async generateContent(prompt: string, language: string = 'en'): Promise<string> {
    // If no API keys available, return fallback response
    if (!this.apiKey && !OPENROUTER_CONFIG.apiKey) {
      console.warn('No API keys available, returning fallback response');
      return this.getFallbackResponse(prompt);
    }
    
    const systemPrompt = `You are SchemeGenie, a helpful AI assistant that helps people discover and apply for government benefit schemes worldwide. 
    
    Always respond in ${language === 'en' ? 'English' : `the language code: ${language}`}.
    
    Provide clear, helpful, and accurate information about:
    - Government benefit schemes and social programs
    - Eligibility criteria and requirements
    - Application processes and documentation
    - Deadlines and important dates
    - Contact information and resources
    
    Keep responses conversational, supportive, and actionable.`;

    // Try Gemini first
    if (this.apiKey) {
      try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser question: ${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.candidates[0]?.content?.parts[0]?.text;
        if (result) {
          return result;
        }
      }
      
      throw new Error(`Gemini API failed: ${response.statusText}`);
      } catch (geminiError) {
      console.warn('Gemini API failed, falling back to OpenRouter:', geminiError);
      }
    }
      
      // Fallback to OpenRouter
    if (OPENROUTER_CONFIG.apiKey) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: OPENROUTER_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      } catch (openRouterError) {
        console.error('OpenRouter API also failed:', openRouterError);
      }
    }
    
    // Final fallback
    return this.getFallbackResponse(prompt);
  }
  
  private getFallbackResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('nmms') || lowerPrompt.includes('scholarship')) {
      return `I can help you with the National Means-cum-Merit Scholarship (NMMS)! 
      
**Key Details:**
- **Amount:** ₹12,000 per year
- **Eligibility:** Class 9-12 students from economically disadvantaged families
- **Application:** Through scholarships.gov.in
- **Deadline:** October 31, 2025

**Requirements:**
- Family income below specified limit
- Good academic performance
- Studying in government/aided school

Would you like me to help you apply for this scholarship? I can guide you through the application process step by step.`;
    }
    
    if (lowerPrompt.includes('pmrf') || lowerPrompt.includes('research')) {
      return `The Prime Minister's Research Fellowship (PMRF) is excellent for Ph.D. students!
      
**Benefits:**
- ₹70,000-80,000 per month
- ₹2 lakh annual contingency
- Available at IISc, IITs, IISERs

**Eligibility:**
- Excellent academic record
- Ph.D. admission at premier institutes
- Research aptitude

I can help you prepare your application and guide you through the requirements.`;
    }
    
    if (lowerPrompt.includes('apply') || lowerPrompt.includes('application')) {
      return `I can help you apply for government schemes! Here's what I can do:
      
✅ **Find eligible schemes** based on your profile
✅ **Pre-fill applications** automatically 
✅ **Guide you through requirements**
✅ **Track deadlines** and send reminders
✅ **Use Chrome Extension** for auto-filling government forms

Which type of scheme are you interested in?
- Education/Scholarships
- Research Fellowships  
- Business/Startup funding
- Housing assistance
- Healthcare benefits`;
    }
    
    return `I'm here to help you with government benefit schemes! I can:
    
🎯 **Find schemes** you're eligible for
📝 **Auto-fill applications** using AI
🔔 **Send reminders** for deadlines
🌐 **Work in multiple languages**
🤖 **Use Chrome Extension** for seamless form filling

What would you like to know about government schemes or benefits?`;
  }

  async fetchRealSchemes(country?: string, category?: string): Promise<any[]> {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const prompt = `Generate a list of 15 real, current government benefit schemes that are active as of ${currentDate}. 
      ${country ? `Focus on schemes from ${country}.` : 'Include schemes from India and other countries like US, UK, Canada, Australia, Germany, etc.'}
      ${category ? `Focus on ${category} related schemes.` : 'Include various categories like education, healthcare, housing, business, employment, etc.'}
      
      IMPORTANT: Include these real Indian schemes with accurate information:
      1. National Means-cum-Merit Scholarship (NMMS) - ₹12,000/year for Class 9-12 students
      2. Prime Minister's Research Fellowship (PMRF) - ₹70,000-80,000/month for Ph.D.
      3. CSIR-UGC JRF-NET Fellowship - ₹31,000-35,000/month for research
      4. DBT-JRF Fellowship - ₹25,000-28,000/month for biotechnology Ph.D.
      5. AICTE Doctoral Fellowship - ₹37,000-42,000/month for technical Ph.D.
      6. Raita Vidyanidhi Scholarship (Karnataka) - ₹11,000/year for farmers' children
      7. Karnataka Prize Money Scholarship (SC/ST) - ₹7,000-35,000 for merit
      8. ePass Karnataka - ₹3,500/year + ₹1,500/month + fee concession
      9. FAEA Scholarship - Variable support for disadvantaged UG students
      10. Mirae Asset Foundation Scholarship - ₹40,000 UG / ₹50,000 PG
      
      For each scheme, provide:
      1. Exact official title
      2. Brief description (2-3 sentences)
      3. Country
      4. Category (education/healthcare/housing/business/employment/social/disability/elderly/women/youth)
      5. Key eligibility criteria (3-5 points)
      6. Main benefits (3-5 points)
      7. Required documents (3-5 items)
      8. Real application deadline (if ongoing, provide next review date or "Rolling basis")
      9. Official website URL (use real government domains)
      10. Application process details
      11. Specific amount/benefit value
      
      Format as JSON array with this structure:
      [
        {
          "title": "Official Scheme Name",
          "description": "Description here",
          "country": "Country Code (US/UK/CA/IN/AU/DE etc)",
          "category": "category",
          "eligibility": ["criteria1", "criteria2", "criteria3"],
          "benefits": ["benefit1", "benefit2", "benefit3"],
          "documents": ["doc1", "doc2", "doc3"],
          "deadline": "YYYY-MM-DD or Rolling basis",
          "website": "https://official-government-site.gov/scheme",
          "applicationProcess": "Detailed application process",
          "amount": "Specific amount or range"
        }
      ]
      
      Ensure all information is accurate and current. Use real government scheme names and websites. 
      For Indian schemes, use scholarships.gov.in, official ministry websites, and state portals.`;

      const response = await this.generateContent(prompt, 'en');
      
      try {
        // Extract JSON from the response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const schemes = JSON.parse(jsonMatch[0]);
          return schemes.map((scheme: any, index: number) => ({
            id: `real-${Date.now()}-${index}`,
            ...scheme,
            isActive: true
          }));
        }
      } catch (parseError) {
        console.error('Failed to parse schemes JSON:', parseError);
      }
      
      // Return real Indian schemes as fallback
      const { REAL_INDIAN_SCHEMES_DATA } = await import('../utils/constants');
      return REAL_INDIAN_SCHEMES_DATA.map((scheme: any, index: number) => ({
        id: `indian-${Date.now()}-${index}`,
        ...scheme,
        isActive: true
      }));
    } catch (error) {
      console.error('Failed to fetch real schemes:', error);
      // Return real Indian schemes as final fallback
      const { REAL_INDIAN_SCHEMES_DATA } = await import('../utils/constants');
      return REAL_INDIAN_SCHEMES_DATA;
    }
  }

  async getEligibleSchemes(userProfile: any): Promise<any[]> {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const prompt = `Based on this user profile, find 8-10 government schemes they are ACTUALLY eligible for as of ${currentDate}:
      
      User Profile:
      - Age: ${userProfile.age}
      - Income: ${userProfile.income} annually
      - Education: ${userProfile.education}
      - Employment: ${userProfile.employment}
      - Family Size: ${userProfile.familySize}
      - Location: ${userProfile.location}
      - Country: ${userProfile.country}
      - Interests: ${userProfile.interests?.join(', ') || 'General'}
      - Gender: ${userProfile.gender || 'Not specified'}
      - Disabilities: ${userProfile.disabilities ? 'Yes' : 'No'}
      
      MUST INCLUDE these real Indian schemes if user is eligible (check age, income, education carefully):
      1. National Means-cum-Merit Scholarship (NMMS) - for students Class 9-12
      2. Prime Minister's Research Fellowship (PMRF) - for Ph.D. candidates
      3. CSIR-UGC JRF-NET Fellowship - for research scholars
      4. DBT-JRF Fellowship - for biotechnology Ph.D.
      5. AICTE Doctoral Fellowship - for technical Ph.D.
      6. Raita Vidyanidhi Scholarship - for farmers' children in Karnataka
      7. Karnataka Prize Money Scholarship - for SC/ST merit students
      8. ePass Karnataka - for post-matric students
      9. FAEA Scholarship - for disadvantaged UG students
      10. Mirae Asset Foundation Scholarship - for UG/PG students
      
      ELIGIBILITY RULES:
      - NMMS: Age 14-18, studying in classes 9-12, family income < ₹1.5 lakh
      - PMRF: Age < 28, excellent academic record, for Ph.D. programs
      - Research Fellowships: Age < 28, Master's degree, for research
      - Karnataka schemes: Must be Karnataka resident
      - General education schemes: Age < 25 for UG, < 30 for PG
      
      Return ONLY schemes this user is actually eligible for based on their profile.
      Provide detailed information in JSON format:
      [
        {
          "title": "Official Scheme Name",
          "description": "Detailed description explaining what the scheme offers",
          "country": "Country Code",
          "category": "category",
          "eligibility": ["specific criteria they meet"],
          "benefits": ["specific benefits they'll receive"],
          "documents": ["required documents"],
          "deadline": "Real deadline or Rolling basis",
          "website": "Official government URL",
          "matchReason": "Why this user is eligible",
          "priority": "high/medium/low",
          "summary": "Brief 2-line summary of why this scheme matches the user",
          "applicationProcess": "How to apply",
          "amount": "Specific benefit amount"
        }
      ]`;

      const response = await this.generateContent(prompt, 'en');
      
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const schemes = JSON.parse(jsonMatch[0]);
          return schemes.map((scheme: any, index: number) => ({
            id: `ai-eligible-${Date.now()}-${index}`,
            ...scheme,
            isActive: true
          }));
        }
      } catch (parseError) {
        console.error('Failed to parse eligible schemes:', parseError);
      }
      
      // Return filtered real Indian schemes based on user profile
      const { REAL_INDIAN_SCHEMES_DATA } = await import('../utils/constants');
      const eligibleSchemes = REAL_INDIAN_SCHEMES_DATA.filter(scheme => {
        // Simple eligibility check based on user profile
        if (userProfile.age >= 14 && userProfile.age <= 18 && scheme.id === 'nmms-2024') return true;
        if (userProfile.age <= 28 && userProfile.education?.includes('Master') && scheme.title.includes('Research')) return true;
        if (userProfile.age <= 25 && scheme.category === 'education' && userProfile.employment === 'student') return true;
        if (userProfile.income < 50000 && scheme.title.includes('Merit')) return true;
        return false;
      });
      
      return eligibleSchemes.slice(0, 8).map((scheme, index) => ({
        id: `fallback-eligible-${Date.now()}-${index}`,
        ...scheme,
        matchReason: `Matches your profile: Age ${userProfile.age}, Education ${userProfile.education}, Employment ${userProfile.employment}`,
        priority: 'medium',
        summary: `${scheme.title} - ${scheme.amount}. Suitable for your age and background.`
      }));
    } catch (error) {
      console.error('Failed to get eligible schemes:', error);
      // Return empty array if everything fails
      return [];
    }
  }

  async getSchemeDetails(schemeId: string): Promise<any> {
    try {
      // First check if it's one of our real Indian schemes
      const { REAL_INDIAN_SCHEMES_DATA } = await import('../utils/constants');
      const realScheme = REAL_INDIAN_SCHEMES_DATA.find(s => s.id === schemeId);
      
      if (realScheme) {
        return {
          ...realScheme,
          detailedDescription: `${realScheme.description}\n\nThis is a government scheme designed to provide financial assistance and support to eligible candidates. The application process is streamlined through our AI assistant to ensure you don't miss any requirements.`,
          applicationSteps: [
            'Check eligibility criteria carefully',
            'Gather all required documents',
            'Fill application form accurately',
            'Submit before deadline',
            'Track application status'
          ],
          tips: [
            'Apply early to avoid last-minute rush',
            'Double-check all information before submission',
            'Keep copies of all submitted documents',
            'Follow up on application status regularly'
          ],
          commonRejectionReasons: [
            'Incomplete documentation',
            'Not meeting eligibility criteria',
            'Late submission',
            'Incorrect information provided'
          ]
        };
      }

      // For other schemes, generate details using AI
      const prompt = `Provide comprehensive details about the government scheme with ID: "${schemeId}"
      
      Include:
      1. Full official description
      2. Complete eligibility requirements
      3. All benefits and amounts
      4. Step-by-step application process
      5. Required documents checklist
      6. Important deadlines and timelines
      7. Contact information
      8. Tips for successful application
      9. Common reasons for rejection
      10. Appeal process if rejected
      
      Format as detailed JSON object with all information.`;

      const response = await this.generateContent(prompt, 'en');
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse scheme details:', parseError);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get scheme details:', error);
      return null;
    }
  }

  async generateApplicationForm(scheme: any, userProfile: any): Promise<any> {
    try {
      const prompt = `Generate a complete application form for the scheme "${scheme.title}" based on user profile:
      
      User Profile:
      - Name: ${userProfile.name || 'Not provided'}
      - Age: ${userProfile.age}
      - Income: ${userProfile.income}
      - Education: ${userProfile.education}
      - Employment: ${userProfile.employment}
      - Location: ${userProfile.location}
      - Country: ${userProfile.country}
      
      Scheme Details:
      - Title: ${scheme.title}
      - Eligibility: ${scheme.eligibility?.join(', ')}
      - Required Documents: ${scheme.documents?.join(', ')}
      
      Generate a pre-filled application form with:
      1. All personal details filled from user profile
      2. Scheme-specific questions and answers
      3. Document checklist with status
      4. Eligibility verification
      5. Application summary
      
      Format as JSON with form fields and values.`;

      const response = await this.generateContent(prompt, 'en');
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const formData = JSON.parse(jsonMatch[0]);
          return {
            ...scheme,
            formData,
            preFilledPercentage: 85,
            readyToSubmit: true,
            isActive: true
          };
        }
      } catch (parseError) {
        console.error('Failed to parse application form:', parseError);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to generate application form:', error);
      return null;
    }
  }

  async automateApplicationProcess(scheme: any, userProfile: any, conversationHistory: string[]): Promise<string> {
    try {
      const prompt = `You are SchemeGenie AI helping automate the application process for "${scheme.title}".
      
      User Profile: ${JSON.stringify(userProfile)}
      Scheme Details: ${JSON.stringify(scheme)}
      Conversation History: ${conversationHistory.join('\n')}
      
      Based on the conversation, provide the next step in the application automation process:
      
      1. If user wants to start application: Guide them through document preparation
      2. If user has questions: Answer specifically about this scheme
      3. If user is ready to apply: Offer to pre-fill the application form
      4. If user wants to submit: Guide them to the official portal or our submission system
      
      Always mention:
      - Use our Chrome Extension for auto-filling government forms
      - We can save their progress in the dashboard
      - They can approve applications before final submission
      
      Keep response helpful, specific, and action-oriented.`;

      const response = await this.generateContent(prompt, 'en');
      return response;
    } catch (error) {
      console.error('Failed to automate application process:', error);
      return 'I can help you with this application. Would you like me to guide you through the requirements and help fill out the form automatically?';
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const prompt = `Please translate the following text to ${targetLanguage}. Only return the translation, no explanations:

    ${text}`;

    return this.generateContent(prompt, targetLanguage);
  }

  async analyzeEligibility(userProfile: any, schemes: any[], language: string = 'en'): Promise<string> {
    const prompt = `Based on this user profile:
    - Age: ${userProfile.age}
    - Income: ${userProfile.income}
    - Education: ${userProfile.education}
    - Employment: ${userProfile.employment}
    - Family Size: ${userProfile.familySize}
    - Location: ${userProfile.location}
    - Country: ${userProfile.country}

    And these available schemes:
    ${schemes.map(scheme => `
    - ${scheme.title}: ${scheme.description}
      Eligibility: ${scheme.eligibility.join(', ')}
      Benefits: ${scheme.benefits.join(', ')}
    `).join('\n')}

    Please analyze which schemes this user is eligible for and provide personalized recommendations with reasons why they qualify.`;

    return this.generateContent(prompt, language);
  }
}

export const geminiService = new GeminiService();