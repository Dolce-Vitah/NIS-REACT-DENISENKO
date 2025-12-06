import { useEffect } from 'react';
import { type Pet } from '../data/pets';
import { type PetAction } from '../components/PetCard/types';

export const usePetLifecycle = (
  state: Pet,
  dispatch: React.Dispatch<PetAction>,
  intervalSeconds: number = 5
) => {
  useEffect(() => {
    if (state.mood === 'offline') return;

    const timer = setInterval(() => {
      dispatch({ type: 'DECAY_ENERGY', payload: 5 });
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [state.mood, intervalSeconds, dispatch]);

  useEffect(() => {
    if (state.energy <= 0 && state.mood !== 'offline') {
      dispatch({ type: 'SET_MOOD', payload: 'offline' });
    }
    else if (state.energy > 0 && state.energy <= 20 && state.mood !== 'sad') {
      dispatch({ type: 'SET_MOOD', payload: 'sad' });
    }
    else if (state.energy > 20 && state.energy <= 60 && state.mood !== 'neutral') {
      dispatch({ type: 'SET_MOOD', payload: 'neutral' });
    }
    else if (state.energy > 60 && state.mood !== 'happy') {
      dispatch({ type: 'SET_MOOD', payload: 'happy' });
    }
  }, [state.energy, state.mood, dispatch]);
};