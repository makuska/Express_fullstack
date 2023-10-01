import {NavigateFunction, useNavigate, useRouteError} from 'react-router-dom';

function NotFoundPage() {
  const error: any = useRouteError();
  const navigate: NavigateFunction = useNavigate()

  function navigateToHomePage(): void {
    navigate('/')
  }

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>The resource you were searching for doesn't exist. Please check your URL!</p>
      {error && <p><i>{error.statusText || error.message}</i></p>}
      <p>Back to <span
        style={{ color: "blue", cursor: 'pointer', textDecoration: "underline"}}
        onClick={navigateToHomePage}
      >home?
      </span></p>
    </div>
  );
}

export default NotFoundPage;