import { STEMPattern } from '@/types/stem-learning';

export const chemistryPatterns: Record<string, STEMPattern> = {
  periodic: {
    pattern: [
      { note: 'A4', duration: '4n', lyrics: 'Elements grouped' },
      { note: 'C5', duration: '4n', lyrics: 'by their traits' },
      { note: 'E5', duration: '4n', lyrics: 'periodic' },
      { note: 'A5', duration: '4n', lyrics: 'trends relate' }
    ],
    tempo: 90,
    complexity: 'intermediate',
    examples: [
      'Identify electron configuration',
      'Predict atomic radius trends',
      'Compare element properties'
    ]
  },
  bonding: {
    pattern: [
      { note: 'E4', duration: '4n', lyrics: 'Share electrons' },
      { note: 'G4', duration: '4n', lyrics: 'or transfer charge' },
      { note: 'B4', duration: '4n', lyrics: 'ionic and' },
      { note: 'E5', duration: '4n', lyrics: 'covalent bonds!' }
    ],
    tempo: 100,
    complexity: 'intermediate',
    examples: [
      'Draw Lewis structure for H2O',
      'Predict bond type in NaCl',
      'Calculate electronegativity difference'
    ]
  }
};