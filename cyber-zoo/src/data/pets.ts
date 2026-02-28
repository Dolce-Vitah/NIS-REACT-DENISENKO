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
  avatar: string; 
  mood: 'happy' | 'neutral' | 'sad' | 'offline';
  energy: number;    
  happiness: number; 
  level: number;
}

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'K1-TTY',
    species: 'CyberCat',
    avatar: '/avatars/cybercat-1.jpeg',
    mood: 'neutral',
    energy: 80,
    happiness: 70,
    level: 1,
  },
  {
    id: '2',
    name: 'M1-NX',
    species: 'CyberCat',
    avatar: '/avatars/cybercat-2.jpeg',
    mood: 'happy',
    energy: 90,
    happiness: 85,
    level: 2,
  },
  {
    id: '3',
    name: 'D0G-Z',
    species: 'RoboDog',
    avatar: '/avatars/robodog-1.jpeg',
    mood: 'happy',
    energy: 95,
    happiness: 90,
    level: 3,
  },
  {
    id: '4',
    name: 'B4RK',
    species: 'RoboDog',
    avatar: '/avatars/robodog-2.jpeg',
    mood: 'neutral',
    energy: 60,
    happiness: 55,
    level: 1,
  },
  {
    id: '5',
    name: 'F3ATHER',
    species: 'MechaBird',
    avatar: '/avatars/mechabird-1.jpeg',
    mood: 'sad',
    energy: 40,
    happiness: 30,
    level: 5,
  },
  {
    id: '6',
    name: 'N4N0',
    species: 'NanoFox',
    avatar: '/avatars/nanofox-1.jpeg',
    mood: 'neutral',
    energy: 65,
    happiness: 50,
    level: 3,
  },
  {
    id: '7',
    name: 'Q-PANDA',
    species: 'QuantumPanda',
    avatar: '/avatars/quantumpanda-1.jpeg',
    mood: 'happy',
    energy: 90,
    happiness: 95,
    level: 4,
  },
  {
    id: '8',
    name: 'PUNKMINGO',
    species: 'MechaBird',
    avatar: '/avatars/mechabird-2.jpeg',
    mood: 'happy',
    energy: 80,
    happiness: 85,
    level: 3,
  },
];