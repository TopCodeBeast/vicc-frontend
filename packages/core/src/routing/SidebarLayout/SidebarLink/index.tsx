import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ReactNode, useState } from 'react';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@core/atoms/buttons/ButtonBase';
import { Text16 } from '@core/atoms/typography';
import { useIntlContext } from '@core/contexts/intl';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { Link } from '@core/routing/Link';

export interface LinkProps<ID extends string = string> {
  id: ID;
  label: MessageDescriptor | string;
  icon?: IconDefinition;
  pictureUrl?: string;
  subtitle?: ReactNode;
  to?: string;
  onClick?: () => void;
  activeLink?: ID;
  nested?: LinkProps<ID>[];
  parent?: string;
  toggleMenuOpened?: () => void;
  hidden?: boolean;
}

interface Props<ID extends string = string> extends LinkProps<ID> {
  active?: boolean;
  onClick?: () => void;
  onClickNested?: (id: ID) => void;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const StyledButtonBase = styled(ButtonBase)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  margin: 0;
  gap: var(--unit);
  &.parentAvailable {
    background-color: rgba(var(--c-rgb-brand-600), 0.25);
  }
  &.active,
  &:hover,
  &:focus {
    color: var(--c-brand-600);
  }
`;
const LabelContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: inherit;
`;
const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  padding: var(--unit);
  margin-right: var(--unit);
  background-color: var(--c-neutral-200);
  border-radius: 12px;
  color: var(--c-brand-600);
  ${StyledButtonBase}.active & {
    background-color: var(--c-brand-600);
    color: var(--c-static-neutral-100);
  }
`;
const Picture = styled.img`
  width: 32px;
  height: 32px;
  background-size: cover;
  margin-right: var(--unit);
  border-radius: 12px;
`;

export const SideBarLink = <ID extends string = string>(props: Props<ID>) => {
  const { up: isGreaterThanTablet } = useScreenSize('tablet');
  const {
    id: currentId,
    label,
    onClick,
    onClickNested,
    toggleMenuOpened,
    icon,
    pictureUrl,
    active = false,
    subtitle,
    to,
    activeLink,
    nested = [],
    parent,
    hidden = false,
  } = props;

  const { formatMessage } = useIntlContext();
  const nestedIds: ID[] = nested.map(({ id }) => id);
  const isActiveLinkInNested = activeLink
    ? nestedIds.includes(activeLink)
    : false;

  const [expand, setExpand] = useState<boolean>(() => {
    return isActiveLinkInNested;
  });

  const toggleNested = () => {
    setExpand(prevState => !prevState);

    if (isActiveLinkInNested) {
      return;
    }

    if (!isActiveLinkInNested && nestedIds.length && onClickNested) {
      onClickNested(nestedIds[0]);
    }
  };

  if (hidden) {
    return null;
  }

  if (!isActiveLinkInNested && expand) {
    setExpand(false);
  }

  return (
    <Root>
      <StyledButtonBase
        to={to}
        onClick={nested.length ? toggleNested : onClick}
        disableDebounce={!!nested.length}
        disableRipple
        component={to ? Link : 'button'}
        className={classnames({
          active: active || activeLink === currentId || isActiveLinkInNested,
          parentAvailable: parent && activeLink && activeLink !== currentId,
        })}
      >
        <LabelContainer>
          {icon && (
            <Icon>
              <FontAwesomeIcon icon={icon} />
            </Icon>
          )}
          {pictureUrl && <Picture alt={pictureUrl} src={pictureUrl} />}
          <div>
            <Text16>
              {typeof label === 'string' ? label : formatMessage(label)}
            </Text16>
            {subtitle}
          </div>
        </LabelContainer>
        {nested.length ? (
          <FontAwesomeIcon icon={expand ? faCaretUp : faCaretDown} />
        ) : null}
      </StyledButtonBase>
      {expand &&
        nested.map(element => (
          <SideBarLink
            key={element.id}
            active={activeLink === element.id}
            onClick={() => {
              if (onClickNested) {
                onClickNested(element.id);
                if (!isGreaterThanTablet && toggleMenuOpened) {
                  toggleMenuOpened();
                }
              }
            }}
            activeLink={activeLink}
            {...element}
          />
        ))}
    </Root>
  );
};

export default SideBarLink;
