import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled, { css } from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { theme } from '@sorare/core/src/style/theme';

type Variant = 'red' | 'blue' | 'yellow' | 'grey';

const backgroundColors = {
  red: 'rgba(var(--c-rgb-red-600), 0.25)',
  blue: 'rgba(var(--c-rgb-brand-600), 0.25)',
  yellow: 'rgba(var(--c-rgb-yellow-600), 0.25)',
  grey: 'var(--c-neutral-200)',
};

const titleColors = {
  red: 'var(--c-red-600)',
  blue: 'var(--c-brand-600)',
  yellow: 'var(--c-yellow-600)',
  grey: 'var(--c-neutral-600)',
};

const Root = styled.div`
  padding: var(--double-unit) var(--triple-unit);
  display: flex;
  gap: var(--unit);
  flex-direction: column;
  justify-content: center;
  border-radius: ${theme.shape.borderRadius}px;
  width: 100%;
`;
const Title = styled(Text16)<{ variant: Variant }>`
  font-weight: var(--t-bold);

  color: ${({ variant }) => titleColors[variant]};
`;
const Message = styled(Text16)<{ variant: Variant }>`
  ${({ variant }) =>
    variant === 'yellow' &&
    css`
      color: var(--c-neutral-800);
    `}
`;

type Props = {
  title?: MessageDescriptor;
  message?: MessageDescriptor;
  values?: Record<string, React.ReactNode>;
  children?: React.ReactNode;
  variant?: Variant;
};

export const Warning = (props: Props) => {
  const {
    message,
    title,
    values = undefined,
    children,
    variant = 'red',
  } = props;

  return (
    <Root style={{ backgroundColor: backgroundColors[variant] }}>
      {title && (
        <Title variant={variant}>
          <FormattedMessage {...title} />
        </Title>
      )}
      {message && (
        <Message variant={variant}>
          <FormattedMessage {...message} values={values} />
        </Message>
      )}
      {children}
    </Root>
  );
};

export default Warning;
