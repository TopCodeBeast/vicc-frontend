import { gql } from '@apollo/client';
import { isFuture, isPast } from 'date-fns';
import qs from 'qs';
import { cloneElement, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { User } from '@sorare/core/src/atoms/icons/User';
import { LinkBox } from '@sorare/core/src/atoms/navigation/Box';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { LineupCount } from '@sorare/core/src/components/lobby/CompetitionList/Ranking';
import { FormattedRank } from '@sorare/core/src/components/lobby/FormattedRank';
import {
  FOOTBALL_COMPETITION_DETAILS_DETAILS,
  FOOTBALL_COMPETITION_DETAILS_TEAM,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import {
  getMissingAppearances,
  getSortedAppearances,
} from '@sorare/core/src/lib/players';

import LineupActions, {
  Props as LineupActionsProps,
} from '@football/components/lineup/LineupActions';
import { LineupHeader } from '@football/components/lineup/LineupHeader';
import { PlayerCard } from '@football/components/lineup/PlayerCard';
import PlayerCardPlaceholder from '@football/components/lineup/PlayerCardPlaceholder';
import PlayerGameScoreDialog from '@football/components/stats/PlayerGameScoreDialog';
import { useDisplaySemiProIncentive } from '@football/hooks/leaderboard/useDisplaySemiProIncentive';
import { lineupMessages } from '@football/lib/lineup/messages';
import { RewardType } from '@football/lib/lineupRewards';

import { LineupRewards } from './LineupRewards';
import { LineupStatus } from './LineupStatus';
import {
  Lineup_so5Leaderboard,
  Lineup_so5Lineup,
} from './__generated__/index.graphql';

const Wrapper = styled(LinkBox)`
  background: var(--c-neutral-200);
  border-radius: var(--double-unit);
  color: var(--c-neutral-1000);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-300);
  isolation: isolate;
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
  }
  &:focus-visible {
    outline: 3px solid var(--c-neutral-300);
  }
`;

const Scores = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 var(--intermediate-unit);
`;

const RankContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  & svg {
    display: block;
    font-size: 10px;
    margin-bottom: 1px; /* visual hack to center it */
    color: var(--c-neutral-600);
  }
`;

const Cards = styled.div`
  gap: var(--unit);
  padding: var(--unit) var(--intermediate-unit);
  justify-content: space-between;
  display: flex;
  flex: 1;
  > * {
    flex: 1;
  }
`;

const SemiProIncentive = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--c-neutral-300);
  height: 32px;
`;

type Appearance = Lineup_so5Lineup['so5Appearances'][number];

const isAppearance = (appearance: {
  card: { position: string };
  id?: string;
}): appearance is Appearance => {
  return !!appearance.id;
};

export type Props = {
  lineup?: Lineup_so5Lineup | null;
  leaderboard: Lineup_so5Leaderboard;
  displayScore?: boolean;
  rewardType?: RewardType;
  isLive?: boolean;
  renderCard?: (args: {
    appearance:
      | Appearance
      | {
          card: { position: string };
        };
  }) => JSX.Element;
  renderCta?: LineupActionsProps['renderCta'];
  hideGameWeekInfo?: boolean;
};

export const Lineup = ({
  lineup,
  leaderboard,
  displayScore,
  rewardType = RewardType.Generic,
  hideGameWeekInfo,
  renderCard,
  renderCta,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const [openPlayerGameScore, setOpenPlayerGameScore] = useState('');

  const qsLineupId = lineup
    ? qs.stringify(
        {
          id: idFromObject(lineup.id),
        },
        { addQueryPrefix: true }
      )
    : '';
  const linkToCompetitionDetails = generatePath(
    `${
      lineup
        ? FOOTBALL_COMPETITION_DETAILS_TEAM
        : FOOTBALL_COMPETITION_DETAILS_DETAILS
    }${qsLineupId}`,
    {
      competition: leaderboard.slug,
    }
  );

  const { so5Fixture, so5LeaderboardType } = leaderboard;
  const displaySemiProIncentive =
    useDisplaySemiProIncentive(so5LeaderboardType);
  const startDate = new Date(so5Fixture.startDate);
  const endDate = new Date(so5Fixture.endDate);
  const isLive = isPast(startDate) && isFuture(endDate);

  const myRanking = lineup?.so5Rankings?.[0];
  const score = myRanking?.score;
  const ranking = myRanking?.ranking;

  const lineupsCount = leaderboard.so5LineupsCount;

  const locked = !leaderboard.canCompose.value;
  const players = lineup
    ? getSortedAppearances<Appearance | { card: { position: string } }>([
        ...lineup.so5Appearances,
        ...getMissingAppearances(lineup.so5Appearances),
      ])
    : getMissingAppearances([]);
  const [rankingReward] = lineup?.so5Rankings || [];
  const { totalRewards } = leaderboard;

  const getLineupStatus = () => {
    if (lineup) {
      return (
        <LineupStatus
          so5Lineup={lineup}
          displayScore={displayScore}
          score={score}
        />
      );
    }

    if (locked) {
      return (
        <Text14 bold>
          {formatMessage({
            id: 'Lineup.Status.Locked',
            defaultMessage: 'Locked',
          })}
        </Text14>
      );
    }
    return null;
  };

  const getRank = () => {
    const isCancelled = !!lineup?.cancelledAt;
    if (isCancelled) {
      return null;
    }
    if (ranking) {
      return <FormattedRank rank={ranking} total={lineupsCount} />;
    }
    return (
      <>
        <User />
        <Text14 color="var(--c-neutral-600)">
          <LineupCount count={lineupsCount} />
        </Text14>
      </>
    );
  };

  return (
    <Wrapper>
      <LineupHeader
        leaderboard={leaderboard}
        lineup={lineup}
        hideGameWeekInfo={hideGameWeekInfo}
        linkToCompetitionDetails={linkToCompetitionDetails}
      />
      <Scores>
        <RankContainer>{getRank()}</RankContainer>
        {getLineupStatus()}
      </Scores>
      <Cards>
        {players.map((appearance, idx) => {
          if (renderCard) {
            const element = renderCard({
              appearance,
            });
            return cloneElement(element, {
              key: appearance.card.position,
            });
          }

          return isAppearance(appearance) ? (
            <PlayerCard
              key={appearance.id}
              appearance={appearance}
              onClick={
                appearance.so5Score?.id
                  ? () => setOpenPlayerGameScore(appearance.so5Score!.id)
                  : undefined
              }
              isLive={isLive}
            />
          ) : (
            <PlayerCardPlaceholder
              key={appearance.card.position}
              position={idx}
              lineup={lineup}
              leaderboard={leaderboard}
            />
          );
        })}
      </Cards>
      <LineupActions
        so5Leaderboard={leaderboard}
        linkToCompetitionDetails={linkToCompetitionDetails}
        lineupId={lineup?.id}
        renderCta={renderCta}
      />
      {displaySemiProIncentive ? (
        <SemiProIncentive>
          <Text14 color="var(--c-static-green-300)" bold>
            <FormattedMessage {...lineupMessages.prizePoolIncentive} />
          </Text14>
        </SemiProIncentive>
      ) : (
        <LineupRewards
          rankingRewards={rankingReward}
          totalRewards={totalRewards}
          rewardType={rewardType}
          linkToCompetitionDetails={linkToCompetitionDetails}
        />
      )}
      <PlayerGameScoreDialog
        so5ScoreId={idFromObject(openPlayerGameScore)!}
        onClose={() => setOpenPlayerGameScore('')}
        open={!!openPlayerGameScore}
      />
    </Wrapper>
  );
};

Lineup.fragments = {
  so5Lineup: gql`
    fragment Lineup_so5Lineup on So5Lineup {
      id
      name
      cancelledAt
      so5Appearances {
        id
        card {
          assetId
          slug
          position: positionTyped
        }
        so5Score {
          id
        }
        ...PlayerCard_so5Appearance
      }
      so5Rankings {
        id
        score
        ranking
        ...LineupRewards_so5Ranking
      }
      ...LineupHeader_so5Lineup
      ...PlayerCardPlaceholder_so5Lineup
      ...LineupStatus_so5Lineup
    }
    ${LineupHeader.fragments.so5Lineup}
    ${PlayerCard.fragments.so5Appearance}
    ${LineupRewards.fragments.so5Ranking}
    ${PlayerCardPlaceholder.fragments.so5Lineup}
    ${LineupStatus.fragments.so5Lineup}
  `,
  so5Leaderboard: gql`
    fragment Lineup_so5Leaderboard on So5Leaderboard {
      slug
      so5LineupsCount
      so5LeaderboardType
      totalRewards {
        ...LineupRewards_rewardsOverview
      }
      commonDraftCampaign {
        slug
        status
      }
      canCompose {
        value
      }
      so5Fixture {
        slug
        startDate
        endDate
      }
      ...LineupHeader_so5Leaderboard
      ...LineupActions_so5Leaderboard
      ...PlayerCardPlaceholder_so5Leaderboard
    }
    ${LineupHeader.fragments.so5Leaderboard}
    ${LineupActions.fragments.so5Leaderboard}
    ${LineupRewards.fragments.rewardsOverview}
    ${PlayerCardPlaceholder.fragments.so5Leaderboard}
  `,
};
