import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  CardQuality,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title2, Title6 } from '@sorare/core/src/atoms/typography';
import { REWARDS } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { scarcityNames } from '@sorare/core/src/lib/cards';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { qualityNames } from '@sorare/core/src/lib/players';
import Tree from '@sorare/core/src/routing/Tree';

import { orderLeagues } from '@football/lib/so5';

import Data from './Data';
import {
  RewardPoolQuery,
  RewardPoolQueryVariables,
} from './__generated__/index.graphql';

type RewardPoolQuery_vicc5League_vicc5Fixture_vicc5Leagues =
  RewardPoolQuery['vicc5']['vicc5League']['vicc5Fixture']['vicc5Leagues'][number];

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  flex-wrap: wrap;
`;
const Content = styled.div`
  display: flex;
  gap: var(--unit);
  flex-direction: column;
`;

const messages = defineMessages({
  gameWeek: {
    id: 'Rewards.gameWeek',
    defaultMessage: 'Game Week {gameWeek} Rewards',
  },
  fixture: {
    id: 'Rewards.fixture',
    defaultMessage: '{fixture} Rewards',
  },
});

export const REWARD_POOL_QUERY = gql`
  query RewardPoolQuery(
    $vicc5LeagueSlug: String!
    $rarity: String!
    $quality: String!
  ) {
    #football {
      vicc5 {
        vicc5League(slug: $vicc5LeagueSlug) {
          slug
          name
          displayName
          category
          rewardPoolComputedAt
          rewardedRarities
          vicc5Fixture {
            slug
            gameWeek
            displayName
            vicc5Leagues {
              slug
              name
              displayName
              category
              vicc5Leaderboards {
                slug
                rewardsConfig {
                  ranking {
                    cards {
                      quality
                    }
                  }
                  conditional {
                    cards {
                      quality
                    }
                  }
                }
              }
            }
          }
          rewardPool(rarity: $rarity, quality: $quality) {
            slug
            ...RewardPool_Data_playerWithSupply
          }
        }
      }
    #}
  }
  ${Data.fragments.playerWithSupply}
` as TypedDocumentNode<RewardPoolQuery, RewardPoolQueryVariables>;

const qualities = Object.entries(qualityNames).reduce<{
  [key: string]: string;
}>((sum, [slug, name]) => {
  sum[name] = slug;
  return sum;
}, {});

const leagueQualities = (
  vicc5League: RewardPoolQuery_vicc5League_vicc5Fixture_vicc5Leagues
): string[] => {
  const cardQualities = new Array<string>();
  vicc5League.vicc5Leaderboards.forEach(sl => [
    [sl.rewardsConfig.conditional, sl.rewardsConfig.ranking]
      .flat()
      .filter(Boolean)
      .forEach(reward =>
        (reward?.cards || []).forEach(
          card => card.quality && cardQualities.push(qualityNames[card.quality])
        )
      ),
  ]);
  return Object.values(qualityNames).filter(q => cardQualities.includes(q));
};

const buildSchema = (
  vicc5Leagues: RewardPoolQuery_vicc5League_vicc5Fixture_vicc5Leagues[],
  rewardedRarities: string[]
) =>
  orderLeagues(vicc5Leagues)
    .filter(({ name }) => !['training_center'].includes(name))
    .reduce<{
      [key: string]: { [key: string]: string[] };
    }>((sum, cur) => {
      sum[cur.displayName] = Array.from(leagueQualities(cur)).reduce<{
        [key: string]: string[];
      }>((s, c) => {
        s[c] = rewardedRarities;
        return s;
      }, {});

      return sum;
    }, {});

export const Rewards = () => {
  const navigate = useNavigate();
  const { formatMessage, formatDate, formatTime } = useIntl();
  const {
    rarity = Rarity.rare,
    vicc5LeagueSlug = '',
    quality = CardQuality.TIER_0,
  } = useParams<{ rarity: Rarity; vicc5LeagueSlug: string; quality: string }>();

  const { data, loading } = useQuery(REWARD_POOL_QUERY, {
    variables: {
      rarity,
      vicc5LeagueSlug,
      quality: quality.toLowerCase(),
    },
  });

  const vicc5LeagueSlugs = useMemo(
    () =>
      (data?.vicc5.vicc5League?.vicc5Fixture.vicc5Leagues || []).reduce<{
        [key: string]: string;
      }>((sum, cur) => {
        sum[cur.displayName] = cur.slug;

        return sum;
      }, {}),
    [data?.vicc5.vicc5League?.vicc5Fixture.vicc5Leagues]
  );
  const rewardedRarities = useMemo(
    () =>
      data?.vicc5.vicc5League?.rewardedRarities?.reduce<{
        [key: string]: string;
      }>((sum, slug) => {
        sum[scarcityNames[slug]] = slug;
        return sum;
      }, {}) || {},
    [data?.vicc5.vicc5League?.rewardedRarities]
  );

  const onSelect = useCallback(
    ([league, qualityName, rarityName]: [
      string,
      string | undefined,
      string | undefined
    ]) => {
      navigate(
        generatePath(REWARDS, {
          vicc5LeagueSlug: vicc5LeagueSlugs[league],
          rarity: rewardedRarities[rarityName!] || rarity,
          quality: qualities[qualityName!].toLowerCase(),
        })
      );
    },
    [navigate, vicc5LeagueSlugs, rewardedRarities, rarity]
  );

  const schema = useMemo(
    () =>
      buildSchema(
        (data?.vicc5.vicc5League?.vicc5Fixture.vicc5Leagues || []) as any,
        Object.keys(rewardedRarities)
      ),
    [data?.vicc5.vicc5League?.vicc5Fixture.vicc5Leagues, rewardedRarities]
  );

  if ((!data && loading) || !rarity || !quality || !vicc5LeagueSlug)
    return <LoadingIndicator fullHeight />;

  if (!data) return null;

  const { vicc5League } = data.vicc5;
  const { vicc5Fixture, rewardPool, rewardPoolComputedAt } = vicc5League;

  const selected: [string, string, string] = [
    vicc5League!.displayName,
    qualityNames[quality.toUpperCase() as CardQuality],
    scarcityNames[rarity],
  ];

  return (
    <Container>
      <Tree
        schema={schema}
        selected={selected}
        onSelect={onSelect}
        title={
          <Breadcrumbs>
            <Title2 color="var(--c-neutral-900)">
              {formatMessage(messages.fixture, {
                fixture:
                  vicc5Fixture.displayName ||
                  formatMessage(fantasy.gameWeek, {
                    gameWeek: vicc5Fixture.gameWeek,
                  }),
              })}
            </Title2>
            <Title2 color="var(--c-neutral-900)">/</Title2>
            <Title2 color="var(--c-neutral-600)">
              {vicc5League!.displayName}
            </Title2>
          </Breadcrumbs>
        }
      >
        <Content>
          {Boolean(rewardPool.length) && rewardPoolComputedAt && (
            <Title6 color="var(--c-neutral-1000)">
              <FormattedMessage
                id="rewards.warning.lastUpdated"
                defaultMessage="Players are eligible to change tiers until Game Week closing. Last Updated: {date} at {time}"
                values={{
                  date: formatDate(rewardPoolComputedAt),
                  time: formatTime(rewardPoolComputedAt),
                }}
              />
            </Title6>
          )}
          <Data rarity={rarity} players={rewardPool} />
        </Content>
      </Tree>
    </Container>
  );
};

export default Rewards;
