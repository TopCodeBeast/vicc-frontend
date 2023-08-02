import { Badge } from '@material-ui/core';
import classnames from 'classnames';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { useIsDesktop } from 'hooks/device/useIsDesktop';
import { tabletAndAbove } from 'style/mediaQuery';

import { ProfileDrawer } from '../ProfileDrawer';

export const APP_BAR_DESKTOP_WIDTH = 70;

const Wrapper = styled.nav`
  background: var(--c-neutral-200);
  position: sticky;
  bottom: 0;
  transition: 0.3s ease transform;
  z-index: 2;
  &.hide {
    transform: translateY(100%);
  }
  &.isBottom {
    position: static;
    transform: none;
    transition: none;
  }
  @media ${tabletAndAbove} {
    top: 0;
    bottom: unset;
    height: 100vh;
    width: ${APP_BAR_DESKTOP_WIDTH}px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
`;

const List = styled.div`
  display: flex;
  @media ${tabletAndAbove} {
    flex-direction: column;
  }
`;

const StyledNavLink = styled(NavLink)`
  flex: 1;
  color: var(--c-neutral-600);
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
    & img {
      opacity: 1;
    }
  }
  &.active {
    color: var(--c-neutral-1000);
    & img {
      opacity: 1;
    }
  }
  padding: var(--unit);
  font: var(--t-12);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--half-unit);
  @media ${tabletAndAbove} {
    padding: var(--double-unit);
  }
  & svg {
    font-size: 20px;
    height: 24px;
  }
  & img {
    width: 28px !important;
    opacity: 0.7;
  }
`;

const BottomButtons = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: var(--double-unit);
`;
type Props = {
  navItems: { label: string; to: string; icon: ReactNode; badge?: number }[];
};

export const AppNavigation = ({ navItems }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ oldScroll: 0 });
  const [hide, setHide] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) {
      return () => {};
    }
    const hideOnScrollDown = () => {
      const { scrollingElement } = document;
      if (!scrollingElement || !ref.current) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollingElement;
      const isScrollingDown = scrollRef.current.oldScroll < scrollTop;
      const hasReachedTop = scrollTop <= 0;
      const viewportHeight =
        scrollHeight - (clientHeight + ref.current.offsetHeight * 2);
      const hasReachedBottom = scrollTop > viewportHeight;

      scrollRef.current.oldScroll = scrollTop;
      setHide(isScrollingDown && !(hasReachedTop || hasReachedBottom));
      setIsBottom(isScrollingDown && hasReachedBottom);
    };

    window.document.addEventListener('scroll', hideOnScrollDown);
    return () => {
      window.document.removeEventListener('scroll', hideOnScrollDown);
    };
  }, [isDesktop]);

  return (
    <Wrapper className={classnames({ hide, isBottom })}>
      <List ref={ref}>
        {navItems.map(({ label, to, icon, badge }) => (
          <StyledNavLink key={to} to={to}>
            {badge ? <Badge badgeContent={badge}>{icon}</Badge> : icon}
            {label}
          </StyledNavLink>
        ))}
      </List>
      {isDesktop && (
        <BottomButtons>
          <ProfileDrawer />
        </BottomButtons>
      )}
    </Wrapper>
  );
};
