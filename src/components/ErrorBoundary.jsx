import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  useEffect(() => {
    const componentDidCatch = (error, errorInfo) => {
      setErrorState({
        hasError: true,
        error: error,
        errorInfo: errorInfo,
      });
    };

    const cleanup = () =>
      setErrorState({ hasError: false, error: null, errorInfo: null });

    window.addEventListener("unhandledrejection", componentDidCatch);
    return () => {
      window.removeEventListener("unhandledrejection", componentDidCatch);
      cleanup();
    };
  }, []);

  if (errorState.hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>{errorState.error && errorState.error.toString()}</p>
        <p>Component Stack Error Details:</p>
        <pre>{errorState.errorInfo && errorState.errorInfo.componentStack}</pre>
      </div>
    );
  }

  return children;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
