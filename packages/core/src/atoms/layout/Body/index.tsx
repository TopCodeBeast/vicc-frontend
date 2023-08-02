import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  color?: 'white';
  className?: string;
}

const Container = styled.div`
  height: 100%;
  flex: 1;
  &.white {
    background: var(--c-neutral-100);
  }
`;

const Body = (props: Props) => {
  const { children, color, className } = props;

  return (
    <Container className={classnames(className, color)}>{children}</Container>
  );
};

export default Body;
