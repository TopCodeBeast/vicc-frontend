import { faBell, faClose } from '@fortawesome/pro-solid-svg-icons';
import { Badge, Drawer as MuiDrawer } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import DialogContentWithNavigation from '@core/atoms/layout/DialogContentWithNavigation';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text14, Text16 } from '@core/atoms/typography';
import Notification from '@core/components/activity/Notification';
import { ACTIVITY } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useInGameNotificationContext } from '@core/contexts/inGameNotification';
import useToggle from '@core/hooks/useToggle';
import MenuIconButton from '@core/routing/MultiSportAppBar/MenuIconButton';
import { theme } from '@core/style/theme';
import { OverrideClasses } from '@core/style/utils';

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
