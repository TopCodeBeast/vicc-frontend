import { Component, FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { LANDING } from '@core/constants/routes';
import { wrapError } from '@core/lib/error';
import { ErrorProps, HandledError } from '@core/routing/HandledError';

type Props = {
  children: ReactNode;
  messages?: { [key: string | number]: string };
  Error?: FC<React.PropsWithChildren<ErrorProps>>;
};
const handleKnownError = (code: number | string, message?: string) => {
  return {
    handleError: true,
    error: { code, message },
  };
};

class HandledErrorBoundary extends Component<
  Props,
  {
    handleError: boolean;
    error?: { code: number | string; message: string };
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      handleError: false,
    };
  }

  static getDerivedStateFromError(error?: any) {
    if (!error) return '';

    if (error.statusCode === 401) {
      return handleKnownError(error.statusCode, 'Unauthorized.');
    }
    if (error.statusCode === 404) {
      return handleKnownError(error.statusCode, 'Page not found.');
    }
    if (error.statusCode === 429) {
      return handleKnownError(
        error.statusCode,
        'Too many requests, try again later.'
      );
    }
    // The maintenance page will appear on 503 if the error isn't caught, see sentry/Provider.tsx
    if (error.statusCode && error.statusCode !== 503) {
      return handleKnownError(
        error.statusCode,
        `Something went wrong! (${error.statusCode})`
      );
    }
    if (error.networkError) {
      if (error.networkError.message === 'Failed to fetch') {
        if (process.env.NODE_ENV === 'development') {
          return handleKnownError(
            'OOPS',
            `Couldn't connect to the Vicc API: ${error.message}.`
          );
        }
        return handleKnownError('OOPS', 'Lost internet connection.');
      }
      if (error.networkError instanceof TypeError) {
        // this happens when the API send invalid JSON
        // TypeError: Failed to execute 'text' on 'Response': body stream already read.
        if (process.env.NODE_ENV === 'development') {
          return handleKnownError(
            'OOPS',
            error.message || error.networkError.message
          );
        }
        return handleKnownError('OOPS', 'Internal server error.');
      }
      return handleKnownError(
        'OOPS',
        `Unexpected error: ${error.networkError}.`
      );
    }
    throw wrapError(error);
  }

  render() {
    const { children, messages, Error } = this.props;
    const { handleError, error } = this.state;

    if (handleError && error) {
      if (error.code === 401) {
        return (
          <Navigate
            replace
            to={{
              pathname: LANDING,
            }}
          />
        );
      }

      const substituteError = messages?.[error.code] || error.message || '';

      return Error ? (
        <Error code={error.code} message={substituteError} />
      ) : (
        <HandledError code={error.code} message={substituteError} />
      );
    }

    return children;
  }
}

export default HandledErrorBoundary;
