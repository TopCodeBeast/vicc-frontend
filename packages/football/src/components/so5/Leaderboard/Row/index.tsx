import { gql } from '@apollo/client';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Text18 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import Avatar from '@sorare/core/src/components/user/Avatar';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import defaultBanner from 'assets/club/banner_none.jpg';
import ClubShield from '@sorare/football/src/components/user/ClubShield';

import { Row_so5Ranking } from './__generated__/index.graphql';

type Props = {
  manager: Row_so5Ranking;
  highlight: boolean;
  onClick: (id: string) => void;
};

const Root = styled.button`
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
  background-color: var(--c-static-neutral-300);
  background-size: cover;
  border-radius: var(--unit);
  cursor: pointer;
  text-align: left;
  color: var(--c-static-neutral-100);

  &::before {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(var(--c-static-rgb-neutral-800), 0.4) 5.25%,
      var(--c-static-neutral-800) 70%,
      var(--c-static-neutral-800) 100%
    );
    content: '';
    border-radius: inherit;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  &.highlight {
    outline: 4px solid var(--c-brand-600);
  }

  &:hover,
  &:focus {
    &::before: {
      opacity: 0.9;
    }
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: var(--double-unit);
  }
`;

const Rank = styled(Text16)`
  grid-area: rank;
  text-align: center;
`;

const AvatarContainer = styled.div`
  grid-area: avatar;
`;

const Name = styled(Text16)`
  grid-area: name;
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
  const { id, ranking, score, so5Lineup } = manager;
  const { user, cancelledAt } = so5Lineup;
  const { clubBanner } = user.profile;

  const isCancelled = !!cancelledAt;
  return (
    <Root
      className={classnames({ highlight })}
      style={{
        backgroundImage: `url(${clubBanner?.pictureUrl || defaultBanner})`,
      }}
      type="button"
      onClick={() => onClick(id)}
    >
      <Rank bold>{isCancelled ? '-' : ranking}</Rank>
      <AvatarContainer>
        <Avatar variant="medium" user={user} />
      </AvatarContainer>
      <Name bold>
        <Nickname user={user} />
      </Name>
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
  so5Ranking: gql`
    fragment Row_so5Ranking on So5Ranking {
      id
      ranking
      score
      so5Lineup {
        id
        cancelledAt
        user {
          id
          slug
          ...Avatar_publicUserInfoInterface
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
    ${Avatar.fragments.publicUserInfoInterface}
    ${ClubShield.fragments.userProfile}
  `,
};

export default Row;
