import React, { useRef, useState, useEffect } from 'react';
import { type Movie } from './types/types';
import { initialMovies } from './data/movies';
import MovieList from './components/MovieList';
import { FaThLarge, FaList } from 'react-icons/fa';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('movies');
    if (!saved) return initialMovies;

    const savedMovies: Movie[] = JSON.parse(saved);

    return initialMovies.map(m => {
      const found = savedMovies.find(s => s.id === m.id);
      return found ? { ...m, isFavorite: found.isFavorite } : m;
    });
  });

  const [filter, setFilter] = useState<'all' | 'favorites'>(() => {
    const saved = localStorage.getItem('filter');
    return saved === 'favorites' ? 'favorites' : 'all';
  });

  const [view, setView] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('view');
    return saved === 'list' ? 'list' : 'grid';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return localStorage.getItem('search') || '';
  });

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('filter', filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem('view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('search', searchQuery);
  }, [searchQuery]);

  const toggleFavorite = (id: number) => {
    setMovies(prev =>
      prev.map(m => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  const handleSearch = () => {
    setSearchQuery(searchRef.current?.value || '');
  };

  const filtered = movies.filter(m => {
    if (filter === 'favorites' && !m.isFavorite) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="app">
      <header>
        <h1>Фильмы</h1>
      </header>

      <section className="controls">
          <div className="filter-group">
            <button
              className={`btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button
              className={`btn ${filter === 'favorites' ? 'active' : ''}`}
              onClick={() => setFilter('favorites')}
            >
              Избранные
            </button>
          </div>

          <input
            ref={searchRef}
            value={searchQuery}
            placeholder="Поиск по названию"
            onChange={handleSearch}
            list="movies-list"
          />

          <datalist id="movies-list">
            {movies.map((m) => (
              <option key={m.id} value={m.title} />
            ))}
          </datalist>

          <div className="view-toggle">
            <button
              className={`btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <FaThLarge />
            </button>
            <button
              className={`btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <FaList />
            </button>
          </div>
      </section>

      {filtered.length === 0 ? (
        <p className="empty">Фильмов нет.</p>
      ) : (
        <MovieList movies={filtered} onToggleFavorite={toggleFavorite} view={view} />
      )}
    </main>
  );
};

export default App;
