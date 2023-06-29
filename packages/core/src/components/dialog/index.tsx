import { DialogProps, Dialog as MUIDialog } from '@material-ui/core';
import classNames from 'classnames';
import { FC, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import useScreenSize from '@core/hooks/device/useScreenSize';
import { useBgLocation } from '@core/hooks/useBgLocation';
import HandledErrorBoundary from '@core/routing/HandledErrorBoundary';
import { laptopAndAbove } from '@core/style/mediaQuery';
import { theme } from '@core/style/theme';
import { OverrideClasses } from '@core/style/utils';

import CloseButton from './CloseButton';
import HandledError from './HandledError';
import Header from './Header';
import useIsScrolling from './useIsScrolling';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const BodyWrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
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
    width: ${theme.breakpoints.values.desktop}px;
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
type Props = {
  children?: JSX.Element;
  title?: JSX.Element;
  hideHeader?: boolean;
  body?: FC<BodyProps> | JSX.Element;
  footer?: JSX.Element;
  open?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  errors?: { [key: string | number]: string };
  defaultBackUrl?: string;
  scroll?: 'body' | 'paper';
  fullWidth?: boolean;
  fullHeight?: boolean;
  maxWidth?: DialogProps['maxWidth'];
  fullScreen?: boolean;
  darkTheme?: boolean;
  keepMounted?: DialogProps['keepMounted'];
  disablePortal?: DialogProps['disablePortal'];
};
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
  defaultBackUrl = '',
  scroll = 'body',
  fullWidth,
  fullHeight,
  maxWidth = 'xl',
  fullScreen,
  darkTheme,
  ...rest
}: Props) => {
  const navigate = useNavigate();
  const location = useBgLocation();
  const { isScrolling, clickDown, clickUp } = useIsScrolling();
  const { up: isLaptop } = useScreenSize('laptop');

  const closeDialog = () => {
    if (!isScrolling) {
      if (onClose) {
        onClose();
      } else {
        const destinationUrl = location?.pathname
          ? location.pathname + (location?.search || '')
          : defaultBackUrl;
        navigate(destinationUrl);
      }
    } else {
      clickUp();
    }
  };

  const showHeader = !hideHeader && (onBack || title || onClose);
  const content = (
    <Root>
      <div>
        {showHeader && (
          <Header onBack={onBack} title={title} onClose={closeDialog} />
        )}
      </div>
      <BodyWrapper>
        {typeof body === 'function' ? body({ CloseButton }) : body}
      </BodyWrapper>
      <div>{footer}</div>
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
      fullScreen={!isLaptop || fullScreen}
      maxWidth={!fullScreen ? maxWidth : false} //Modifed****
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
