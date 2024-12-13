export class SpeechService {
    private synthesis: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    private selectedVoice: SpeechSynthesisVoice | null = null;
  
    constructor() {
      if (typeof window !== 'undefined') {
        this.synthesis = window.speechSynthesis;
        this.loadVoices();
      }
    }
  
    private loadVoices() {
      const loadVoicesCallback = () => {
        if (this.synthesis) {
          this.voices = this.synthesis.getVoices();
          this.selectedVoice = this.voices.find(
            voice => voice.lang.includes('en') && voice.name.includes('Female')
          ) || this.voices[0];
        }
      };
  
      if (this.synthesis?.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = loadVoicesCallback;
      }
      loadVoicesCallback();
    }
  
    async speak(text: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!this.synthesis) {
          reject(new Error('Speech synthesis not available'));
          return;
        }
  
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }
  
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
  
        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);
  
        this.synthesis.speak(utterance);
      });
    }
  
    stop() {
      if (this.synthesis) {
        this.synthesis.cancel();
      }
    }
  }