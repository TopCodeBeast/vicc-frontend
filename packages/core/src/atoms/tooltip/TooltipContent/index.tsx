import { ReactNode } from 'react';
import styled from 'styled-components';

import { theme } from '@core/style/theme';

type Props = {
  children: ReactNode;
};

const RootDiv = styled.div`
  background-color: white;
  border-radius: ${theme.shape.borderRadius}px;
  border: 1px solid var(--c-yellow-600);
`;

const ContainerDiv = styled.div`
  font-family: var(--sorareFont);
  font-weight: 400;
  font-style: normal;
  font-size: 15px;
  line-height: 22px;
  color: var(--c-neutral-600);
  border-radius: inherit;
  background-color: rgba(var(--c-rgb-yellow-600), 0.25);
  padding: 10px;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.05);
  text-align: left;
`;

export const TooltipContent = (props: Props) => {
  const { children } = props;
  return (
    <RootDiv>
      <ContainerDiv>{children}</ContainerDiv>
    </RootDiv>
  );
};

export default TooltipContent;
