export interface Pet {
  id: string;
  name: string;
  species: 'CyberCat' | 'RoboDog' | 'MechaBird';
  mood: 'happy' | 'neutral' | 'sad' | 'offline';
  energy: number; // 0-100
  level: number;
  avatar: string; // URL
}

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'K1-TTY',
    species: 'CyberCat',
    mood: 'neutral',
    energy: 80,
    level: 1,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=K1-TTY',
  },
  {
    id: '2',
    name: 'D0G-Z',
    species: 'RoboDog',
    mood: 'happy',
    energy: 95,
    level: 2,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=D0G-Z',
  },
  {
    id: '3',
    name: 'F3ATHER',
    species: 'MechaBird',
    mood: 'sad',
    energy: 40,
    level: 5,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=F3ATHER',
  },
];