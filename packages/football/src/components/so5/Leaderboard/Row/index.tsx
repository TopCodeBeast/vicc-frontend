import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  LinkBox,
  LinkOther,
  LinkOverlay,
} from '@sorare/core/src/atoms/navigation/Box';
import { Text16, Text18 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import ActiveUserAvatar from '@sorare/core/src/components/user/ActiveUserAvatar';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import defaultBanner from '@football/assets/club/banner_none.jpg';
import ClubShield from '@football/components/user/ClubShield';

import { Row_vicc5Ranking } from './__generated__/index.graphql';

type Props = {
  manager: Row_vicc5Ranking;
  highlight: boolean;
  onClick: (id: string) => void;
};

const Root = styled(LinkBox)`
  isolation: isolate;
  position: relative;
  padding: var(--unit);
  display: grid;
  grid: repeat(2, 1fr) / minmax(min-content, 30px) 40px 10fr max-content;
  column-gap: var(--unit);
  align-items: center;
  width: 100%;
  grid-template-areas:
    'rank avatar name score'
    'rank avatar club score';
  border-radius: var(--unit);
  background: linear-gradient(
      90deg,
      rgba(var(--c-static-rgb-neutral-800), var(--opacity, 0.4)) 5.25%,
      var(--c-static-neutral-800) 70%,
      var(--c-static-neutral-800) 100%
    ),
    var(--banner);
  background-size: cover, cover;
  cursor: pointer;
  text-align: left;
  color: var(--c-static-neutral-100);

  &.highlight {
    outline: 4px solid var(--c-brand-600);
  }

  &:hover,
  &:focus-within {
    --opacity: 0.1;
  }

  @media ${tabletAndAbove} {
    padding: var(--double-unit);
  }
`;

const Rank = styled(Text16)`
  grid-area: rank;
  text-align: center;
`;

const AvatarContainer = styled(LinkOther)`
  grid-area: avatar;
`;

const Name = styled(Text16)`
  grid-area: name;
  text-align: left;
`;

const Club = styled.div`
  grid-area: club;
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

const Score = styled(Text18)`
  grid-area: score;
  text-align: center;
`;

const Row = ({ manager, highlight, onClick }: Props) => {
  const { id, ranking, score, vicc5Lineup } = manager;
  const { user, cancelledAt } = vicc5Lineup;
  const { clubBanner } = user.profile;

  const isCancelled = !!cancelledAt;
  return (
    <Root
      className={classnames({ highlight })}
      style={
        {
          '--banner': `url(${clubBanner?.pictureUrl || defaultBanner})`,
        } as React.CSSProperties
      }
    >
      <Rank bold>{isCancelled ? '-' : ranking}</Rank>
      <AvatarContainer as="div">
        <ActiveUserAvatar user={user} variant="medium" />
      </AvatarContainer>
      <LinkOverlay as="button" type="button" onClick={() => onClick(id)}>
        <Name bold>
          <Nickname user={user} />
        </Name>
      </LinkOverlay>
      <Club>
        <ClubShield size="small" userProfile={user.profile} />
        <Text16>{user.profile.clubName}</Text16>
      </Club>
      {isCancelled ? (
        <Chip
          label={<FormattedMessage {...glossary.canceled} />}
          custom={{
            color: 'white',
            background: 'var(--c-red-600)',
          }}
          size="smaller"
        />
      ) : (
        <Score bold>
          <FormattedMessage {...fantasy.points} values={{ score }} />
        </Score>
      )}
    </Root>
  );
};

Row.fragments = {
  vicc5Ranking: gql`
    fragment Row_vicc5Ranking on Vicc5Ranking {
      id
      ranking
      score
      vicc5Lineup {
        id
        cancelledAt
        user {
          id
          slug
          ...ActiveUserAvatar_user
          profile {
            id
            clubName
            clubBanner {
              id
              pictureUrl
            }
            ...ClubShield_userProfile
          }
        }
      }
    }
    ${ActiveUserAvatar.fragments.user}
    ${ClubShield.fragments.userProfile}
  ` as TypedDocumentNode<Row_vicc5Ranking>,
};

export default Row;
