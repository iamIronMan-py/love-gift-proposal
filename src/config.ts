export const GIFT = {
  recipient: '',
  signature: 'With all my love',
  origin: 'Dubai',
  destination: 'Paris',
  destinationCode: 'CDG',
  originCode: 'DXB',
  distance: '6,700 km',
} as const;

export type Stage = 'intro' | 'confirm' | 'journey' | 'bloom' | 'arrival' | 'unbox' | 'finale';

export const STAGES: Stage[] = ['intro', 'confirm', 'journey', 'bloom', 'arrival', 'unbox', 'finale'];
