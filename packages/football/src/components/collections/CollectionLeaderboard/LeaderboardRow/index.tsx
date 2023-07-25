import { gql } from '@apollo/client';
import classnames from 'classnames';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import { Score } from '@sorare/core/src/components/collections/Score';
import Avatar from '@sorare/core/src/components/user/Avatar';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { FOOTBALL_USER_CARD_COLLECTION_CARDS } from '@sorare/core/src/constants/routes';

import { CardsNumber } from '@football/components/collections/CardsNumber';
import ClubShield from '@football/components/user/ClubShield';

import { LeaderboardRow_userCardCollection } from './__generated__/index.graphql';

const Root = styled.div`
  --outline-width: 2px;
  display: grid;
  align-items: center;
  grid-template-areas:
    'rank logo name score'
    'rank logo club cards';
  grid-template-columns: var(--triple-unit) min-content 1fr min-content;
  column-gap: var(--double-unit);
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);
  padding: var(--intermediate-unit);
  text-align: left;
  width: 100%;
  &.highlighted {
    position: sticky;
    top: calc(var(--double-unit) + var(--outline-width));
    bottom: calc(var(--double-unit) + var(--outline-width));
    outline: var(--outline-width) solid var(--c-brand-600);
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-brand-600), 0.4) 0%,
        rgba(var(--c-rgb-brand-600), 0.4) 100%
      ),
      var(--c-neutral-200);
  }
`;
const Rank = styled.div`
  grid-area: rank;
  justify-self: center;
`;
const AvatarWrapper = styled.div`
  grid-area: logo;
`;
const Name = styled(Text14)`
  grid-area: name;
`;
const ClubWrapper = styled.div`
  grid-area: club;
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;
const CardsWrapper = styled.div`
  grid-area: cards;
  color: var(--c-neutral-600);
`;
const ScoreWrapper = styled.div`
  grid-area: score;
`;

type Props = {
  userCardCollection: LeaderboardRow_userCardCollection;
  slotsCount: number;
  collectionSlug: string;
  highlighted?: boolean;
};
const LeaderboardRow = ({
  userCardCollection,
  slotsCount,
  highlighted,
  collectionSlug,
}: Props) => {
  const { liveRanking, fulfilledSlotsCount, score, user } = userCardCollection;
  const { slug: userSlug } = user;

  return (
    <Root
      className={classnames({ highlighted })}
      as={Link}
      to={generatePath(FOOTBALL_USER_CARD_COLLECTION_CARDS, {
        slug: userSlug,
        collectionSlug,
      })}
    >
      <Rank>{liveRanking}</Rank>
      <AvatarWrapper>
        <Avatar variant="medium" user={user} />
      </AvatarWrapper>
      <Name bold>
        <Nickname user={user} />
      </Name>
      <ClubWrapper>
        <ClubShield size="small" userProfile={user.profile} />
        <Caption color="var(--c-neutral-600)">{user.profile.clubName}</Caption>
      </ClubWrapper>
      <CardsWrapper>
        <CardsNumber ownedCards={fulfilledSlotsCount} totalCards={slotsCount} />
      </CardsWrapper>
      <ScoreWrapper>
        <Score score={score} />
      </ScoreWrapper>
    </Root>
  );
};

LeaderboardRow.fragments = {
  userCardCollection: gql`
    fragment LeaderboardRow_userCardCollection on UserCardCollection {
      id
      liveRanking
      score
      fulfilledSlotsCount
      user {
        slug
        profile {
          id
          clubName
          ...ClubShield_userProfile
        }
        ...Avatar_publicUserInfoInterface
        ...Nickname_publicUserInfoInterface
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${Nickname.fragments.user}
    ${ClubShield.fragments.userProfile}
  `,
};

export default LeaderboardRow;
