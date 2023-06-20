import { ServerError } from '@apollo/client';

import { HandledError } from '../HandledError';

interface Props {
  error: Error;
}

// We don't use MaterialUI, react-intl or any other imports to reduce the chances of failing
export const FallbackComponent = ({ error }: Props) => {
  const code = 500;
  let msg = `Unexpected ${error.toString()}`;

  if (
    error.name === 'ServerError' &&
    (error as ServerError).statusCode === 503
  ) {
    msg = 'Maintenance operation in progress. Please retry later.';
  }
  return <HandledError code={code} message={msg} />;
};

export default FallbackComponent;
