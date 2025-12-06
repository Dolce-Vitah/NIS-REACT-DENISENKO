import { type Pet } from '../../data/pets';

export type PetAction =
  | { type: 'FEED' }
  | { type: 'LEVEL_UP' }
  | { type: 'CHEER' }
  | { type: 'RESET'; payload: Pet }
  | { type: 'DECAY_ENERGY'; payload: number }
  | { type: 'DECAY_HAPPINESS'; payload: number }
  | { type: 'SET_MOOD'; payload: Pet['mood'] };