import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.button`
  display: grid;
  grid-template-rows: 40px 1fr min-content;
  grid-template-areas: 'header' 'image' 'footer';
  gap: var(--double-unit);
  background-color: var(--c-neutral-200);
  border-radius: var(--unit);
  padding: var(--intermediate-unit);
  width: 100%;
  height: 240px;

  &.inDialog {
    background-color: var(--c-neutral-300);
  }
`;

type Props = {
  inDialog?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

export const Item = ({ inDialog = false, onClick, children }: Props) => {
  return (
    <Root className={classnames({ inDialog })} onClick={onClick}>
      {children}
    </Root>
  );
};
