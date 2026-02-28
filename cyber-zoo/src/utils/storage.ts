import { type Pet } from '../data/pets';

const STORAGE_KEY_PREFIX = 'cyberzoo_pet_';

export const savePetState = (pet: Pet) => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${pet.id}`, JSON.stringify(pet));
  } catch (error) {
    console.error('Failed to save pet state', error);
  }
};

export const loadPetState = (petId: string): Pet | null => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${petId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load pet state', error);
    return null;
  }
};

export const clearPetState = (petId: string) => {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${petId}`);
};