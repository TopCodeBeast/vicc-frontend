import { DrawerProps, Drawer as MuiDrawer } from '@material-ui/core';
import { ReactNode } from 'react';
import { css } from 'styled-components';

import DialogContentWithNavigation from '@core/atoms/layout/DialogContentWithNavigation';
import { tabletAndAbove } from '@core/style/mediaQuery';
import { OverrideClasses } from '@core/style/utils';

interface Props extends DrawerProps {
  contentTitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  backButton?: ReactNode;
}

const [Drawer, classes] = OverrideClasses(MuiDrawer, null, {
  drawerRoot: css`
    height: 100%;
  `,
  paper: css`
    position: absolute;
    width: 100%;

    .dark-theme & {
      background-color: var(--c-neutral-200);
      color: var(--c-neutral-1000);
    }
    @media ${tabletAndAbove} {
      width: 370px;
    }
  `,
});

export const DrawerWithNavigation = (props: Props) => {
  const { children, backButton, contentTitle, right, ...drawerProps } = props;

  return (
    <Drawer
      {...drawerProps}
      classes={{
        root: classes.drawerRoot,
        paper: classes.paper,
      }}
      variant="temporary"
    >
      <DialogContentWithNavigation
        title={contentTitle}
        backButton={backButton}
        right={right}
        stickyHeader
      >
        {children}
      </DialogContentWithNavigation>
    </Drawer>
  );
};

export default DrawerWithNavigation;
