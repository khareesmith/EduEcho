import { ToneManager } from './toneManager';
import { STEMPattern } from '@/types/stem-learning';

export class PatternPlayer {
  private toneManager: ToneManager;
  private currentPattern: STEMPattern | null = null;

  constructor() {
    this.toneManager = new ToneManager();
  }

  async playPattern(pattern: STEMPattern) {
    this.currentPattern = pattern;
    await this.toneManager.playPattern(pattern.pattern);
  }

  stop() {
    this.toneManager.stop();
    this.currentPattern = null;
  }

  isPlaying() {
    return this.currentPattern !== null;
  }
}