import { faChevronRight, faTimes } from '@fortawesome/pro-solid-svg-icons';
import classNames from 'classnames';
import { Dispatch, ReactNode, SetStateAction, useRef } from 'react';
import { useIntl } from 'react-intl';
import { animated, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Drawer } from '@core/atoms/layout/Drawer';
import { useIsDesktop } from '@core/hooks/device/useIsDesktop';
import { glossary } from '@core/lib/glossary';
import { breakpoints, desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

export const Footer = styled.footer`
  width: 100%;
  position: sticky;
  bottom: 0;
  display: flex;
  justify-self: stretch;
  align-self: flex-end;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, rgba(34, 36, 43, 0) 0%, #22242b 53.12%);
  color: #b2b4bf;
  font: var(--t-14);
  height: var(--footer-height);
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 0px;
  overflow-x: hidden;
  --footer-height: calc(16 * var(--unit));
  @media ${tabletAndAbove} {
    transition: 250ms;
    &.drawerOpened {
      grid-template-columns: auto 340px;
    }
  }
  @media ${desktopAndAbove} {
    &.drawerOpened {
      grid-template-columns: auto 440px;
    }
    --footer-height: calc(18 * var(--unit));
  }
`;

const StatPanel = styled(animated.aside)`
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  top: 0;
  position: sticky;
  z-index: 1;
  overflow: auto;
  border-top-left-radius: var(--double-unit);
  border-bottom-left-radius: var(--double-unit);
`;

const CloseDrawer = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
  z-index: 2;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const MobileDrawer = styled(Drawer)`
  height: 100%;
  background: var(--c-neutral-100);
  border-radius: var(--double-unit) var(--double-unit) 0 0;
`;

type Props = {
  main: ReactNode;
  footer: ReactNode;
  focusedSlug?: string;
  setFocusedSlug?: Dispatch<SetStateAction<string | undefined>>;
  drawerContent?: ReactNode;
};

export const Layout = ({
  main,
  footer,
  drawerContent,
  focusedSlug,
  setFocusedSlug,
}: Props) => {
  const isDesktop = useIsDesktop();
  const { formatMessage } = useIntl();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelTransitions = useTransition(!!focusedSlug, {
    from: { x: '100%' },
    enter: { x: '0%', y: '0%' },
    leave: { x: '100%' },
    reverse: !!focusedSlug,
  });

  return (
    <Wrapper
      ref={wrapperRef}
      className={classNames({ drawerOpened: !!(drawerContent && focusedSlug) })}
    >
      <Content>
        <Main>{main}</Main>
        <Footer>{footer}</Footer>
      </Content>
      {drawerContent &&
        (isDesktop ? (
          <>
            {panelTransitions(
              (styles, isOpen) =>
                isOpen && (
                  <StatPanel
                    style={{
                      ...styles,
                      height: `${wrapperRef.current?.clientHeight}px`,
                    }}
                  >
                    {drawerContent}
                  </StatPanel>
                )
            )}
            {!!focusedSlug && (
              <CloseDrawer>
                <IconButton
                  data-testid="close-stat-drawer"
                  onClick={() => setFocusedSlug?.(undefined)}
                  color="white"
                  icon={faChevronRight}
                  aria-label={formatMessage(glossary.close)}
                />
              </CloseDrawer>
            )}
          </>
        ) : (
          <MobileDrawer open={!!focusedSlug} side="bottom">
            {drawerContent}
            {!!focusedSlug && (
              <CloseDrawer>
                <IconButton
                  data-testid="close-stat-drawer"
                  onClick={() => setFocusedSlug?.(undefined)}
                  color="white"
                  icon={faTimes}
                  aria-label={formatMessage(glossary.close)}
                />
              </CloseDrawer>
            )}
          </MobileDrawer>
        ))}
    </Wrapper>
  );
};

const betweenMobileAndTablet =
  breakpoints.mobile + (breakpoints.tablet - breakpoints.mobile) / 2;

export const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  justify-self: center;

  perspective: 1000px;

  & * {
    transform-style: preserve-3d;
  }

  @media ${tabletAndAbove} {
    margin: 0 var(--quadruple-unit);
  }

  & > * {
    padding: var(--unit);
    align-self: center;
    justify-self: center;
  }

  &.two > * {
    flex-basis: 50%;
  }

  &.three > * {
    @media (min-width: ${betweenMobileAndTablet}px) {
      flex-basis: 33%;
    }
  }
  &.four > * {
    @media ${tabletAndAbove} {
      flex-basis: 25%;
    }
  }
  &.four.five > * {
    @media ${tabletAndAbove} {
      flex-basis: 25%;
    }
    @media ${desktopAndAbove} {
      padding: var(--double-unit);
      flex-basis: 20%;
    }
  }
  &.five > * {
    @media ${tabletAndAbove} {
      flex-basis: 20%;
    }
  }
`;
