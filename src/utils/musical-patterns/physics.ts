import { STEMPattern } from '@/types/stem-learning';

export const physicsPatterns: Record<string, STEMPattern> = {
  mechanics: {
    pattern: [
      { note: 'C4', duration: '4n', lyrics: 'Force equals mass' },
      { note: 'E4', duration: '4n', lyrics: 'times acceleration' },
      { note: 'G4', duration: '4n', lyrics: "that's the key" },
      { note: 'C5', duration: '4n', lyrics: 'to F = ma!' }
    ],
    tempo: 120,
    complexity: 'intermediate',
    examples: [
      'Calculate force of a 2kg mass accelerating at 5 m/s²',
      'Find acceleration of a 10N force on 5kg mass',
      'Determine mass from 20N force causing 4 m/s² acceleration'
    ]
  },
  thermodynamics: {
    pattern: [
      { note: 'D4', duration: '4n', lyrics: 'Heat flows from' },
      { note: 'F4', duration: '4n', lyrics: 'hot to cold' },
      { note: 'A4', duration: '4n', lyrics: 'energy flows' },
      { note: 'D5', duration: '4n', lyrics: 'as systems unfold' }
    ],
    tempo: 110,
    complexity: 'advanced',
    examples: [
      'Calculate heat transfer between hot and cold water',
      'Find final temperature of mixed liquids',
      'Determine energy needed to heat water to steam'
    ]
  }
};