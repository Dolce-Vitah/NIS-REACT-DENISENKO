import type { Pet, Species } from '../data/pets';

const AVATAR_COUNTS: Record<Species, number> = {
  CyberCat: 2,
  RoboDog: 2,
  MechaBird: 2,
  NanoFox: 1,
  QuantumPanda: 1,
};

const getIndexFromId = (id: string, max: number): number => {
  const numeric = Number(id);
  if (!Number.isFinite(numeric) || max <= 0) return 1;
  return (numeric % max) + 1;
};

export const getAvatarForPet = (pet: Pet): string => {
  const count = AVATAR_COUNTS[pet.species];
  const index = getIndexFromId(pet.id, count || 1);

  switch (pet.species) {
    case 'CyberCat':
      return `/avatars/cybercat-${index}.jpeg`;
    case 'RoboDog':
      return `/avatars/robodog-${index}.jpeg`;
    case 'MechaBird':
      return `/avatars/mechabird-${index}.jpeg`;
    case 'NanoFox':
      return `/avatars/nanofox-${index}.jpeg`;
    case 'QuantumPanda':
      return `/avatars/quantumpanda-${index}.jpeg`;
    default:
      return `/avatars/default-1.jpg`;
  }
};