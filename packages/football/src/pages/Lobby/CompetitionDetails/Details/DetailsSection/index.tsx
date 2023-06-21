import { ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { theme } from '@sorare/core/src/style/theme';

type Props = {
  title: MessageDescriptor;
  children: ReactNode;
};

const Line = styled.header`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;
const Rules = styled.div`
  border-radius: ${theme.radius.md}px;
  margin: var(--double-unit) 0 var(--triple-unit) 0;
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  > * {
    padding: var(--double-unit) var(--triple-unit);
    background: var(--c-neutral-300);
    border-radius: var(--double-unit);
  }
`;

const DetailsSection = ({ title, children }: Props) => {
  return (
    <article>
      <Line>
        <Ball />
        <Title5>
          <FormattedMessage {...title} />
        </Title5>
      </Line>
      <Rules>{children}</Rules>
    </article>
  );
};

export default DetailsSection;
