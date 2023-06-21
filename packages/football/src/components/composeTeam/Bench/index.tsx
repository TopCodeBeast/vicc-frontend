import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import { FC, ReactNode, UIEventHandler } from 'react';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { theme } from '@sorare/core/src/style/theme';

import Field, { Props as FieldProps } from './Field';

const Root = styled.div`
  position: fixed;
  inset: 0;
  isolation: isolate;
  transform: translateY(30%);
  opacity: 0;
  pointer-events: none;
  overflow: auto;
  z-index: 2;
  background: var(--c-neutral-100);
  transition: 0.3s ease transform, var(--fade-in);
  &.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    position: static;
    transform: translateY(0);
    width: 440px;
    height: 100%;
    opacity: 1;
    overflow: unset;
    pointer-events: auto;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  gap: var(--double-unit);
`;
const Container = styled(Content)`
  padding: var(--double-unit);
  flex: 1;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding: 0;
  }
`;
const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  color: var(--c-neutral-1000);
  flex: 1;
`;
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--c-neutral-100);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: none;
  }
`;

type HeaderProps = {
  onClose: () => void;
};
const HeaderWrapper = ({ onClose }: HeaderProps) => {
  return (
    <Header>
      <IconButton onClick={onClose} icon={faChevronLeft} color="gray" />
    </Header>
  );
};

export type Props = {
  onScroll?: UIEventHandler<HTMLElement>;
  render: (props: {
    Container: FC;
    Header: FC<HeaderProps>;
    Cards: FC;
    Field?: FC<FieldProps>;
  }) => ReactNode;
  open: boolean;
};
const Bench = ({ onScroll, render, open }: Props) => {
  return (
    <Root className={classnames({ open })} onScroll={onScroll}>
      <Content>
        {render({ Container, Header: HeaderWrapper, Cards, Field })}
      </Content>
    </Root>
  );
};

export default Bench;
