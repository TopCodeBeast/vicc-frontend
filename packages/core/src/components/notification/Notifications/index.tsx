import { faBell, faClose } from '@fortawesome/pro-solid-svg-icons';
import { Badge, Drawer as MuiDrawer } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import DialogContentWithNavigation from '@sorare/core/src/atoms/layout/DialogContentWithNavigation';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Notification from 'components/activity/Notification';
import { ACTIVITY } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useInGameNotificationContext } from '@sorare/core/src/contexts/inGameNotification';
import useToggle from '@sorare/core/src/hooks/useToggle';
import MenuIconButton from '@sorare/core/src/routing/MultiSportAppBar/MenuIconButton';
import { useAppBarContext } from '@sorare/core/src/routing/MultiSportAppBar/context';
import { theme } from '@sorare/core/src/style/theme';
import { OverrideClasses } from '@sorare/core/src/style/utils';

const [Drawer, classes] = OverrideClasses(MuiDrawer, null, {
  paper: css`
    width: 100%;
    background-color: var(--c-neutral-200);
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      width: 370px;
    }
  `,
});

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const NotificationsContainer = styled.div`
  flex: 1;
`;
const StyledLink = styled(Link)`
  padding: var(--double-unit);
`;
const StyledText14 = styled(Text14)`
  display: inline-flex;
  gap: var(--half-unit);
`;

export const Notifications = () => {
  const [open, toggleOpen] = useToggle(false);
  const { currentUser } = useCurrentUserContext();
  const { small } = useAppBarContext();
  const {
    notifications,
    loading: notificationLoading,
    markNotificationsAsRead,
    unreadNotifications,
  } = useInGameNotificationContext();

  if (!currentUser) {
    return null;
  }

  const onClose = () => {
    toggleOpen();
    markNotificationsAsRead(notifications);
  };

  const nbNotificationsUnreadNotShown =
    unreadNotifications -
    notifications.filter(notification => !notification.read).length;

  return (
    <>
      <Badge badgeContent={unreadNotifications} overlap="circular">
        <MenuIconButton
          icon={faBell}
          disableRipple={small}
          aria-haspopup="true"
          onClick={toggleOpen}
          active={open}
        />
      </Badge>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={open}
        onClose={onClose}
      >
        <InnerContainer>
          <DialogContentWithNavigation
            title={
              <Text16 bold>
                <FormattedMessage
                  id="Notification.Notifications.notifications"
                  defaultMessage="Notifications"
                />
              </Text16>
            }
            right={
              <IconButton
                color="darkGray"
                onClick={onClose}
                icon={faClose}
                small
              />
            }
            footer={
              <StyledLink to={ACTIVITY} onClick={onClose}>
                <StyledText14 color="var(--c-brand-300)" bold>
                  <FormattedMessage
                    id="Notifications.viewAll"
                    defaultMessage="View all incoming activity"
                  />
                  {!!nbNotificationsUnreadNotShown && (
                    <span>({nbNotificationsUnreadNotShown})</span>
                  )}
                </StyledText14>
              </StyledLink>
            }
            stickyHeader
            noPadding
          >
            <NotificationsContainer>
              {notificationLoading && <LoadingIndicator small />}
              {notifications!.map(notification => (
                <Notification
                  key={notification.id}
                  notification={notification}
                  onClick={onClose}
                  inModale
                />
              ))}
            </NotificationsContainer>
          </DialogContentWithNavigation>
        </InnerContainer>
      </Drawer>
    </>
  );
};

export default Notifications;
