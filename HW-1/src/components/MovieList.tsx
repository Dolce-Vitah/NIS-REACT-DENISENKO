import React from 'react'
import { type MovieListProps } from '../types/types'
import MovieCard from './MovieCard'

const MovieList: React.FC<MovieListProps> = ({ movies, onToggleFavorite, view }) => (
  <div className={view === 'grid' ? 'movies-grid' : 'movies-list'}>
    {movies.map(m => (
      <MovieCard key={m.id} movie={m} onToggleFavorite={onToggleFavorite} view={view} />
    ))}
  </div>
)

export default React.memo(MovieList)
