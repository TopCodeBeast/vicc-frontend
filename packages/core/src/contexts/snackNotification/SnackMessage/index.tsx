import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';

import { Level } from '..';

export const Message = ({
  id,
  level,
  notification,
}: {
  id?: string;
  level: Level;
  notification: ReactNode;
}) => {
  if (!notification) {
    return null;
  }
  switch (level) {
    case Level.ERROR:
    case Level.WARN:
      return (
        <Box id={id} display="flex" alignItems="center" flexWrap="noWrap">
          <Box
            mr={1.5}
            color={level === Level.ERROR ? 'error.main' : 'warning.main'}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
          </Box>
          <span>{notification}</span>
        </Box>
      );
    default:
      return <span>{notification}</span>;
  }
};
