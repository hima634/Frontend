// pages/ErrorPage.jsx
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>

      <p className="text-gray-600 mb-2">
        Sorry, an unexpected error has occurred.
      </p>

      <p className="text-red-500 mb-6">
        {error?.statusText || error?.message}
      </p>

      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
