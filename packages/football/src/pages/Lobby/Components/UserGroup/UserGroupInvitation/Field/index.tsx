import styled from 'styled-components';

import SocialShare from '@sorare/core/src/components/user/SocialShare';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { generateUserGroupInvitationWording } from '@football/lib/so5';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-300);
  padding: var(--unit);
  gap: var(--half-unit);
  color: var(--c-neutral-1000);
  overflow: hidden;
`;
const OpacityFilter = styled.span`
  opacity: 0.6;
  white-space: nowrap;
  overflow-x: auto;
`;
const ShareLabel = styled.span`
  display: none;
  @media ${tabletAndAbove} {
    display: inline-block;
    margin-left: var(--unit);
  }
`;

type Props = {
  inviteLink: string;
  onClick?: () => void;
  blue?: boolean;
  so5LeaderboardType?: string;
};
const Field = ({
  inviteLink,
  onClick,
  blue = true,
  so5LeaderboardType,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const { title, message, values } =
    generateUserGroupInvitationWording(so5LeaderboardType);
  return (
    <Root>
      <OpacityFilter>{inviteLink.replace(/^https?:\/\//, '')}</OpacityFilter>
      <SocialShare
        url={inviteLink}
        title={formatMessage(title)}
        message={formatMessage(message, values)}
        trackingEventName={socialShareEventName.SHARE_USER_GROUP}
        trackingEventContext={socialShareEventContext.USER_GROUP_INVITE_FRIENDS}
        renderButton={({ ShareButton, Icon, label }) => (
          <div>
            <ShareButton
              medium
              color={blue ? 'blue' : 'black'}
              onClick={onClick}
            >
              {Icon}
              <ShareLabel>{label}</ShareLabel>
            </ShareButton>
          </div>
        )}
      />
    </Root>
  );
};

export default Field;
