export type Movie = {
  id: number
  title: string
  year: number
  posterUrl: string
  isFavorite: boolean
}

export type MovieCardProps = {
  movie: Movie
  onToggleFavorite: (id: number) => void
  view: 'grid' | 'list'
}

export type MovieListProps = {
  movies: Movie[]
  onToggleFavorite: (id: number) => void
  view: 'grid' | 'list'
}
