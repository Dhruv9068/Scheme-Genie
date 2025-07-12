export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isCurrentlyListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  async startListening(language: string = 'en-US'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isCurrentlyListening) {
        this.recognition.stop();
        this.isCurrentlyListening = false;
      }

      this.recognition.lang = language;
      this.isCurrentlyListening = true;
      
      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        this.isCurrentlyListening = false;
        resolve(result);
      };

      this.recognition.onerror = (event) => {
        this.isCurrentlyListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isCurrentlyListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition && this.isCurrentlyListening) {
      this.recognition.stop();
      this.isCurrentlyListening = false;
    }
  }

  speak(text: string, language: string = 'en-US'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }
}

export const speechService = new SpeechService();