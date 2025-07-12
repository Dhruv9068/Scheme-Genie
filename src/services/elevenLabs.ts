import { ELEVEN_LABS_API_KEY, ELEVEN_LABS_VOICE_ID } from '../utils/constants';

export class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;

  constructor() {
    this.apiKey = ELEVEN_LABS_API_KEY;
    this.voiceId = ELEVEN_LABS_VOICE_ID;
  }

  async generateSpeech(text: string, voiceId?: string): Promise<Blob> {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('ElevenLabs Error:', error);
      throw error;
    }
  }

  async playAudio(audioBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed'));
      audio.play().catch(reject);
    });
  }

  async speakText(text: string, voiceId?: string): Promise<void> {
    try {
      const audioBlob = await this.generateSpeech(text, voiceId);
      await this.playAudio(audioBlob);
    } catch (error) {
      console.error('Failed to speak text:', error);
      throw error; // Let the caller handle fallback
    }
  }

  stopSpeaking(): void {
    // Stop any currently playing audio
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

export const elevenLabsService = new ElevenLabsService();