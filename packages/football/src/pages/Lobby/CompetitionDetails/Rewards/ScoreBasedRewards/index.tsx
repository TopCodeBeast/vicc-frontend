import { TypedDocumentNode, gql } from '@apollo/client';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title5 } from '@sorare/core/src/atoms/typography';

import CardReward from '@football/pages/Lobby/CompetitionDetails/Rewards/CardReward';
import CoinReward from '@football/pages/Lobby/CompetitionDetails/Rewards/CoinReward';
import MoneyReward from '@football/pages/Lobby/CompetitionDetails/Rewards/MoneyReward';
import RewardRange from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRange';

import {
  ScoreBasedRewards_vicc5Leaderboard,
  ScoreBasedRewards_vicc5RewardConfig,
} from './__generated__/index.graphql';

const Header = styled.div`
  margin-bottom: var(--double-unit);
`;

const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const RankContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const MyScore = styled(Text14)`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  conditions: ScoreBasedRewards_vicc5RewardConfig[];
  myScore?: number;
  myEligibleRewardScore?: number | null;
  vicc5Leaderboard: ScoreBasedRewards_vicc5Leaderboard;
};

const ScoreBasedRewards = ({
  conditions,
  myScore,
  myEligibleRewardScore,
  vicc5Leaderboard,
}: Props) => {
  const conditionsSortByScore = [...conditions].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  const coinRewards = conditionsSortByScore.filter(c => !!c.coinAmount);
  const cardRewards = conditionsSortByScore.filter(c => !!c?.cards?.length);
  const moneyRewards = conditionsSortByScore.filter(
    c => !!c.usdAmount || !!c.ethAmount
  );

  const scoreThresholds = [
    ...new Set(conditionsSortByScore.map(c => c?.score || 0)),
  ];

  return (
    <div>
      <Header>
        <Title5>
          <FormattedMessage
            id="Lobby.CompetitionDetials.Rewards.Conditions"
            defaultMessage="Score based Rewards"
          />
        </Title5>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="Lobby.CompetitionDetials.Rewards.ConditionsSubtitle"
            defaultMessage="Score points during this Game Week to unlock new rewards"
          />
        </Text14>
      </Header>
      <Rewards>
        {scoreThresholds.map(score => {
          const eligibleConditions = [
            moneyRewards.find(c => (c.score || 0) <= score),
            cardRewards.find(c => (c.score || 0) <= score),
            coinRewards.find(c => (c.score || 0) <= score),
          ].filter(Boolean);
          const isMyRange =
            typeof myScore === 'number' &&
            myEligibleRewardScore === score &&
            myScore > score;
          return (
            <RewardRange
              key={score}
              isProjectedReward={isMyRange}
              projectedRewardTitle={
                typeof myScore === 'number' && (
                  <MyScore>
                    <span>
                      <FormattedMessage
                        id="Lobby.CompetitionDetials.Rewards.yourScore"
                        defaultMessage="Your score"
                      />
                    </span>
                    <strong>
                      <FormattedNumber value={myScore} />
                    </strong>
                  </MyScore>
                )
              }
              rank={
                <RankContainer>
                  <Text16 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="Lobby.CompetitionDetials.Rewards.Score"
                      defaultMessage="Score"
                    />
                  </Text16>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    color="var(--c-neutral-600)"
                    size="xs"
                  />
                  <Text16 color="var(--c-neutral-600)">{score}</Text16>
                </RankContainer>
              }
              rewards={eligibleConditions.map(condition => {
                const { ethAmount, usdAmount, cards, coinAmount } = condition;
                return (
                  <Fragment key={`${coinAmount}-${ethAmount}-${usdAmount}`}>
                    {!!(ethAmount || usdAmount) && (
                      <MoneyReward highlighted reward={condition} />
                    )}
                    {!!coinAmount && <CoinReward coins={coinAmount} />}
                    {vicc5Leaderboard?.vicc5League &&
                      cards?.map(card => (
                        <CardReward
                          key={`${card.quality}-${card.rarity}`}
                          slug={vicc5Leaderboard?.vicc5League.slug}
                          card={card}
                        />
                      ))}
                  </Fragment>
                );
              })}
            />
          );
        })}
      </Rewards>
    </div>
  );
};

ScoreBasedRewards.fragments = {
  vicc5Leaderboard: gql`
    fragment ScoreBasedRewards_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      vicc5League {
        slug
      }
    }
  ` as TypedDocumentNode<ScoreBasedRewards_vicc5Leaderboard>,
  vicc5RewardConfig: gql`
    fragment ScoreBasedRewards_vicc5RewardConfig on Vicc5RewardConfig {
      ranks
      rankPct
      score
      coinAmount
      ...MoneyReward_vicc5RewardConfig
      cards {
        ...CardReward_vicc5RewardCardConfig
      }
    }
    ${MoneyReward.fragments.vicc5RewardConfig}
    ${CardReward.fragments.Vicc5RewardCardConfig}
  ` as TypedDocumentNode<ScoreBasedRewards_vicc5RewardConfig>,
};

export default ScoreBasedRewards;
