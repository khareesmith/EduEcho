export interface Subject {
  name: string;
  topics: string[];
}

export interface LearningProgress {
  subject: string;
  topic: string;
  progress: number;
}
