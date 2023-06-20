/* eslint-disable max-classes-per-file */
import React from 'react';

import { sendSafeError } from '@sorare/core/src/lib/error';

type Props = {
  action?: string;
  children: React.ReactNode;
  fallback?: (error: Error) => any;
  tags?: { [key: string]: string };
};

type State = {
  error?: Error;
};

export class SilencedError extends Error {
  error: Error;

  constructor(message: string, error: Error) {
    super(message);
    this.error = error;
  }
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error): void {
    if (!(error instanceof SilencedError)) {
      sendSafeError(error);
    }
    const { error: previousError } = this.state;
    // fall back if getDerivedStateFromError wasn't called before
    // componentDidCatch. fixes support for react 16 - 16.6.
    if (!previousError) this.setState({ error });
  }

  public render(): React.ReactNode {
    const { error } = this.state;
    const { fallback, children } = this.props;
    if (error) {
      return fallback ? fallback(error) : null;
    }

    return children;
  }
}

export default ErrorBoundary;
