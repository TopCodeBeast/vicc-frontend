import classnames from 'classnames';
import qs from 'qs';
import { ReactNode } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useBgLocation } from '@core/hooks/useBgLocation';
import { useIsInModal } from '@core/hooks/useIsInModal';

export type SecondaryTabsProps = {
  items: {
    key?: string;
    to?: string;
    label?: ReactNode;
    icon?: JSX.Element;
    badge?: string | number;
    separator?: string;
    active?: boolean;
    isIndex?: boolean;
    hide?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
  }[];
  noBorder?: boolean;
  centered?: boolean;
  className?: string;
  replace?: boolean;
};

const Wrapper = styled.nav`
  --link: var(--c-neutral-800);
  --linkBg: var(--c-neutral-300);
  --linkBorder: transparent;
  --activeLinkBorder: transparent;
  --activeLink: var(--c-neutral-100);
  --activeLinkBg: var(--c-neutral-1000);
  --icon: var(--c-neutral-1000);
  --activeIcon: var(--c-neutral-100);
  --badge: var(--c-neutral-1000);
  --badgeBg: var(--c-neutral-300);
  --activeBadge: var(--c-neutral-100);
  --activeBadgeBg: rgba(255, 255, 255, 0.2);
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--unit);
  padding: var(--unit) 0;
  border-bottom: 1px solid var(--c-neutral-300);
  overflow: auto;
  max-width: 100%;
  scroll-snap-type: x mandatory;
  font-weight: bold;
  isolation: isolate;
  &.noBorder {
    border-bottom: none;
  }
  &.centered {
    &::before,
    &::after {
      content: '';
      display: block;
      margin: auto;
    }
  }
`;

const Badge = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--badgeBg);
  color: var(--badge);
  min-width: 1.5em;
  height: 1.5em;
  border-radius: var(--quadruple-unit);
  padding: 0 var(--unit);
`;

const IconWrapper = styled.span`
  margin-left: var(--half-unit);
  padding-bottom: 0.1em;
  color: var(--icon);
`;

const LinkWrapper = styled(Link)`
  position: relative;
  display: inline-flex;
  gap: var(--unit);
  align-items: center;
  padding: var(--half-unit) var(--unit);
  color: var(--link);
  background: var(--linkBg);
  line-height: 28px;
  border: 2px solid var(--linkBorder);
  border-radius: var(--quadruple-unit);
  text-decoration: none;
  scroll-snap-align: center;
  white-space: nowrap;
  &:hover,
  &:focus {
    position: relative;
    color: var(--activeLink);
    background: var(--activeLinkBg);
    border-color: var(--activeLinkBorder);
  }
  &:hover ${IconWrapper}, &:focus ${IconWrapper} {
    color: var(--activeIcon);
  }
  &:hover ${Badge}, &:focus ${Badge} {
    background-color: var(--activeBadgeBg);
    color: var(--activeBadge);
  }

  &:focus {
    outline: 2px solid rgba(0, 0, 0, 0.1);
  }
  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }
`;

const ActiveLinkWrapper = styled(LinkWrapper)`
  color: var(--activeLink);
  background: var(--activeLinkBg);
  border: 2px solid var(--activeLinkBorder);
  border-radius: var(--quadruple-unit);
  & ${IconWrapper} {
    color: var(--activeIcon);
  }
  & ${Badge} {
    background-color: var(--activeBadgeBg);
    color: var(--activeBadge);
  }
`;

export const SecondaryTabs = ({
  items,
  className,
  noBorder,
  centered,
  replace,
}: SecondaryTabsProps) => {
  const location = useLocation();
  const [tabRef, isInModal] = useIsInModal();
  const qsFromLocation = qs.parse(location.search, { ignoreQueryPrefix: true });
  const bgLocation = useBgLocation(true);
  const backgroundState = useBgLocation();
  const { pathname: currentPathname = '' } = isInModal ? location : bgLocation;
  return (
    <Wrapper
      className={classnames(className, {
        noBorder,
        centered,
      })}
      ref={tabRef}
    >
      {items
        .filter(({ hide }) => !hide)
        .map(
          ({
            key,
            to,
            label,
            active,
            separator,
            icon: Icon,
            badge,
            isIndex,
            disabled,
            style,
            onClick,
          }) => {
            if (separator || to === undefined) {
              return (
                <svg key={separator} width="1" height="24">
                  <rect width="1" height="24" fill="var(--c-neutral-400)" />
                </svg>
              );
            }
            const { pathname, search } = new URL(to, window.location.origin);
            const isRelative = !to.startsWith('/');
            const itemPathname = isRelative
              ? pathname.replace(/^\//, '')
              : pathname;
            const qsFromTo = qs.parse(search || '', {
              ignoreQueryPrefix: true,
            });

            const isActive =
              active ??
              matchPath(`${pathname}${isIndex ? '/*' : ''}`, currentPathname);

            const FinalLinkWrapper = isActive ? ActiveLinkWrapper : LinkWrapper;

            const linkTo =
              itemPathname +
              qs.stringify(
                Object.fromEntries(
                  Object.entries({ ...qsFromLocation, ...qsFromTo }).filter(
                    ([, v]) => !!v
                  )
                ),
                {
                  addQueryPrefix: true,
                }
              );
            return (
              <FinalLinkWrapper
                style={style}
                key={key || to}
                replace={replace}
                onClick={onClick}
                to={linkTo}
                className={classnames({ disabled })}
                state={{
                  backgroundState,
                }}
              >
                {!!Icon && <IconWrapper>{Icon}</IconWrapper>}
                {label}
                {!!badge && <Badge>{badge}</Badge>}
              </FinalLinkWrapper>
            );
          }
        )}
    </Wrapper>
  );
};
