import { DialogProps, Dialog as MUIDialog } from '@material-ui/core';
import classNames from 'classnames';
import { FC, cloneElement } from 'react';
import styled, { css } from 'styled-components';

import useScreenSize from '@core/hooks/device/useScreenSize';
import HandledErrorBoundary from '@core/routing/HandledErrorBoundary';
import { breakpoints, laptopAndAbove } from '@core/style/mediaQuery';
import { OverrideClasses } from '@core/style/utils';

import CloseButton from './CloseButton';
import HandledError from './HandledError';
import Header from './Header';
import useIsScrolling from './useIsScrolling';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
`;
const BodyWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
`;
const Footer = styled.footer`
  margin-top: auto;
`;

const [StyledDialog, classes] = OverrideClasses(MUIDialog, null, {
  root: css`
    margin-top: 0;
  `,
  paper: css`
    background-color: var(--c-dialog-background);
  `,
  fullHeight: css`
    @media ${laptopAndAbove} {
      min-height: calc(100vh - 80px);
    }
  `,
  paperWidthXl: css`
    width: ${breakpoints.desktop}px;
    @media ${laptopAndAbove} {
      display: inline-flex;
      flex-direction: column;
      border-radius: 20px;
      margin: 20px auto;
    }
  `,
});

type BodyProps = {
  CloseButton: typeof CloseButton;
};
type Props = Pick<
  DialogProps,
  | 'maxWidth'
  | 'keepMounted'
  | 'disablePortal'
  | 'disableEnforceFocus'
  | 'disableEscapeKeyDown'
> & {
  children?: React.JSX.Element;
  title?: React.JSX.Element;
  hideHeader?: boolean;
  body?: FC<React.PropsWithChildren<BodyProps>> | React.JSX.Element;
  footer?: React.JSX.Element;
  open?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  errors?: { [key: string | number]: string };
  scroll?: 'body' | 'paper';
  fullWidth?: boolean;
  fullHeight?: boolean;
  fullScreen?: boolean;
  darkTheme?: boolean;
  disableBackdropClick?: boolean;
};

type CloseParams = Parameters<NonNullable<DialogProps['onClose']>>;

export const Dialog = ({
  children,
  title,
  hideHeader,
  body,
  footer,
  open,
  onBack,
  onClose,
  errors,
  scroll = 'body',
  fullWidth,
  fullHeight,
  maxWidth = 'xl',
  fullScreen,
  darkTheme,
  disableBackdropClick,
  ...rest
}: Props) => {
  const { isScrolling, clickDown, clickUp } = useIsScrolling();
  const { up: isLaptop } = useScreenSize('laptop');

  const closeDialog = (_?: CloseParams[0], reason?: CloseParams[1]) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    if (!isScrolling) {
      onClose?.();
    } else {
      clickUp();
    }
  };

  const showHeader = !hideHeader && (onBack || title || onClose);
  const content = (
    <Root>
      <div>
        {showHeader && (
          <Header
            onBack={onBack}
            title={title}
            onClose={onClose ? closeDialog : undefined}
          />
        )}
      </div>
      <BodyWrapper>
        {typeof body === 'function' ? body({ CloseButton }) : body}
      </BodyWrapper>
      <Footer>{footer}</Footer>
    </Root>
  );

  const contentToDisplay = cloneElement(
    children !== undefined ? children : content,
    {
      onClose: closeDialog,
    }
  );

  return (
    <StyledDialog
      {...rest}
      classes={{
        root: classes.root,
        paperWidthXl: classes.paperWidthXl,
        paper: classNames(classes.paper, {
          [classes.fullHeight]: fullHeight || maxWidth === 'xl',
        }),
        container: classNames({ 'dark-theme': darkTheme }),
      }}
      scroll={scroll}
      fullScreen={fullScreen ?? !isLaptop}
      maxWidth={!fullScreen && maxWidth}
      fullWidth={fullWidth}
      open={!!open}
      onMouseDown={clickDown}
      onClose={closeDialog}
    >
      {errors ? (
        <HandledErrorBoundary messages={errors} Error={HandledError}>
          {contentToDisplay}
        </HandledErrorBoundary>
      ) : (
        contentToDisplay
      )}
    </StyledDialog>
  );
};

export default Dialog;
