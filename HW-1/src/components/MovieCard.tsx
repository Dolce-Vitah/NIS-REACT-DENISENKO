import React from 'react';
import { type MovieCardProps } from '../types/types';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleFavorite, view }) => {
  return (
    <article className={`card ${view}`} tabIndex={0}>
      <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
        <div className="info">
            <h3>{movie.title} ({movie.year})</h3>
        </div>
        <button 
          className={`star-btn ${movie.isFavorite ? 'active' : ''}`} 
          onClick={() => onToggleFavorite(movie.id)}
          title={movie.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          {movie.isFavorite ? <AiFillStar /> : <AiOutlineStar />}
        </button>
    </article>
  );
};

export default React.memo(MovieCard);
