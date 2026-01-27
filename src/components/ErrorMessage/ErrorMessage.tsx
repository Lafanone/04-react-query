import css from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message?: string; 
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = "Something went wrong, please reload the page" }) => {
  return (
    <div className={css.error}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;