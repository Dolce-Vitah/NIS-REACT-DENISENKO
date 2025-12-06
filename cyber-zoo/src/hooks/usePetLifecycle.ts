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
      dispatch({ type: 'DECAY_ENERGY', payload: 4 });

    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [state.mood, intervalSeconds, dispatch]);

  useEffect(() => {
    if (state.mood === 'offline') return;

    const happinessTimer = setInterval(() => {
      dispatch({ type: 'DECAY_HAPPINESS', payload: 5 });
    }, intervalSeconds * 1000 * 2);

    return () => clearInterval(happinessTimer);
  }, [state.mood, intervalSeconds, dispatch]);

  useEffect(() => {
    let nextMood: Pet['mood'] = state.mood;

    if (state.energy <= 0) {
      nextMood = 'offline';
    } else {
      const lowEnergy = state.energy < 25;
      const lowHappiness = state.happiness < 25;
      const highEnergy = state.energy > 70;
      const highHappiness = state.happiness > 70;

      if (lowEnergy || lowHappiness) {
        nextMood = 'sad';
      } else if (highEnergy && highHappiness) {
        nextMood = 'happy';
      } else {
        nextMood = 'neutral';
      }
    }

    if (nextMood !== state.mood) {
      dispatch({ type: 'SET_MOOD', payload: nextMood });
    }
  }, [state.energy, state.happiness, state.mood, dispatch]);
};