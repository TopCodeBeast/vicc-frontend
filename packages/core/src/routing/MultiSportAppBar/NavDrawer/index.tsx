import { Divider, Drawer, DrawerProps } from '@material-ui/core';
import { animated, config, useSpring } from '@react-spring/web';
import styled, { css } from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import ButtonBase from '@core/atoms/buttons/ButtonBase';
import { ChevronDownBold } from '@core/atoms/icons/ChevronDownBold';
import { CloseBold } from '@core/atoms/icons/CloseBold';
import { theme } from '@core/style/theme';
import { OverrideClasses } from '@core/style/utils';

import { sportLogos } from '../Sport/Switch';

type NavLevelType = Sport | undefined;
interface Props extends DrawerProps {
  currentNavSport: NavLevelType;
  isSelectingCurrentNavSport?: boolean;
  onClose: () => void;
  onBack?: () => void;
}
interface NavDrawerHeaderProps {
  currentNavSport: NavLevelType;
  isSelectingCurrentNavSport: boolean;
  onBack?: () => void;
  onClose: () => void;
}
const Header = styled.div`
  padding: ${theme.spacing()}px;
  display: flex;
  height: 64px;
  min-height: 64px;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  color: var(--c-neutral-100);
`;

const LogoButton = styled(ButtonBase)`
  background-color: rgb(255 255 255 / 10%);
  border-radius: ${theme.spacing(2)}px;
  padding: ${theme.spacing(1)}px;
`;

const LogoButtonContent = styled(animated.div)`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const LogoContainer = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;
  & svg {
    max-height: 26px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

const StyledDivider = styled(Divider)`
  background-color: #333333;
`;

const CloseButton = styled(ButtonBase)`
  border-radius: 50%;
  padding: var(--unit);
`;

const NavDrawerHeaderLogo = ({
  currentNavSport,
}: {
  currentNavSport: NavLevelType;
}) => {
  if (!currentNavSport) return null;
  const Component = sportLogos[currentNavSport];
  return <Component active />;
};

export const NavDrawerHeader = ({
  onClose,
  onBack,
  currentNavSport,
  isSelectingCurrentNavSport,
}: NavDrawerHeaderProps) => {
  const LogoAnimation = useSpring({
    config: config.slow,
    opacity: currentNavSport ? 1 : 0,
  });

  const Rotate = useSpring({
    config: config.default,
    transform: isSelectingCurrentNavSport ? 'rotate(-180deg)' : 'rotate(0deg)',
  });

  return (
    <Header>
      <CloseButton onClick={onClose}>
        <CloseBold />
      </CloseButton>
      {currentNavSport && onBack && (
        <LogoButton onClick={onBack}>
          <LogoButtonContent style={LogoAnimation}>
            <LogoContainer>
              <NavDrawerHeaderLogo currentNavSport={currentNavSport} />
            </LogoContainer>
            <animated.span style={Rotate}>
              <ChevronDownBold />
            </animated.span>
          </LogoButtonContent>
        </LogoButton>
      )}
    </Header>
  );
};

const [StyledDrawer, classes] = OverrideClasses(Drawer, null, {
  paper: css`
    background-color: black;
    width: 280px;
  `,
});

const NavDrawer = ({
  open = true,
  currentNavSport,
  isSelectingCurrentNavSport = false,
  onBack,
  onClose,
  children,
  ...rest
}: Props) => {
  return (
    <StyledDrawer
      open={open}
      classes={classes}
      onClose={onClose}
      {...rest}
      className="light-theme"
    >
      <NavDrawerHeader
        onBack={onBack}
        currentNavSport={currentNavSport}
        isSelectingCurrentNavSport={isSelectingCurrentNavSport}
        onClose={onClose}
      />
      <Content>
        <StyledDivider />
        {children}
      </Content>
    </StyledDrawer>
  );
};

export default NavDrawer;
