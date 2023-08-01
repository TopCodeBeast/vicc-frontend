import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import { generateUserGroupInviteLink } from '@football/lib/so5';
import Field from '@football/pages/Lobby/Components/UserGroup/UserGroupInvitation/Field';

import cards from './cards.svg';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--c-static-neutral-800);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--double-unit);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Message = styled.div`
  margin-left: var(--double-unit);
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;

  span.highlighted {
    color: white;
  }
`;

const Cta = styled.div`
  width: 450px;
  max-width: 100%;
`;

const Highlighted = (...chunks: string[]) => {
  return <span className="highlighted">{chunks}</span>;
};

type Props = {
  joinSecret: string;
  so5UserGroupId: string;
  so5LeaderboardType?: string;
};
const Banner = ({ joinSecret, so5UserGroupId, so5LeaderboardType }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const {
    flags: { useSo5UserGroupsInvitationBannerWithPrize = true },
  } = useFeatureFlags();
  const track = useEvents();

  const currentUserSlug = currentUser?.slug;
  const inviteLink = useMemo(
    () =>
      generateUserGroupInviteLink(
        joinSecret,
        currentUserSlug,
        so5LeaderboardType
      ),
    [joinSecret, currentUserSlug, so5LeaderboardType]
  );

  const message = useSo5UserGroupsInvitationBannerWithPrize
    ? {
        id: 'UserGroupInvitation.Banner.HeaderWithPrize',
        defaultMessage:
          '<highlighted>Invite a friend</highlighted>, for a chance{br}at winning a <highlighted>blockchain Card</highlighted>',
      }
    : {
        id: 'UserGroupInvitation.Banner.Header',
        defaultMessage: '<highlighted>Invite a friend</highlighted>',
      };

  return (
    <Root>
      <Header>
        <img src={cards} alt="Cards" />
        <Message>
          <FormattedMessage
            {...message}
            values={{
              highlighted: Highlighted,
              br: <br />,
            }}
          />
        </Message>
      </Header>
      <Cta>
        <Field
          inviteLink={inviteLink}
          onClick={() => {
            track('Click Share', {
              so5UserGroupId: idFromObject(so5UserGroupId),
            });
          }}
          so5LeaderboardType={so5LeaderboardType}
        />
      </Cta>
    </Root>
  );
};

export default Banner;
