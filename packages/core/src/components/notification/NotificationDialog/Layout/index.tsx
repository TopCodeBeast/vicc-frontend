import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { glossary } from '@core/lib/glossary';
import { tabletAndAbove } from '@core/style/mediaQuery';
import { theme } from '@core/style/theme';

type Props = {
  onClose: (all?: boolean) => void;
  onClick?: () => void;
  title?: string;
  message?: ReactNode;
  children: ReactNode;
  cta?: MessageDescriptor;
  className?: string;
};

const Overlay = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.9);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${theme.zIndex.modal};
  opacity: 0;
  transition: all ease-in 0.2s;
  &.visible {
    opacity: 1;
  }
`;
const Root = styled.div`
  position: relative;
  background: white;
  margin: 10px;
  width: calc(100% - 20px);
  border: 1px solid var(--c-neutral-300);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;

  @media ${tabletAndAbove} {
    width: initial;
    min-width: 480px;
  }

  transform: scale(0.6);
  transition: all cubic-bezier(0.01, 0.07, 0.45, 1.4) 0.3s;

  &.visible {
    transform: scale(1);
    opacity: 1;
  }
`;
const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 30px;
  min-width: 30px;
  padding: 0;
`;
const Content = styled.div`
  padding: 30px 20px 20px 20px;
  text-align: center;
`;
const Cta = styled.div`
  margin-bottom: 30px;
  width: 100%;
  border-radius: 16px;
  text-align: center;
  & * + * {
    margin-left: 10px;
  }
`;

export const Layout = ({
  onClose,
  onClick,
  children,
  cta,
  className,
}: Props) => {
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);

  const onCloseDialog = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  const onOverlayClose = useCallback(
    e => {
      if (e.target !== e.currentTarget) return;
      onCloseDialog();
    },
    [onCloseDialog]
  );

  const onKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') {
        onCloseDialog();
      }
    },
    [onCloseDialog]
  );

  const handleSubmit = useCallback(() => {
    if (typeof onClick === 'function') onClick();
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  }, [onClick, onClose]);

  useEffect(() => {
    const toggleVisible = setTimeout(() => setVisible(true));
    return () => clearTimeout(toggleVisible);
  }, []);

  return (
    <Overlay
      onClick={onOverlayClose}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Skip notification"
      className={classnames({ visible })}
    >
      <Root className={classnames(className, { visible })}>
        <CloseButton
          onClick={onCloseDialog}
          medium
          color="gray"
          aria-label={formatMessage(glossary.close)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <Content>{children}</Content>
        {cta && (
          <Cta>
            <Button onClick={handleSubmit} medium color="blue">
              <FormattedMessage {...cta} />
            </Button>
          </Cta>
        )}
      </Root>
    </Overlay>
  );
};

export default Layout;
