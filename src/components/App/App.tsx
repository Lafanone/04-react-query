import { useState, useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
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

  const handlePageClick = ({ selected }: { selected: number }) => {
    setPage(selected + 1)
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.container}> 
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      
      {isError && <ErrorMessage message={(error as Error).message} />}

      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          
          {totalPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="→"
              previousLabel="←"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              pageCount={totalPages}
              forcePage={page - 1} 
              containerClassName={css.pagination}
              activeClassName={css.active}
              disabledClassName={css.disabled} 
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
