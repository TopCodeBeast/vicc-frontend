import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  padding: var(--double-unit);
  gap: var(--double-unit);
  text-align: left;
  background: var(--c-neutral-300);
  color: var(--c-neutral-700);
  &:hover,
  &:focus {
    background: var(--c-neutral-400);
    color: var(--c-neutral-1000);
  }
  > *:first-child:not(:last-child) {
    max-width: 32px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--c-neutral-300);
  border-radius: var(--unit);
  overflow: hidden;

  & > *:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-300);
  }
`;

export type ButtonProps = FC<
  React.PropsWithChildren<{
    onClick?: () => void;
    href?: string;
  }>
>;
const ButtonComponent: ButtonProps = ({ children, href, onClick }) => {
  return (
    <StyledButton
      as={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </StyledButton>
  );
};

type Props = {
  children: (buttonComponent: ButtonProps) => ReactNode;
};

const ButtonsList = ({ children }: Props) => {
  return <Wrapper>{children(ButtonComponent)}</Wrapper>;
};

export default ButtonsList;
