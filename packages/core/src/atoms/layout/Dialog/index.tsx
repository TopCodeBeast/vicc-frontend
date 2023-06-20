import { Divider, Dialog as MuiDialog } from '@material-ui/core';
import { DialogProps } from '@material-ui/core/Dialog/Dialog';
import classnames from 'classnames';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import BackButton from '@sorare/core/src/atoms/buttons/BackButton';
import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { theme } from '@sorare/core/src/style/theme';
import { OverrideClasses } from '@sorare/core/src/style/utils';

import Actions from './Actions';

export interface Props extends Omit<DialogProps, 'title' | 'classes'> {
  onClose?: (...args: any[]) => void;
  title?: string | ReactNode;
  hideCloseButton?: boolean;
  transparentCloseButton?: boolean;
  noHeader?: boolean;
  hideScrollBar?: boolean;
  onBack?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  isDrawer?: boolean;
  noDivider?: true;
  noMargin?: boolean;
  shadowFooter?: boolean;
  className?: string;
  headerCentered?: boolean;
}

const DialogContent = styled.div`
  max-height: calc(100% - 20px);
  overflow: auto;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: 20px 0px;
  position: relative;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0px 20px;
  &.onBack {
    justify-content: center;
  }
  &.onClose {
    padding-right: 50px;
  }
  &.headerCentered {
    justify-content: center;
    &.onClose {
      padding-left: 50px;
    }
  }
`;
const Back = styled.div`
  position: absolute;
  left: 0;
`;
const Close = styled.div`
  position: absolute;
  right: 0;
`;
const CloseNoHeader = styled.div`
  position: absolute;
  top: var(--unit);
  right: var(--unit);
`;
const Content = styled.div`
  --marginBottom: 20;
  margin: 20px 20px calc(var(--marginBottom) * 1px);
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 20px - var(--marginBottom) * 1px);
  overflow: auto;
  &.noMargin {
    margin: 0;
  }
`;
const Footer = styled.div`
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0px 20px;
  &.shadowFooter {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: unset;
    margin: 0;
    padding: 20px;
    justify-content: stretch;
    box-shadow: 0px 14px 50px rgba(0, 0, 0, 0.2);
  }
`;

const [StyledDialog, classes] = OverrideClasses(MuiDialog, null, {
  paper: css`
    min-width: min(480px, 100vw - 20px);
    width: min-content;
    max-width: calc(100vw - 20px);
    margin: 10px;
    background-color: var(--c-dialog-background);
  `,
  drawerPaper: css`
    margin: 0;
    max-height: 100%;
    max-width: 100%;
    height: 100%;
    width: 100%;
    border-radius: 0;
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      margin: 10px;
      max-height: calc(100% - 20px);
      max-width: calc(100vw - 20px);
      height: auto;
      width: min-content;
      border-radius: 8px;
    }
  `,
  paperScrollPaper: css`
    max-height: calc(100% - 20px);
  `,
  paperFullScreen: css`
    margin: 0;
    max-width: unset;
    width: 100%;
    max-height: 100%;
    & ${DialogContent} {
      height: 100%;
      max-height: 100%;
    }
    & ${Content} {
      flex-grow: 1;
      max-height: 100%;
    }
  `,
  drawerContainer: css`
    justify-content: flex-end;
    align-items: flex-start;
    max-width: ${theme.layout.appBarWidth}px;
    height: 100%;
    margin: 0;
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      height: calc(100% - 45px);
      margin: ${theme.layout.drawerContainerMargin}px;
      padding-right: 10px;
    }
  `,
});

export const Dialog = (props: Props) => {
  const {
    children,
    onClose,
    onBack,
    title,
    hideCloseButton,
    transparentCloseButton,
    noHeader,
    maxWidth = false,
    hideScrollBar,
    header,
    footer,
    open,
    isDrawer,
    noDivider = false,
    noMargin,
    shadowFooter,
    className,
    headerCentered,
    ...rest
  } = props;

  const showHeader = !noHeader && (title || (onClose && !hideCloseButton));

  return (
    <StyledDialog
      {...rest}
      open={open}
      disableEnforceFocus
      onClose={onClose}
      classes={{
        paper: classnames(
          classes.paper,
          { hiddenScrollbars: !!hideScrollBar },
          isDrawer && classes.drawerPaper
        ),
        paperScrollPaper: classes.paperScrollPaper,
        paperFullScreen: classes.paperFullScreen,
        ...(isDrawer && {
          container: classes.drawerContainer,
        }),
        root: className,
      }}
      maxWidth={maxWidth}
    >
      <DialogContent>
        {header}
        {!header && showHeader && (
          <Header
            className={classnames({
              onBack,
              onClose,
              headerCentered,
            })}
          >
            {onBack && (
              <Back>
                <BackButton onClick={onBack} />
              </Back>
            )}
            {typeof title === 'string' ? <Text16 bold>{title}</Text16> : title}
            {onClose && !hideCloseButton && (
              <Close>
                <CloseButton
                  menu
                  transparent={transparentCloseButton}
                  onClose={onClose}
                />
              </Close>
            )}
          </Header>
        )}
        {!showHeader && onClose && !hideCloseButton && (
          <CloseNoHeader>
            <CloseButton
              menu
              transparent={transparentCloseButton}
              onClose={onClose}
            />
          </CloseNoHeader>
        )}
        {(title || header) && !noDivider && <Divider />}
        <Content className={classnames({ noMargin })}>{children}</Content>
        {footer && (
          <Footer className={classnames({ shadowFooter })}>{footer}</Footer>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export { Actions };

export default Dialog;
