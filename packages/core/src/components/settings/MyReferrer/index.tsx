import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import Avatar from '@core/components/user/Avatar';
import { GalleryLink } from '@core/components/user/GalleryLink';
import { Nickname } from '@core/components/user/Nickname';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';

import SettingsSection from '../SettingsSection';

const messages = defineMessages({
  title: {
    id: 'Settings.myReferrer.title',
    defaultMessage: 'My Referrer',
  },
});

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-600);
`;

export const MyReferrer = () => {
  const { formatDate } = useIntlContext();
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;
  const { referrer } = currentUser;
  if (!referrer) return null;

  return (
    <SettingsSection title={messages.title}>
      <Root>
        <Avatar user={referrer} variant="medium" />
        <div>
          <Text16>{formatDate(referrer.createdAt)}</Text16>
          <GalleryLink user={referrer}>
            <Text16>
              <Nickname user={referrer} />
            </Text16>
          </GalleryLink>
        </div>
      </Root>
    </SettingsSection>
  );
};

export default MyReferrer;
