import * as Tone from 'tone';
import { MusicalNote } from '@/types/stem-learning';

export class ToneManager {
  private synth: Tone.Synth;
  private isPlaying: boolean = false;

  constructor() {
    this.synth = new Tone.Synth().toDestination();
  }

  async playNote(note: string, duration: string) {
    await Tone.start();
    this.synth.triggerAttackRelease(note, duration);
  }

  async playPattern(notes: MusicalNote[]) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      await Tone.start();
      const now = Tone.now();
      
      notes.forEach((note, index) => {
        this.synth.triggerAttackRelease(
          note.note,
          note.duration,
          now + index * 0.5
        );
      });
    } catch (error) {
      console.error('Error playing pattern:', error);
    } finally {
      this.isPlaying = false;
    }
  }

  stop() {
    this.synth.triggerRelease();
    this.isPlaying = false;
  }
}