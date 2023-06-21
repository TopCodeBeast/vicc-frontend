import { gql } from '@apollo/client';
import { FormattedDate } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text16 } from '@sorare/core/src/atoms/typography';

import TeamAvatar from '@football/components/club/TeamAvatar';
import { DidNotPlayLabel } from '@football/components/stats/PlayingLabel';

import { BenchPlayerGameScore_so5Score } from './__generated__/index.graphql';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const TeamAvatarWrapper = styled.div`
  --size: 16px;
  display: inline-flex;
`;
type Props = {
  so5Score: BenchPlayerGameScore_so5Score | null;
};

export const BenchPlayerGameScore = ({ so5Score }: Props) => {
  const { playerGameStats } = so5Score || {};
  const opponent =
    playerGameStats?.team?.slug === playerGameStats?.game?.homeTeam?.slug
      ? playerGameStats?.game?.awayTeam
      : playerGameStats?.game?.homeTeam;

  return (
    <Wrapper>
      <Caption color="var(--c-neutral-500)">
        <FormattedDate
          value={so5Score?.playerGameStats?.game?.date}
          month="short"
          day="numeric"
        />
      </Caption>
      <Row>
        <TeamAvatarWrapper>
          <TeamAvatar team={opponent} withTooltip />
        </TeamAvatarWrapper>
        <Text16 bold color="var(--c-neutral-600)">
          {so5Score?.score != null ? (
            Math.round(so5Score?.score)
          ) : (
            <DidNotPlayLabel />
          )}
        </Text16>
      </Row>
    </Wrapper>
  );
};

BenchPlayerGameScore.fragments = {
  so5Score: gql`
    fragment BenchPlayerGameScore_so5Score on So5Score {
      id
      score
      playerGameStats {
        id
        team {
          ... on TeamInterface {
            slug
          }
        }
        game {
          id
          homeTeam {
            ... on TeamInterface {
              slug
              code
              name
              ...TeamAvatar_team
            }
          }
          awayTeam {
            ... on TeamInterface {
              slug
              code
              name
              ...TeamAvatar_team
            }
          }
          date
        }
      }
    }
    ${TeamAvatar.fragments.team}
  `,
};
