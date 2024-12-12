export interface MusicalNote {
    note: string;
    duration: string;
    lyrics: string;
  }
  
  export interface STEMPattern {
    pattern: MusicalNote[];
    tempo: number;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    examples: string[];
  }
  
  export interface Subject {
    name: string;
    topics: {
      [key: string]: STEMPattern;
    };
  }
  
  export interface LearningProgress {
    subject: string;
    topic: string;
    progress: number;
    completedExamples: string[];
  }