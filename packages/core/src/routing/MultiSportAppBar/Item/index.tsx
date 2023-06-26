import { MenuItem } from '@material-ui/core';
import classnames from 'classnames';
import { ComponentType, ReactNode, useCallback } from 'react';
import { MessageDescriptor } from 'react-intl';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Fade } from '@core/atoms/ui/Transition';
import { useIntlContext } from '@core/contexts/intl';
import useTouchScreen from '@core/hooks/device/useTouchScreen';
import { MenuVisibility } from '@core/lib/menu';
import { matchLocation } from '@core/lib/urls';
import { theme } from '@core/style/theme';

import AppBarMenu, { MenuItems } from '../Menu';
import { useAppBarContext } from '../context';
import { Button as AppBarButton } from './Button';

export interface Config {
  key: string;
  action?: () => void;
  label?: MessageDescriptor;
  content?: string | ReactNode;
  button?: { active?: boolean };
  to?: string;
  href?: string;
  externalLink?: boolean;
  subMenu?: MenuItems;
  visibility?: MenuVisibility;
  sport?: Sport;
  rightPositioned?: boolean;
  exactMatch?: boolean;
  overflowVisible?: boolean;
  forceActive?: boolean;
  Wrapper?: ComponentType<{ children: ReactElement }>;
}

interface Props {
  config: Config;
  children: ReactNode;
}

const MenuButton = styled.div`
  position: relative;
  display: inline-block;
  white-space: nowrap;
`;
const Menu = styled.div`
  border-radius: 8px;
  background-color: var(--c-neutral-200);
  position: absolute;
  filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.06));
  top: 100%;
  z-index: ${theme.zIndex.modal};
  &.rightPositioned {
    right: 0;
  }
`;

const DesktopItem = ({
  config: {
    key,
    action,
    button = {},
    to,
    href,
    exactMatch = false,
    externalLink = false,
    subMenu,
    rightPositioned = false,
    forceActive = false,
  },
  children,
}: Props) => {
  const { openMenu, openedMenu, closeMenu } = useAppBarContext();
  const location = useLocation();
  const isTouchScreen = useTouchScreen();

  const doOpenMenu = useCallback(() => {
    if (subMenu) {
      openMenu(key);
    } else {
      closeMenu();
    }
  }, [key, subMenu, openMenu, closeMenu]);

  let buttonProps: {
    component?: typeof Link;
    to?: string;
    href?: string;
    exactMatch?: boolean;
    externalLink?: boolean;
    onClick?: () => void;
  } = {
    ...button,
    onClick: action,
  };
  const buttonContainerProps: {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  } = {};

  if (to) buttonProps = { ...buttonProps, to, exactMatch };
  if (href) buttonProps = { ...buttonProps, href, externalLink };

  if (isTouchScreen) {
    buttonProps.onClick = buttonProps.onClick || doOpenMenu;
  } else {
    buttonProps.onClick = doOpenMenu;
    buttonContainerProps.onMouseEnter = doOpenMenu;
    buttonContainerProps.onMouseLeave = closeMenu;
  }
  if (to) {
    if (matchLocation(to, location)) {
      buttonProps.onClick = buttonProps.onClick || doOpenMenu;
    } else {
      buttonProps = {
        ...buttonProps,
        component: Link,
      };
    }
  }

  return (
    <MenuButton {...buttonContainerProps}>
      <AppBarButton {...buttonProps} {...(forceActive ? { active: true } : {})}>
        {children}
      </AppBarButton>
      {subMenu && (
        <Fade in={openedMenu === key}>
          <Menu className={classnames({ rightPositioned })}>
            <AppBarMenu items={subMenu} />
          </Menu>
        </Fade>
      )}
    </MenuButton>
  );
};

const StyledMenuItem = styled(MenuItem)`
  --inactiveColor: rgba(255, 255, 255, 0.5);
  --activeColor: rgba(255, 255, 255, 1);
  min-height: 40px;
  padding: 0;
  &:not(:last-child) {
    border-bottom: 1px solid #333333;
    border-radius: 0;
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: 0px 10px;
  }
  color: var(--activeColor);
  &.Mui-selected,
  &:hover {
    color: var(--activeColor);
    &:hover {
      color: var(--activeColor);
    }
  }
  &.overflowVisible {
    overflow: visible;
  }
  &.Mui-selected {
    &:before {
      content: '';
      background-color: #4662f7;
      top: 0;
      bottom: 0;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      width: 4px;
      position: absolute;
      left: -20px;
    }
    overflow: visible;
  }
` as typeof MenuItem; // Workaround Typescript inference issue
// https://github.com/mui/material-ui/issues/15759#issuecomment-984553630

const WithSubmenu = styled(StyledMenuItem)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: inherit;
  padding: 10px 0px;
  & a,
  & li {
    padding-left: 0;
    padding-right: 0;
    min-height: 0;
    color: var(--inactiveColor);
    &.small {
      color: var(--activeColor);
    }
    &:hover {
      color: var(--activeColor);
    }
    &.Mui-selected {
      color: var(--activeColor);
      &:hover {
        color: var(--activeColor);
      }
    }
  }
`;
const SubMenuTitle = styled.span`
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-size: 12px;
  font-family: apercu-pro, system-ui, sans-serif;
  font-weight: var(--t-bold);
  font-style: normal;
`;

const MobileItem = ({ config, children }: Props) => {
  const {
    action,
    to,
    href,
    externalLink = false,
    subMenu,
    overflowVisible = false,
  } = config;
  const location = useLocation();

  if (subMenu) {
    return (
      <WithSubmenu as="div">
        <SubMenuTitle>{children}</SubMenuTitle>
        <AppBarMenu items={subMenu} />
      </WithSubmenu>
    );
  }
  if (to) {
    const selected = !!location.pathname.match(to);
    return (
      <StyledMenuItem
        className={classnames({
          overflowVisible,
        })}
        component={Link}
        to={to}
        selected={selected}
      >
        {children}
      </StyledMenuItem>
    );
  }

  if (href) {
    return (
      <StyledMenuItem
        className={classnames({
          overflowVisible,
        })}
        component={Button}
        href={href}
        {...(externalLink
          ? ({ target: '_blank', rel: 'noopener noreferrer' } as any)
          : {})}
      >
        {children}
      </StyledMenuItem>
    );
  }

  return (
    <StyledMenuItem
      className={classnames({
        overflowVisible,
      })}
      onClick={() => action?.()}
    >
      {children}
    </StyledMenuItem>
  );
};

export const Item = ({ config }: Omit<Props, 'children'>) => {
  const { visibility, sport, label, content } = config;
  const { formatMessage } = useIntlContext();
  const display = label ? formatMessage(label) : content;

  const { small, sport: sportContext } = useAppBarContext();

  if (
    (visibility === 'mobile-only' && !small) ||
    (visibility === 'large-only' && small) ||
    (sport && sport !== sportContext)
  ) {
    return null;
  }

  if (small) {
    return <MobileItem config={config}>{display}</MobileItem>;
  }

  return <DesktopItem config={config}>{display}</DesktopItem>;
};

export default Item;
