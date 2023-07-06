import { faLink, faSearch, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Snackbar, SnackbarOrigin } from '@material-ui/core';
import { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { glossary } from '@core/lib/glossary';
import { OverrideClasses } from '@core/style/utils';

import { Level, SnackNotificationOptions } from '..';
import { Message } from '../SnackMessage';

type Props = {
  notification: string | null;
  onClose: () => void;
  opts?: SnackNotificationOptions;
  className?: string;
  anchorOrigin?: SnackbarOrigin;
};

const Close = styled(IconButton)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: var(--c-neutral-1000);
  font-size: 16px;
  height: 30px;
  width: 30px;
  background: var(--c-neutral-100);
  &:hover {
    background: var(--c-neutral-100);
  }
` as typeof IconButton;

const [Root, classes] = OverrideClasses(
  Snackbar,
  css`
    max-width: calc(100% - 15px);
    margin: auto;
  `,
  {
    root: css`
      align-items: center;
      background-color: var(--c-dialog-background);
      backdrop-filter: blur(2px);
      color: var(--c-neutral-1000);
      flex-wrap: nowrap;
      padding: 15px 15px;
      width: max-content;
      word-break: break-word;
      .dark-theme & {
        border: 1px solid var(--c-neutral-400);
      }
    `,
    action: css`
      padding-left: 0;
      margin-right: 0;
    `,
    message: css`
      padding: 0;
    `,
  }
);

export const SnackNotification = ({
  onClose,
  notification,
  opts = {},
  className,
  anchorOrigin = { vertical: 'top', horizontal: 'center' },
}: Props) => {
  const { formatMessage } = useIntl();
  const { link, internalLink, autoHideDuration, level = Level.INFO } = opts;
  const defaultAutoHideDuration = link || internalLink ? null : 5000;

  const Action = () => (
    <Fragment key="action">
      {link && (
        <Box ml={1.5}>
          <Close
            key="details"
            aria-label="Details"
            color="inherit"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faSearch} />
          </Close>
        </Box>
      )}
      {internalLink && (
        <Box ml={1.5}>
          <Close
            key="details"
            aria-label="Details"
            color="inherit"
            component={Link}
            to={internalLink}
          >
            <FontAwesomeIcon icon={faLink} />
          </Close>
        </Box>
      )}
      <Box ml={1.5}>
        <Close
          key="close"
          aria-label={formatMessage(glossary.close)}
          color="inherit"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Close>
      </Box>
    </Fragment>
  );

  return (
    <Root
      key={notification!}
      anchorOrigin={anchorOrigin}
      open={Boolean(notification)}
      autoHideDuration={
        typeof autoHideDuration !== 'undefined'
          ? autoHideDuration
          : defaultAutoHideDuration
      }
      onClose={onClose}
      className={className}
      ContentProps={{
        'aria-describedby': 'message-id',
        classes,
      }}
      message={
        <Message id="message-id" notification={notification} level={level} />
      }
      action={<Action />}
    />
  );
};

export default SnackNotification;
