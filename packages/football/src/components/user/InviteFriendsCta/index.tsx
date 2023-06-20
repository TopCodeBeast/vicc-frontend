import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import {
  SocialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { theme } from '@sorare/core/src/style/theme';

const messages = defineMessages({
  share: {
    id: 'InviteFriendsCta.shareLink',
    defaultMessage: 'Share your link',
  },
});

interface Props {
  source: SocialShareEventContext;
}

const Root = styled.div`
  display: flex;
  padding: var(--unit);
  flex-direction: column;
  color: var(--c-neutral-600);
  background-color: var(--c-neutral-300);
  border: 1px solid var(--c-neutral-400);
  border-radius: 2em;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--double-unit);
    padding: 0;
  }
`;
const Copy = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
  padding: 0 var(--unit);
  flex-direction: row;
  overflow: hidden;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: 0;
  }
`;
const ReferralLinkAddress = styled.span`
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--c-neutral-1000);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    padding: 0 var(--double-unit);
  }
`;
const ButtonCopy = styled(Button)`
  color: var(--c-neutral-1000);
  &:hover {
    background: var(--c-neutral-200);
    color: var(--c-neutral-1000);
  }
`;

export const InviteFriendsCta = (props: Props) => {
  const { source } = props;
  const { formatMessage } = useIntlContext();
  const { currentUser } = useCurrentUserContext();
  const track = useEvents();

  if (!currentUser) return null;

  const referralUrl = currentUser?.referralUrl || '';

  const trackClick = () => {
    track('Click Invite Friends', { source });
  };

  const copyToClipboardAndTrack = () => {
    navigator.clipboard.writeText(referralUrl);
    trackClick();
  };

  return (
    <Root>
      <Copy>
        <ReferralLinkAddress>{referralUrl}</ReferralLinkAddress>
        {navigator.clipboard && (
          <ButtonCopy medium onClick={copyToClipboardAndTrack}>
            <Text16 bold>
              <FormattedMessage
                id="InvitationLinks.copyLink"
                defaultMessage="Copy"
              />
            </Text16>
          </ButtonCopy>
        )}
      </Copy>
      <SocialShare
        url={referralUrl}
        title={formatMessage(messages.share)}
        trackingEventName={socialShareEventName.SHARE_REFERRAL}
        trackingEventContext={source}
        renderButton={({ ShareButton, label }) => (
          <ShareButton color="blue" medium onClick={trackClick}>
            {label}
          </ShareButton>
        )}
      />
    </Root>
  );
};

export default InviteFriendsCta;
