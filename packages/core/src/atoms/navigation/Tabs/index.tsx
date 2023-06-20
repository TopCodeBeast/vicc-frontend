import classnames from 'classnames';
import { Link, matchPath, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { useIsInModal } from '@sorare/core/src/hooks/useIsInModal';
import { theme } from '@sorare/core/src/style/theme';

const Wrapper = styled.div`
  --selector: var(--c-neutral-1000);
  --link-background: transparent;
  --link: var(--c-neutral-1000);
  --activeLink: var(--c-neutral-100);
  --background: transparent;
  display: flex;
  justify-content: flex-start;
  gap: var(--unit);
  padding: 0 var(--unit);
  max-width: 100%;
  overflow: auto;
  background: var(--background);
  scroll-snap-type: x mandatory;
  font-weight: var(--t-bold);
`;

const Item = styled(Link)`
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: var(--link);
  line-height: 32px;
  text-decoration: none;
  scroll-snap-align: center;
  white-space: nowrap;
  background: var(--link-background);
  border-radius: ${theme.radius.chip};
  padding: 0 var(--intermediate-unit);
  &:focus,
  &:hover,
  &.active {
    color: var(--activeLink);
    background: var(--selector);
    & * {
      color: inherit;
    }
  }
`;

export const Tabs = ({
  items,
  className,
  defaultTabIndex = 0,
  value,
}: {
  items: {
    to?: string;
    id?: string;
    label: JSX.Element | string;
    basePath?: string;
    onClick?: (index: number) => void;
    active?: boolean;
  }[];
  className?: string;
  defaultTabIndex?: number;
  value?: number;
}) => {
  const location = useLocation();
  const [tabRef, isInModal] = useIsInModal();
  const bgLocation = useBgLocation(true);
  const backgroundState = useBgLocation();
  const { pathname: currentPathname = '' } = isInModal ? location : bgLocation;

  const selectedTab =
    value ??
    items.findIndex(
      ({ basePath, to }) => to && matchPath(basePath || to, currentPathname)
    );
  return (
    <Wrapper className={className} ref={tabRef}>
      {items.map(({ to, id, label, onClick, active }, index) => {
        const itemClassName = classnames({
          active:
            selectedTab >= 0
              ? selectedTab === index
              : defaultTabIndex === index,
        });

        return to ? (
          <Item
            key={to}
            to={to + (isInModal ? location.search : '')}
            className={itemClassName}
            state={{
              backgroundState,
            }}
          >
            {label}
          </Item>
        ) : (
          <Item
            key={id}
            as="button"
            onClick={onClick && (() => onClick(index))}
            className={classnames({
              active,
            })}
          >
            {label}
          </Item>
        );
      })}
    </Wrapper>
  );
};
