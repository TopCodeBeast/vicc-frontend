import { animated, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import {
  Drawer as DumbDrawer,
  Props as DumbDrawerProps,
} from '@sorare/core/src/atoms/layout/Drawer';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { theme } from '@sorare/core/src/style/theme';

const DrawerContent = styled(animated.aside)`
  color: var(--c-neutral-1000);
  position: relative;
  z-index: 1;
  overflow: auto;
  width: 340px;
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    width: 440px;
  }
`;

export type Props = DumbDrawerProps;

const Drawer = ({ open, children }: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');
  const panelTransitions = useTransition(open, {
    from: { width: 0, opacity: 0 },
    enter: { width: isLaptop ? 480 : 340, opacity: 1 },
    leave: { width: 0, opacity: 0 },
    reverse: open,
  });

  return isLaptop ? (
    panelTransitions((styles, isOpen) => {
      return isOpen && <DrawerContent style={styles}>{children}</DrawerContent>;
    })
  ) : (
    <DumbDrawer side="bottom" open={open}>
      {children}
    </DumbDrawer>
  );
};

export default Drawer;
