import classnames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ManagerTaskTooltip from 'components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask from 'components/onboarding/managerTask/MarketplaceOnboardingTask';
import { FOOTBALL_MARKET } from '@sorare/core/src/constants/routes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from 'contexts/managerTask';
import { Link } from 'routing/Link';

import useBottomBarNavItems from './useBottomBarNavItems';

const Root = styled.nav`
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
`;
const List = styled.ul`
  background: var(--c-static-neutral-1000);
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
  width: 100%;
`;
const Item = styled.li`
  /** https://css-tricks.com/flex-grow-is-weird/ */
  flex-grow: 1;
  width: 0;
`;
const PortalReceiver = styled.div`
  position: absolute;
  bottom: calc(100% + var(--double-unit));
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.hide {
    display: none;
  }
`;
const LinkWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: var(--intermediate-unit) var(--intermediate-unit) var(--unit);
  gap: var(--half-unit);
  color: rgba(var(--c-static-rgb-neutral-100), 0.65);
  &.active {
    color: var(--c-static-neutral-100);
  }
`;
const Icon = styled.div`
  font-size: 22px;
  svg {
    display: block;
  }
`;
const Ellipsis = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  font-size: 10px;
`;

const MultiSportBottomNavBar = () => {
  const ref = useRef<HTMLUListElement>(null);
  const scrollRef = useRef({ oldScroll: 0 });
  const [hide, setHide] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const { pathname } = useLocation();
  const bottomBarNavItems = useBottomBarNavItems();
  const { step, setStep, task } = useManagerTaskContext();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  if (!bottomBarNavItems) {
    return null;
  }

  return (
    <Root className={classnames({ hide: hide && !task, isBottom })}>
      <PortalReceiver
        id="above-bottom-bar-portal"
        className={classnames({ hide: isBottom })}
      />
      <List ref={ref}>
        {bottomBarNavItems?.map(({ id, to, label, icon }) => (
          <Item key={id}>
            <ManagerTaskTooltip
              name={MarketplaceOnboardingStep.menu}
              title={
                <MarketplaceOnboardingTask
                  name={MarketplaceOnboardingStep.menu}
                  onClick={() => {
                    setStep();
                    navigate(FOOTBALL_MARKET);
                    setTimeout(() => {
                      setStep(MarketplaceOnboardingStep.managerSalesLink);
                    }, 300);
                  }}
                />
              }
              disable={id !== 'market' || !task}
            >
              <LinkWrapper
                to={to}
                className={classnames({
                  active:
                    to === pathname ||
                    (id === 'market' &&
                      MarketplaceOnboardingStep.menu === step),
                })}
              >
                <Icon>{icon}</Icon>
                <Ellipsis>
                  <FormattedMessage {...label} />
                </Ellipsis>
              </LinkWrapper>
            </ManagerTaskTooltip>
          </Item>
        ))}
      </List>
    </Root>
  );
};

export default MultiSportBottomNavBar;
