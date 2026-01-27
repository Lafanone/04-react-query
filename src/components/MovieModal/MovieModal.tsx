import { useEffect} from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset'; 
      window.removeEventListener('keydown', handleKeyDown); 
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <button className={css.closeButton} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        {/* Використовуємо optional chaining (?), бо картинки може не бути */}
        <img
          src={
            movie.backdrop_path 
              ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
              : `https://image.tmdb.org/t/p/original/${movie.poster_path}`
          }
          alt={movie.title}
          className={css.image}
        />
        
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default MovieModal;