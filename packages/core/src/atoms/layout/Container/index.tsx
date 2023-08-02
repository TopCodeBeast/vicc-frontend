import { ReactNode } from 'react';
import styled from 'styled-components';

import { breakpoints } from '@core/style/mediaQuery';

type Props = {
  children: ReactNode;
  className?: string;
};

const Root = styled.div`
  padding: 0px 10px;
  width: 100%;
`;
const StyledContainer = styled.div`
  width: 100%;
  max-width: ${breakpoints.desktop - 20}px;
  margin: 0 auto;
`;

export const Container = ({ children, className }: Props) => {
  return (
    <Root className={className}>
      <StyledContainer>{children}</StyledContainer>
    </Root>
  );
};

export default Container;
