import { MenuItem } from '@material-ui/core';
import classnames from 'classnames';
import { ComponentType, ReactNode, forwardRef } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { MenuVisibility } from '@core/lib/menu';
import { theme } from '@core/style/theme';

import { useAppBarContext } from '../context';

type MenuItem = {
  key: string;
  to?: string;
  onClick?: () => void;
  label?: MessageDescriptor;
  content?: ReactNode;
  subMenu?: MenuItem[];
  hasDivider?: boolean;
  secondary?: boolean;
  visibility?: MenuVisibility;
  sport?: Sport;
  href?: string;
  externalLink?: boolean;
  Wrapper?: ComponentType;
};

export type MenuItems = MenuItem[];

interface Props {
  items: MenuItems;
}

export const EllipsisText = styled.span`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Root = styled(MenuItem)`
  &.hasDivider {
    position: relative;
    border-bottom: none;
    &:after {
      content: '';
      position: absolute;
      width: calc(100% - calc(4 * var(--unit)));
      bottom: 0;
      left: calc(2 * var(--unit));
      background-color: var(--c-neutral-300);
      height: 1px;
    }
  }
  &.active {
    &.small {
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
  }
  &.secondary {
    color: var(--c-neutral-600);
    display: none;
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      display: block;
    }
  }
` as typeof MenuItem;

const SecondaryMenuItem = ({
  to,
  label,
  content,
  onClick,
  subMenu,
  hasDivider = false,
  secondary = false,
  visibility,
  itemKey,
  href,
  externalLink,
}: MenuItem & { itemKey: string }) => {
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();

  const { small } = useAppBarContext();

  if (
    (visibility === 'mobile-only' && !small) ||
    (visibility === 'large-only' && small)
  ) {
    return null;
  }

  if (to) {
    return (
      <>
        <Root
          key={itemKey}
          component={Link}
          to={to}
          onClick={onClick}
          divider={hasDivider}
          className={classnames({
            hasDivider,
            secondary,
            active: to === pathname,
            small,
          })}
          reloadDocument={to === pathname}
          selected={to === pathname}
        >
          <EllipsisText>{label ? formatMessage(label) : content}</EllipsisText>
        </Root>
        {subMenu?.map((item, i) => {
          const { key, ...itemProps } = item;
          return (
            <SecondaryMenuItem
              key={key}
              {...itemProps}
              itemKey={key}
              hasDivider={i + 1 === subMenu.length}
              secondary
            />
          );
        })}
      </>
    );
  }

  if (href) {
    return (
      <Root
        component="a"
        href={href}
        {...(externalLink
          ? ({ target: '_blank', rel: 'noopener noreferrer' } as any)
          : {})}
        key={itemKey}
        onClick={onClick}
        divider={hasDivider}
        className={classnames({
          hasDivider,
          secondary,
          active: to === pathname,
          small,
        })}
        selected={to === pathname}
      >
        <EllipsisText>{label ? formatMessage(label) : content}</EllipsisText>
      </Root>
    );
  }

  return (
    <>
      <Root
        key={itemKey}
        onClick={onClick}
        divider={hasDivider}
        className={classnames({
          hasDivider,
          secondary,
        })}
      >
        {label ? formatMessage(label) : content}
      </Root>
      {subMenu?.map((item, i) => (
        <SecondaryMenuItem
          {...item}
          itemKey={item.key}
          key={item.key}
          hasDivider={i + 1 === subMenu.length}
          secondary
        />
      ))}
    </>
  );
};

const Menu = forwardRef<HTMLDivElement, Props>(({ items }, ref) => {
  return (
    <div ref={ref}>
      {items.map(item => {
        if (item.Wrapper)
          return (
            <item.Wrapper key={item.key}>
              <SecondaryMenuItem {...item} itemKey={item.key} />
            </item.Wrapper>
          );
        return (
          <SecondaryMenuItem {...item} key={item.key} itemKey={item.key} />
        );
      })}
    </div>
  );
});

Menu.displayName = 'Menu';

export default Menu;
