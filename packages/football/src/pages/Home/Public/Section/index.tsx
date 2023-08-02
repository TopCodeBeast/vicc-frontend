import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { Text20, Title3 } from '@sorare/core/src/atoms/typography';

const Header = styled.header`
  margin-bottom: var(--double-unit);
`;

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
};
const Section: FC<React.PropsWithChildren<Props>> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Container as="section">
      <Header>
        <Title3>{title}</Title3>
        <Text20 color="var(--c-neutral-600)">{subtitle}</Text20>
      </Header>
      {children}
    </Container>
  );
};

export default Section;
