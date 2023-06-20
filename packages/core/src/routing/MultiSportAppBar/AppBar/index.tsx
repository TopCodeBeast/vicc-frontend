import { ReactNode } from 'react';
import styled from 'styled-components';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 2;
  isolation: isolate;
  box-shadow: none;
  color: var(--c-static-neutral-100);
  background-color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};
`;

type Props = {
  children: ReactNode;
  color?: 'transparent';
  onMouseLeave?: () => void;
  className?: string;
};
export const AppBar = ({ children, color, onMouseLeave, className }: Props) => {
  return (
    <Header color={color} onMouseLeave={onMouseLeave} className={className}>
      {children}
    </Header>
  );
};

export default AppBar;
