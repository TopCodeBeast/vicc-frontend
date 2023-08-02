import { Component, FC } from 'react';

import { sendSafeError } from '@core/lib/error';

type Props = {
  onCatch: (e: Error) => void;
  children: FC<React.PropsWithChildren<{ error?: Error }>>;
};
class ErrorBoundary extends Component<Props, { error?: Error }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(e: Error) {
    const { onCatch } = this.props;
    onCatch(e);
    this.setState({ error: e });
    sendSafeError(e);
  }

  render() {
    const { children } = this.props;
    return children(this.state);
  }
}

export default ErrorBoundary;
