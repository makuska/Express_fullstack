import { useRouteError } from 'react-router-dom';

function NotFoundPage() {
  const error = useRouteError();

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>The resource you were searching for doesn't exist. Please check your URL!</p>
      {/*@ts-ignore*/}
      {error && <p><i>{error.statusText || error.message}</i></p>}
    </div>
  );
}

export default NotFoundPage;