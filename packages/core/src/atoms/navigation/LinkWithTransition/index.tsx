import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  to: string;
  children: ReactNode;
}

const StyledLink = styled(Link)`
  color: white;
  opacity: 0.6;
  transition: opacity 0.15s ease-in-out;
  &:hover {
    opacity: 1;
  }
`;

const LinkWithTransition = (props: Props) => {
  const { children, to } = props;

  return <StyledLink to={to}>{children}</StyledLink>;
};

export default LinkWithTransition;
