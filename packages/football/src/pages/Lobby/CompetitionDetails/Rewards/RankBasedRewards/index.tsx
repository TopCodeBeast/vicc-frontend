import { TypedDocumentNode, gql } from '@apollo/client';
import { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title4 } from '@sorare/core/src/atoms/typography';

import { Bronze, Gold, Silver } from '@football/pages/Home/ClubHonors/CardRewards/trophy';
import CardReward from '@football/pages/Lobby/CompetitionDetails/Rewards/CardReward';
import CoinReward from '@football/pages/Lobby/CompetitionDetails/Rewards/CoinReward';
import ExperienceReward from '@football/pages/Lobby/CompetitionDetails/Rewards/ExperienceReward';
import MoneyReward from '@football/pages/Lobby/CompetitionDetails/Rewards/MoneyReward';
import { MoneyReward_vicc5RewardConfig } from '@football/pages/Lobby/CompetitionDetails/Rewards/MoneyReward/__generated__/index.graphql';
import RewardRange from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRange';

import {
  RankBasedRewards_vicc5League,
  RankBasedRewards_vicc5RewardConfig,
} from './__generated__/index.graphql';

export interface RangeReward extends RankBasedRewards_vicc5RewardConfig {
  startRank?: number | null;
  startPct?: number | null;
  endRank?: number | null;
  endPct?: number | null;
}

type getParticipationRangeProps = {
  startRank?: number | null;
  endRank?: number | null;
  startPct?: number | null;
  endPct?: number | null;
  myRanking?: number | null;
  myRankPct?: number | null;
};
const getParticipationRange = ({
  startRank,
  endRank,
  startPct,
  endPct,
  myRanking,
  myRankPct,
}: getParticipationRangeProps) => {
  const start = startRank ?? `${(startPct || 0) * 100}%`;
  const end = endRank ?? `${(endPct || 0) * 100}%`;
  const myRankingIncludedInRankRange =
    myRanking &&
    startRank &&
    endRank &&
    myRanking >= startRank &&
    myRanking <= endRank;
  const isMyRange = Boolean(
    (myRankPct && myRankPct === endPct) || myRankingIncludedInRankRange
  );
  return { start, end, isMyRange };
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Title = styled.header`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const TrophyIconWrapper = styled.div`
  & > svg {
    width: var(--double-unit);
  }
`;

type Props = {
  rewards: RangeReward[];
  myRanking?: number | null;
  myRankPct?: number | null;
  vicc5League: RankBasedRewards_vicc5League;
};

const TROPHY_ICONS: {
  [key: number]: FunctionComponent<React.PropsWithChildren<unknown>>;
} = {
  1: Gold,
  2: Silver,
  3: Bronze,
};

const RankBasedRewards = ({
  rewards,
  myRanking,
  myRankPct,
  vicc5League,
}: Props) => {
  return (
    <Wrapper>
      <div>
        <Title4>
          <FormattedMessage
            id="Lobby.CompetitionDetails.RankBasedReward.title"
            defaultMessage="Prize pool"
          />
        </Title4>
      </div>
      {rewards?.map(
        ({
          cards,
          experiences,
          startRank,
          startPct,
          endRank,
          endPct,
          ethAmount,
          usdAmount,
          minimumGuaranteedUsdAmount,
          coinAmount,
        }) => {
          const { start, end, isMyRange } = getParticipationRange({
            startRank,
            endRank,
            startPct,
            endPct,
            myRanking,
            myRankPct,
          });
          const TrophyIcon =
            typeof start === 'number' ? TROPHY_ICONS[start] : undefined;
          const Rank =
            start !== end ? (
              <Text16 color="var(--c-neutral-600)">
                {start} → {end}
              </Text16>
            ) : (
              <Title>
                {TrophyIcon && (
                  <TrophyIconWrapper>
                    <TrophyIcon />
                  </TrophyIconWrapper>
                )}
                <Text16 color="var(--c-neutral-600)">
                  <FormattedMessage
                    id="Lobby.CompetitionDetails.RankBasedReward.rewardTitle"
                    defaultMessage={`{rank, selectordinal,
                      one {#st}
                      two {#nd}
                      few {#rd}
                      other {#th}
                  } place`}
                    values={{
                      rank: start,
                    }}
                  />
                </Text16>
              </Title>
            );

          return (
            <RewardRange
              key={startRank}
              isProjectedReward={isMyRange}
              rank={Rank}
              rewards={
                vicc5League && (
                  <>
                    {experiences?.map(experience => (
                      <ExperienceReward
                        key={experience.description}
                        experience={experience}
                      />
                    ))}
                    {!!(ethAmount || usdAmount) && (
                      <MoneyReward
                        reward={
                          {
                            ethAmount,
                            usdAmount,
                            minimumGuaranteedUsdAmount,
                          } as MoneyReward_vicc5RewardConfig
                        }
                      />
                    )}
                    {!!coinAmount && <CoinReward coins={coinAmount} />}
                    {cards?.map(card => (
                      <CardReward
                        key={`${card.quality}-${card.rarity}`}
                        slug={vicc5League.slug}
                        card={card}
                      />
                    ))}
                  </>
                )
              }
            />
          );
        }
      )}
    </Wrapper>
  );
};

RankBasedRewards.fragments = {
  vicc5League: gql`
    fragment RankBasedRewards_vicc5League on Vicc5League {
      slug
      name
    }
  ` as TypedDocumentNode<RankBasedRewards_vicc5League>,
  vicc5RewardConfig: gql`
    fragment RankBasedRewards_vicc5RewardConfig on Vicc5RewardConfig {
      ranks
      rankPct
      score
      coinAmount
      ...MoneyReward_vicc5RewardConfig
      cards {
        ...CardReward_vicc5RewardCardConfig
      }
      experiences {
        ...ExperienceReward_vicc5RewardExperience
      }
    }
    ${CardReward.fragments.Vicc5RewardCardConfig}
    ${ExperienceReward.fragments.Vicc5RewardExperience}
    ${MoneyReward.fragments.vicc5RewardConfig}
  ` as TypedDocumentNode<RankBasedRewards_vicc5RewardConfig>,
};

export default RankBasedRewards;
