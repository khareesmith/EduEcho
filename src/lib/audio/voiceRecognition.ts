export class VoiceRecognition {
    private recognition: any;
    private isListening: boolean = false;
  
    constructor() {
      if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  
    start(onResult: (transcript: string) => void) {
      if (!this.recognition) {
        throw new Error('Speech recognition not supported');
      }
  
      if (this.isListening) return;
  
      this.isListening = true;
      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        onResult(transcript);
      };
  
      this.recognition.start();
    }
  
    stop() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  }