import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import { useIntlContext } from '@core/contexts/intl';

const messages = defineMessages<string>({
  invalid: {
    id: 'Error.invalid',
    defaultMessage: 'Invalid input',
  },
});

interface Props {
  error?: keyof typeof messages | null | string;
  code?: boolean;
}

const StyledError = styled.span`
  color: var(--c-red-600);
`;

export const Error = ({ error, code }: Props) => {
  const { formatMessage } = useIntlContext();

  return error ? (
    <StyledError>
      {code && error in messages ? formatMessage(messages[error]) : error}
    </StyledError>
  ) : null;
};

export default Error;
