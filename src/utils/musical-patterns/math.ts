import { STEMPattern } from '@/types/stem-learning';

export const mathPatterns: Record<string, STEMPattern> = {
  algebra: {
    pattern: [
      { note: 'F4', duration: '4n', lyrics: 'Solve for x' },
      { note: 'A4', duration: '4n', lyrics: 'step by step' },
      { note: 'C5', duration: '4n', lyrics: 'keep balanced' },
      { note: 'F5', duration: '4n', lyrics: 'find x next' }
    ],
    tempo: 100,
    complexity: 'intermediate',
    examples: [
      'Solve: 2x + 5 = 15',
      'Solve: 3(x - 2) = 18',
      'Solve: x²/4 + 2 = 6'
    ]
  },
  calculus: {
    pattern: [
      { note: 'G4', duration: '4n', lyrics: 'Rate of change' },
      { note: 'B4', duration: '4n', lyrics: 'derivative shows' },
      { note: 'D5', duration: '4n', lyrics: 'slopes and tangents' },
      { note: 'G5', duration: '4n', lyrics: 'as function flows' }
    ],
    tempo: 95,
    complexity: 'advanced',
    examples: [
      'Find derivative of x² + 3x',
      'Calculate slope at x = 2',
      'Find maximum point'
    ]
  }
};