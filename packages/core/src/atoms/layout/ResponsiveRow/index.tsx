import { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
};

const Root = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const Children = styled.div`
  display: flex;
  gap: var(--double-unit);
  & > * {
    --card-width: 160px;
    width: var(--card-width);
    flex: 1 0 var(--card-width);
  }
`;

export const ResponsiveRow = ({ children }: Props) => {
  return (
    <Root>
      <Children>{children}</Children>
    </Root>
  );
};

export default ResponsiveRow;
