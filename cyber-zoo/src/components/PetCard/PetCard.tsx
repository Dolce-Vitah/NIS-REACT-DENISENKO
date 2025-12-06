import React, {
  useReducer,
  useCallback,
  useRef,
  memo,
  useEffect,
  useState,
} from 'react';
import { type Pet } from '../../data/pets';
import { usePetLifecycle } from '../../hooks/usePetLifecycle';
import { useEventLog } from '../../hooks/useEventLog';
import { ActionButton } from '../PetActions/ActionButton.styled';
import styles from './PetCard.module.scss';
import { type PetAction } from './types';
import { savePetState, loadPetState, clearPetState } from '../../utils/storage';

const petReducer: React.Reducer<Pet, PetAction> = (state, action) => {
  switch (action.type) {
    case 'FEED':
      return {
        ...state,
        energy: Math.min(state.energy + 30, 100),
        happiness: Math.min(state.happiness + 10, 100),
      };
    case 'LEVEL_UP':
      return { ...state, level: state.level + 1 };
    case 'CHEER':
      return {
        ...state,
        happiness: Math.min(state.happiness + 25, 100),
      };
    case 'DECAY_ENERGY':
      return {
        ...state,
        energy: Math.max(state.energy - action.payload, 0),
      };
    case 'DECAY_HAPPINESS':
      return {
        ...state,
        happiness: Math.max(state.happiness - action.payload, 0),
      };
    case 'SET_MOOD':
      return { ...state, mood: action.payload };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

interface PetCardProps {
  initialData: Pet;
}

const initPetState = (initialData: Pet): Pet => {
  const saved = loadPetState(initialData.id);
  if (saved) {
    return saved;
  }
  return initialData;
};

const PetCard: React.FC<PetCardProps> = ({ initialData }) => {
  const [state, dispatch] = useReducer(petReducer, initialData, initPetState);
  const { addLog } = useEventLog();

  const avatarRef = useRef<HTMLImageElement | null>(null);
  const prevMoodRef = useRef<Pet['mood']>(initialData.mood);

  const [cheerAnimating, setCheerAnimating] = useState(false);

  usePetLifecycle(state, dispatch);

  useEffect(() => {
    savePetState(state);
  }, [state]);

  useEffect(() => {
    if (!avatarRef.current) return;

    if (state.energy > 0 && state.energy < 30) {
      avatarRef.current.style.animation = 'shake 0.5s infinite';
    } else {
      avatarRef.current.style.animation = 'none';
    }
  }, [state.energy]);

  useEffect(() => {
    if (!prevMoodRef.current) {
      prevMoodRef.current = state.mood;
      return;
    }

    if (prevMoodRef.current !== state.mood) {
      const isBad = state.mood === 'offline' || state.mood === 'sad';

      const fromMood = prevMoodRef.current.toUpperCase();
      const toMood = state.mood.toUpperCase();

      addLog(`Mood changed: ${fromMood} → ${toMood}`, isBad ? 'alert' : 'info');

      prevMoodRef.current = state.mood;
    }
  }, [state.mood, addLog]);

  const handleFeed = useCallback(() => {
    if (state.energy === 0) return;
    dispatch({ type: 'FEED' });
    addLog(
      `🍏 Fed ${state.name}: +30 energy, +10 happiness`,
      'success'
    );
  }, [state.name, state.energy, addLog]);

  const handleLevelUp = useCallback(() => {
    if (state.energy === 0) return;
    dispatch({ type: 'LEVEL_UP' });
    addLog(
      `⚡ Leveled up ${state.name} to Lvl ${state.level + 1}`,
      'info'
    );
  }, [state.name, state.level, state.energy, addLog]);

  const handleCheer = useCallback(() => {
    if (state.energy === 0) return;
    dispatch({ type: 'CHEER' });
    addLog(
      `💖 Cheered ${state.name}: +25 happiness`,
      'success'
    );

    setCheerAnimating(true);
    const timeoutId = window.setTimeout(() => {
      setCheerAnimating(false);
    }, 700); 

    return () => window.clearTimeout(timeoutId);
  }, [state.name, state.energy, addLog]);

  const handleReset = useCallback(() => {
    clearPetState(initialData.id);
    dispatch({ type: 'RESET', payload: initialData });
    addLog(`🔄 Reset ${state.name}`, 'alert');
  }, [initialData, state.name, addLog]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return '#52c41a';
      case 'sad':
        return '#1890ff';
      case 'offline':
        return '#555555';
      default:
        return '#faad14';
    }
  };

  const moodColor = getMoodColor(state.mood);
  const isOffline = state.mood === 'offline';
  const isGlitched = state.energy > 0 && state.energy < 20;

  return (
    <div
      className={`${styles.card} ${cheerAnimating ? styles.cheerActive : ''}`}
      style={{
        borderColor: moodColor,
        boxShadow: isOffline ? 'none' : `0 0 15px ${moodColor}66`,
      }}
    >
      <div className={`${styles.avatarWrapper} ${isGlitched ? styles.glitchedAvatar : ''}`}>
        <img
          ref={avatarRef}
          src={state.avatar}
          alt={state.name}
          className={styles.avatar}
          style={{
            filter: isOffline ? 'grayscale(100%)' : 'none',
            borderColor: moodColor,
          }}
        />
        <div
          className={`${styles.heartsOverlay} ${
            cheerAnimating ? styles.heartsOverlayActive : ''
          }`}
        >
          💖
        </div>
      </div>

      <h3>
        {state.name}{' '}
        <span className={styles.species}>[{state.species}]</span>
      </h3>

      <div className={styles.stats}>
        <div style={{ color: moodColor }}>
          <span>STATUS:</span>
          <span>{state.mood.toUpperCase()}</span>
        </div>
        <div>
          <span>LEVEL:</span>
          <span>{state.level}</span>
        </div>
      </div>

      <div style={{ width: '100%', marginTop: '8px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            marginBottom: '4px',
            color: '#cccccc',
          }}
        >
          <span>ENERGY</span>
          <span>{state.energy}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#333333',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${state.energy}%`,
              height: '100%',
              backgroundColor: moodColor,
              transition: 'width 0.4s ease, background-color 0.4s ease',
            }}
          />
        </div>
      </div>

      <div style={{ width: '100%', marginTop: '8px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            marginBottom: '4px',
            color: '#cccccc',
          }}
        >
          <span>HAPPINESS</span>
          <span>{state.happiness}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#333333',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${state.happiness}%`,
              height: '100%',
              backgroundColor: '#ff85c0', 
              transition: 'width 0.4s ease, background-color 0.4s ease',
            }}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <ActionButton onClick={handleFeed} disabled={isOffline}>
          Feed
        </ActionButton>
        <ActionButton onClick={handleCheer} disabled={isOffline}>
          Cheer
        </ActionButton>
        <ActionButton onClick={handleLevelUp} disabled={isOffline}>
          Lvl Up
        </ActionButton>
        <ActionButton $variant="danger" onClick={handleReset}>
          Reset
        </ActionButton>
      </div>
    </div>
  );
};

export default memo(PetCard);