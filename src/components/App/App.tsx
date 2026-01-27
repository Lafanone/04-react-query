import { useState, useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid'; // Використовуємо Grid, як у імпорті
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal'; 
import css from './App.module.css';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData, 
  });

  useEffect(() => {
    if (isError) {
      toast.error('Something went wrong with the search.');
    }
  }, [isError]);

  useEffect(() => {
    if (data && data.results.length === 0 && query) {
      toast.error('No movies found for your request.');
    }
  }, [data, query]);

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleNextPage = () => {
    if (!isPlaceholderData && data && page < data.total_pages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };
  const movies = data?.results || [];

  return (
    <div className={css.container}> 
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage message={(error as Error).message} />}
      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          
          <div className={css.pagination}>
            <button 
              onClick={handlePrevPage} 
              disabled={page === 1}
              className={css.btn}
            >
              Previous
            </button>
            <span className={css.pageInfo}>Page {page} of {data?.total_pages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={isPlaceholderData || (data && page === data.total_pages)}
              className={css.btn}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;

