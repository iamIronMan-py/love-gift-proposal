export const GIFT = {
  recipient: '',
  signature: 'With all my love',
  origin: 'Dubai',
  destination: 'Canada',
  destinationCode: 'YYZ',
  originCode: 'DXB',
  distance: '11,000 km',
} as const;

export type Stage = 'intro' | 'confirm' | 'journey' | 'bloom' | 'arrival' | 'unbox' | 'finale';

export const STAGES: Stage[] = ['intro', 'confirm', 'journey', 'bloom', 'arrival', 'unbox', 'finale'];
