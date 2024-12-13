interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    SpeechSynthesis: any;
    SpeechSynthesisUtterance: any;
  }
  
  interface SpeechRecognitionEvent {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
          confidence: number;
        };
      };
      length: number;
    };
    resultIndex: number;
  }