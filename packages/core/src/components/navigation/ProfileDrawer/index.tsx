import {
  faBars,
  faCog,
  faInfoCircle,
  faSignOut,
  faUserFriends,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled, { css } from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import ButtonBase from 'atoms/buttons/ButtonBase';
import { IconButton } from 'atoms/buttons/IconButton';
import Dropdown from 'atoms/dropdowns/Dropdown';
import { ChevronDownBold } from 'atoms/icons/ChevronDownBold';
import { Drawer } from 'atoms/layout/Drawer';
import { Text16, Title4 } from 'atoms/typography';
import { HREF_HELP } from 'constants/externalLinks';
import { INVITE, SETTINGS_HOME, useDefaultSportPages } from 'constants/routes';
import { useWalletContext } from 'contexts/wallet';
import { glossary, navLabels } from 'lib/glossary';
import { Link } from 'routing/Link';
import { Baseball } from 'routing/MultiSportAppBar/Sport/Baseball';
import { Football } from 'routing/MultiSportAppBar/Sport/Football';
import { NBA } from 'routing/MultiSportAppBar/Sport/NBA';

const switches = {
  [Sport.FOOTBALL]: <Football />,
  [Sport.BASEBALL]: <Baseball />,
  [Sport.NBA]: <NBA />,
};

const DrawerWrapper = styled.div`
  background: var(--c-neutral-300);
  height: 100vh;
  padding: var(--unit) var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 50%;
`;

const StyledChevronDownBold = styled(ChevronDownBold)<{ $expanded: boolean }>`
  transition: transform 0.2s ease-in-out;
  ${({ $expanded }) =>
    $expanded &&
    css`
      transform: rotate(180deg);
    `}
`;

const Frame = styled(ButtonBase)`
  display: flex;
  max-height: calc(5 * var(--unit));
  gap: var(--double-unit);
  padding: var(--intermediate-unit) var(--double-unit);
  border-radius: var(--quadruple-unit);
  background-color: var(--c-static-neutral-900);
`;

const Option = styled(Link)`
  display: flex;
  padding: var(--intermediate-unit) var(--double-unit);
  min-width: 200px;
  gap: var(--unit);
  align-items: center;
`;

const ReferralProgram = styled(Title4)`
  margin-top: var(--double-unit);
  color: var(--c-yellow-600);
  display: flex;
  align-items: center;
  gap: var(--unit);
  &:hover,
  &:focus {
    color: var(--c-static-yellow-300);
  }
`;

const MenuItemWrapper = styled(Text16).attrs({ bold: true })`
  display: flex;
  align-items: center;
  gap: var(--unit);
  &:hover,
  &:focus {
    color: var(--c-neutral-700);
  }
`;

const MenuItem = ({
  label,
  icon,
  path,
  isExternal,
  onClick,
}: {
  label: MessageDescriptor;
  icon: React.ReactNode;
  path?: string;
  isExternal?: boolean;
  onClick?: () => void;
}) => {
  const content = (
    <>
      {icon}
      <FormattedMessage {...label} />
    </>
  );
  if (path) {
    if (isExternal) {
      return (
        <MenuItemWrapper
          as="a"
          href={path}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </MenuItemWrapper>
      );
    }
    return (
      <MenuItemWrapper key={label.id} as={Link} to={{ pathname: path }}>
        {content}
      </MenuItemWrapper>
    );
  }
  return (
    <MenuItemWrapper key={label.id} as="button" onClick={onClick}>
      {icon}
      <FormattedMessage {...label} />
    </MenuItemWrapper>
  );
};

export const ProfileDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const defaultSportPages = useDefaultSportPages();

  const options = Object.entries(switches).filter(
    ([switchSport]) => switchSport !== Sport.FOOTBALL
  );

  const walletContext = useWalletContext();

  const logOut = () => {
    walletContext.logOut();
  };

  const menuItems = [
    {
      label: navLabels.settings,
      path: SETTINGS_HOME,
      icon: <FontAwesomeIcon icon={faCog} />,
    },
    {
      label: navLabels.helpCenter,
      path: HREF_HELP,
      isExternal: true,
      icon: <FontAwesomeIcon icon={faInfoCircle} />,
    },
    {
      label: glossary.logOut,
      icon: <FontAwesomeIcon icon={faSignOut} />,
      onClick: logOut,
    },
  ];

  return (
    <>
      <IconButton
        icon={faBars}
        color="transparent"
        small
        onClick={() => {
          setDrawerOpen(true);
        }}
      />
      <Drawer
        side="left"
        open={drawerOpen}
        onBackdropClick={() => {
          setDrawerOpen(false);
        }}
      >
        <DrawerWrapper>
          <IconButton
            icon={faXmark}
            color="transparent"
            small
            onClick={() => {
              setDrawerOpen(false);
            }}
          />
          <DropdownWrapper>
            <Dropdown
              darkTheme
              align="right"
              breakpoint="tablet"
              gap={4}
              label={
                <Frame>
                  {switches[Sport.FOOTBALL]}
                  <StyledChevronDownBold $expanded={expanded} />
                </Frame>
              }
              onOpen={() => setExpanded(true)}
              onClose={() => setExpanded(false)}
            >
              {options.map(([sportSwitch, label]) => (
                <Option
                  key={sportSwitch}
                  to={defaultSportPages[sportSwitch as keyof typeof switches]}
                >
                  {label}
                </Option>
              ))}
            </Dropdown>
          </DropdownWrapper>
          <ReferralProgram as={Link} to={INVITE}>
            <FontAwesomeIcon icon={faUserFriends} />
            <FormattedMessage {...navLabels.referralProgram} />
          </ReferralProgram>
          {menuItems.map(menuItem => (
            <MenuItem key={menuItem.label.id} {...menuItem} />
          ))}
        </DrawerWrapper>
      </Drawer>
    </>
  );
};
