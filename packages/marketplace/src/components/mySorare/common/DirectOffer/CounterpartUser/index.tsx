import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Avatar from '@sorare/core/src/components/user/Avatar';
import Block from '@sorare/core/src/components/user/Block';
import DiscordUser from '@sorare/core/src/components/user/DiscordUser';
import { GalleryLink } from '@sorare/core/src/components/user/GalleryLink';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';

import { galleryPathFromToken } from '@sorare/marketplace/src/lib/galleryPathFromToken';

import {
  CounterpartUser_publicUserInfoInterface,
  CounterpartUser_tokenOffer,
} from './__generated__/index.graphql';

type Nature = 'sender' | 'receiver';

export interface Props {
  user: CounterpartUser_publicUserInfoInterface;
  offer?: CounterpartUser_tokenOffer;
  nature: Nature;
  block?: () => Promise<void>;
}

const messages = defineMessages({
  to: {
    id: 'CounterpartUser.to',
    defaultMessage: 'To',
  },
  from: {
    id: 'CounterpartUser.from',
    defaultMessage: 'From',
  },
});

const messagesPerNature: { [nature in Nature]: MessageDescriptor } = {
  sender: messages.from,
  receiver: messages.to,
} as const;

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: var(--unit);
`;
const UserInfo = styled.div`
  flex: 1;
  color: var(--c-neutral-800);
`;
const UserOrigin = styled.div`
  display: flex;
  gap: var(--half-unit);
`;
const TimeLeftCtn = styled.div`
  display: flex;
  font: var(--t-14);
  color: var(--c-neutral-600);
  gap: var(--half-unit);
`;

const DisabledStyledLink = styled.span`
  color: var(--c-neutral-1000);
  opacity: 0.5;
`;

const DiscordUserWrapper = styled.div`
  color: var(--c-neutral-600);
  font: var(--t-14);
`;

export const CounterpartUser = (props: Props) => {
  const { offer, user, nature, block } = props;
  const { formatMessage } = useIntl();
  const { profile } = user;

  return (
    <Container>
      <Avatar user={user} variant="medium" />
      <UserInfo>
        <UserOrigin>
          <Text16>{formatMessage(messagesPerNature[nature])}</Text16>
          <GalleryLink
            user={user}
            WhenSuspended={DisabledStyledLink}
            galleryPathFactory={({ slug }) =>
              galleryPathFromToken(
                slug,
                offer?.senderSide.nfts[0] || offer?.receiverSide.nfts[0]
              )
            }
          >
            <Text16 bold as="div">
              <Nickname user={user} />
            </Text16>
          </GalleryLink>
          {block && <Block user={user} block={block} />}
        </UserOrigin>
        <DiscordUserWrapper>
          {profile && <DiscordUser userProfile={profile} />}
        </DiscordUserWrapper>
      </UserInfo>
      {offer?.status &&
        ['minted', 'opened', 'pending_rejection'].includes(offer?.status) && (
          <TimeLeftCtn>
            <FormattedMessage
              id="CounterpartUser.timeleft"
              defaultMessage="{timeleft} left"
              values={{
                timeleft: <TimeLeft time={parseISO(offer.endDate)} />,
              }}
            />
          </TimeLeftCtn>
        )}
    </Container>
  );
};

CounterpartUser.fragments = {
  user: gql`
    fragment CounterpartUser_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Avatar_publicUserInfoInterface
      ...BlockButton_publicUserInfoInterface
      nickname
      profile {
        id
        ...DiscordUser_userProfile
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${DiscordUser.fragments.userProfile}
    ${Block.fragments.user}
  `,
  tokenOffer: gql`
    fragment CounterpartUser_tokenOffer on TokenOffer {
      id
      status
      endDate
      receiverSide {
        id
        nfts {
          slug
          assetId
          sport
        }
      }
      senderSide {
        id
        nfts {
          slug
          assetId
          sport
        }
      }
    }
  `,
};

export default CounterpartUser;
