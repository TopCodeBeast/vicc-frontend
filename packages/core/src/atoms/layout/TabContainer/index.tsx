import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

const Container = styled.div`
  padding: var(--triple-unit) 0;
`;

const TabContainer = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default TabContainer;
