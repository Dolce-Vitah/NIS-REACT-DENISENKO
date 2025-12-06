export type Species =
  | 'CyberCat'
  | 'RoboDog'
  | 'MechaBird'
  | 'NanoFox'
  | 'QuantumPanda';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  mood: 'happy' | 'neutral' | 'sad' | 'offline';
  energy: number; // 0-100
  level: number;
}

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'K1-TTY',
    species: 'CyberCat',
    mood: 'neutral',
    energy: 80,
    level: 1,
  },
  {
    id: '2',
    name: 'D0G-Z',
    species: 'RoboDog',
    mood: 'happy',
    energy: 95,
    level: 2,
  },
  {
    id: '3',
    name: 'F3ATHER',
    species: 'MechaBird',
    mood: 'sad',
    energy: 40,
    level: 5,
  },
  {
    id: '4',
    name: 'N4N0',
    species: 'NanoFox',
    mood: 'neutral',
    energy: 65,
    level: 3,
  },
  {
    id: '5',
    name: 'Q-PANDA',
    species: 'QuantumPanda',
    mood: 'happy',
    energy: 90,
    level: 4,
  },
];