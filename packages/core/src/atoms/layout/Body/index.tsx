import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

interface Props {
  children: ReactNode;
  paddingTop?: 'page';
  color?: 'white';
  className?: string;
}

const Container = styled.div`
  height: 100%;
  flex: 1;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    &.page {
      padding-top: ${theme.layout.paddingTop}px;
    }
  }
  &.white {
    background: var(--c-neutral-100);
  }
`;

const Body = (props: Props) => {
  const { children, paddingTop, color, className } = props;

  return (
    <Container className={classnames(className, paddingTop, color)}>
      {children}
    </Container>
  );
};

export default Body;
