import React, { useReducer, useCallback, useRef, memo, useEffect } from 'react';
import { type Pet } from '../../data/pets';
import { usePetLifecycle } from '../../hooks/usePetLifecycle';
import { useEventLog } from '../../hooks/useEventLog';
import { ActionButton } from '../PetActions/ActionButton.styled';
import styles from './PetCard.module.scss';
import { type PetAction } from './types';

const petReducer: React.Reducer<Pet, PetAction> = (state, action) => {
  switch (action.type) {
    case 'FEED':
      return { ...state, energy: Math.min(state.energy + 30, 100) };
    case 'LEVEL_UP':
      return { ...state, level: state.level + 1 };
    case 'CHEER':
      return { ...state, mood: 'happy' };
    case 'DECAY_ENERGY':
      return { ...state, energy: Math.max(state.energy - action.payload, 0) };
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

const PetCard: React.FC<PetCardProps> = ({ initialData }) => {
  const [state, dispatch] = useReducer(petReducer, initialData);
  const { addLog } = useEventLog();
  
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const prevMood = useRef(state.mood);

  usePetLifecycle(state, dispatch);

  useEffect(() => {
    if (state.energy > 0 && state.energy < 30 && avatarRef.current) {
      avatarRef.current.style.animation = `${styles.shake} 0.5s infinite`;
    } else if (avatarRef.current) {
      avatarRef.current.style.animation = 'none';
    }
  }, [state.energy]);

  useEffect(() => {
    if (prevMood.current !== state.mood) {
      const type = state.mood === 'offline' || state.mood === 'sad' ? 'alert' : 'info';
      addLog(`Mood changed: ${prevMood.current} -> ${state.mood}`, type);
      prevMood.current = state.mood;
    }
  }, [state.mood, addLog]);

  const handleFeed = useCallback(() => {
    if (state.energy === 0) return;
    dispatch({ type: 'FEED' });
    addLog(`🍏 Fed ${state.name}`, 'success');
  }, [state.name, state.energy, addLog]);

  const handleLevelUp = useCallback(() => {
    if (state.energy === 0) return;
    dispatch({ type: 'LEVEL_UP' });
    addLog(`⚡ Leveled up ${state.name}`, 'info');
  }, [state.name, state.energy, addLog]);

  const handleCheer = useCallback(() => {
    if (state.energy === 0) return;
    dispatch({ type: 'CHEER' });
    addLog(`💖 Cheered ${state.name}`, 'success');
  }, [state.name, state.energy, addLog]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET', payload: initialData });
    addLog(`🔄 Reset ${state.name}`, 'alert');
  }, [initialData, state.name, addLog]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return '#52c41a';
      case 'sad': return '#1890ff';
      case 'offline': return '#555';
      default: return '#faad14';
    }
  };

  const color = getMoodColor(state.mood);
  const isOffline = state.mood === 'offline';

  return (
    <div 
      className={styles.card} 
      style={{ boxShadow: `0 0 15px ${isOffline ? 'transparent' : color}40`, borderColor: color }}
    >
      <div className={styles.avatarWrapper}>
        <img 
          ref={avatarRef}
          src={state.avatar} 
          alt={state.name} 
          style={{ filter: isOffline ? 'grayscale(100%)' : 'none', borderColor: color }}
        />
      </div>
      
      <h3>{state.name} <span className={styles.species}>[{state.species}]</span></h3>
      
      <div className={styles.stats}>
        <div style={{ color: color }}>STATUS: {state.mood.toUpperCase()}</div>
        <div>LEVEL: {state.level}</div>
        
        {/* Inline Style Health Bar Requirement */}
        <div style={{ marginTop: '10px', width: '100%', background: '#333', height: '8px', borderRadius: '4px' }}>
            <div style={{
                width: `${state.energy}%`,
                height: '100%',
                backgroundColor: color,
                transition: 'width 0.5s ease, background-color 0.5s ease',
                borderRadius: '4px'
            }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.8em', marginTop: '4px' }}>{state.energy}% Energy</div>
      </div>

      <div className={styles.actions}>
        <ActionButton onClick={handleFeed} disabled={isOffline}>Feed</ActionButton>
        <ActionButton onClick={handleCheer} disabled={isOffline}>Cheer</ActionButton>
        <ActionButton onClick={handleLevelUp} disabled={isOffline}>Lvl Up</ActionButton>
        <ActionButton $variant="danger" onClick={handleReset}>Reset</ActionButton>
      </div>
    </div>
  );
};

export default memo(PetCard);