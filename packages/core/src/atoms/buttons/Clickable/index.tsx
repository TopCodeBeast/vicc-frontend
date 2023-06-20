import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Hover = keyframes`
  from {
    filter: drop-shadow(0px 5px 10px transparent);
  }
  to {
    filter: drop-shadow(0px 5px 10px rgba(0,0,0,0.1));
  }
`;
const Root = styled.button`
  display: block;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
  text-align: inherit;
  text-decoration: none;
  cursor: pointer;
  @media (hover: hover) {
    transform-origin: bottom center;
    transition: transform 0.1s ease-out;
    will-change: transform, filter;
    &:hover {
      animation: 0.1s ease ${Hover} forwards;
      transform: scale(1.008);
    }
  }
`;

type Props = {
  children: ReactNode;
  className?: string;
} & (
  | {
      onClick?: () => void;
    }
  | {
      component: React.ElementType;
    }
  | {
      to: string;
    }
);

const Clickable = ({ children, className, ...rest }: Props) => {
  if ('component' in rest && rest.component !== undefined) {
    const { component: Component } = rest;
    return (
      <Root as={Component} className={className}>
        {children}
      </Root>
    );
  }

  if ('to' in rest && rest.to !== undefined) {
    const { to } = rest;
    return (
      <Root as={Link} to={to} className={className}>
        {children}
      </Root>
    );
  }

  if ('onClick' in rest && rest.onClick !== undefined) {
    const { onClick } = rest;
    return (
      <Root type="button" onClick={onClick} className={className}>
        {children}
      </Root>
    );
  }
  return <div className={className}>{children}</div>;
};

export default Clickable;
