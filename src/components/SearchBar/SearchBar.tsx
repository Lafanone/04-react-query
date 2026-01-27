import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
    onSubmit: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
    const handleAction = (formData: FormData) => {
    const query = formData.get('query') as string;

    if (!query || query.trim() === '') {
      toast.error('Please enter a search term.');
      return;
    }

    onSubmit(query.trim());
  };

  return (
    <header className={css.header}>
      <form action={handleAction} className={css.form}>
        <input
          name="query"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search movies..."
          className={css.input}
        />
        <button type="submit" className={css.button}>
          Search
        </button>
      </form>
    </header>
  );
};

export default SearchBar;