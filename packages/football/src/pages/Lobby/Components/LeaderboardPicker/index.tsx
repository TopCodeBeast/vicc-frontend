import { gql } from '@apollo/client';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { So5State } from '@sorare/core/src/__generated__/globalTypes';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import Select from '@sorare/core/src/atoms/inputs/Select';
import ScarcityBallPro from '@sorare/core/src/components/card/ScarcityBallPro';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useLocalStorage, {
  STORAGE,
} from '@sorare/core/src/hooks/useLocalStorage';
import useToggle from '@sorare/core/src/hooks/useToggle';

import LeaderboardModeSelect from '@football/pages/Lobby/CompetitionDetails/Leaderboards/LeaderboardModeSelect';

import { LeaderboardFetcher } from './LeaderboardFetcher';
import {
  LobbyLeaderboardPickerQuery,
  LobbyLeaderboardPickerQueryVariables,
} from './__generated__/index.graphql';

const commonStyles = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--double-unit);
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Header = styled.header`
  ${commonStyles}
  margin-bottom: var(--unit);
`;
const Filters = styled.div`
  ${commonStyles}
  &.hideSelect {
    opacity: 0;
  }
`;

const LOBBY_LEADERBOARD_PICKER_QUERY = gql`
  query LobbyLeaderboardPickerQuery($type: So5State, $slug: String) {
    football {
      so5 {
        so5Fixture(type: $type, slug: $slug) {
          slug
          so5Leaderboards {
            slug
            rarityType
            displayName
            universalSo5UserGroups {
              slug
            }
          }
          mySo5Lineups {
            id
            so5Leaderboard {
              slug
              rarityType
            }
            so5Rankings {
              id
              score
            }
          }
        }
      }
    }
  }
`;

interface Props {
  leaderboardSlug?: string;
  type?: So5State;
}

export const LeaderboardPicker = ({ type }: Props) => {
  const { leaderboardSlug, slug } = useParams();
  const navigate = useNavigate();
  const [onlyFollowed, toggleOnlyFollowed] = useToggle(false);
  const [rarityType, setRarityType] = useState('');
  const [leaderboardMode, setLeaderboardMode] = useLocalStorage<
    'matchday' | 'overall'
  >(STORAGE.leaderboardMode, 'matchday');
  const { data } = useQuery<
    LobbyLeaderboardPickerQuery,
    LobbyLeaderboardPickerQueryVariables
  >(LOBBY_LEADERBOARD_PICKER_QUERY, {
    variables: { type, slug: slug === 'past' ? undefined : slug },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const so5Fixture = data?.football.so5.so5Fixture;
  const redirectTo = useCallback(
    ({ rarity, leaderboard }: { rarity?: string; leaderboard?: string }) => {
      if (!so5Fixture) return null;

      const { mySo5Lineups, so5Leaderboards } = so5Fixture;
      if (
        !so5Leaderboards?.length ||
        so5Leaderboards?.find(
          so5Leaderboard => so5Leaderboard.slug === leaderboard
        )
      ) {
        return null;
      }
      const bestLineups = [...(mySo5Lineups || [])].sort(
        (a, b) => b.so5Rankings[0]?.score - a.so5Rankings[0]?.score
      );
      const bestLineup = rarity
        ? bestLineups?.find(
            ({ so5Leaderboard }) => so5Leaderboard?.rarityType === rarity
          )
        : bestLineups?.[0];
      const defaultLineup = rarity
        ? so5Leaderboards.find(
            so5Leaderboard => so5Leaderboard?.rarityType === rarity
          )
        : so5Leaderboards[0];
      return bestLineup?.so5Leaderboard?.slug || defaultLineup?.slug;
    },
    [so5Fixture]
  );
  const so5Leaderboards = so5Fixture?.so5Leaderboards;
  const rarities = useMemo(() => {
    return so5Leaderboards?.reduce<
      | {
          [key: string]: {
            value: string;
            label: string;
          }[];
        }
      | Record<string, never>
    >((previous, leaderboard) => {
      const currentValue = previous[leaderboard.rarityType] || [];
      previous[leaderboard.rarityType] = [
        ...currentValue,
        {
          value: leaderboard.slug,
          label: leaderboard.displayName,
        },
      ];
      return previous;
    }, {});
  }, [so5Leaderboards]);

  const rarityOptions = useMemo(() => {
    if (!rarities) {
      return [];
    }
    const keys = Object.keys(rarities);
    return (
      keys.map((rarity: any) => ({
        label: <ScarcityBallPro scarcity={rarity} />,
        value: rarity,
      })) || []
    );
  }, [rarities]);
  const tournamentTypeOptions = rarities?.[rarityType];
  const tournamentType = tournamentTypeOptions?.find(
    ({ value }) => value === leaderboardSlug
  );

  const currentLeaderboard = so5Leaderboards?.find(
    so5Leaderboard => so5Leaderboard.slug === leaderboardSlug
  );
  const displayLeaderboardModeSelect =
    !!currentLeaderboard?.universalSo5UserGroups?.length;
  if (!displayLeaderboardModeSelect && leaderboardMode !== 'matchday') {
    setLeaderboardMode('matchday');
  }

  useEffect(() => {
    const redirectSlug = redirectTo({
      leaderboard: leaderboardSlug,
    });
    if (redirectSlug) {
      navigate(redirectSlug, { replace: true });
    }
    if (currentLeaderboard) {
      setRarityType(currentLeaderboard.rarityType);
    }
  }, [
    navigate,
    redirectTo,
    leaderboardSlug,
    so5Leaderboards,
    currentLeaderboard,
  ]);

  return (
    <FlexColContainer>
      <Header
        className={classnames({
          hideSelect: !rarityType,
        })}
      >
        <Select
          value={rarityOptions?.find(({ value }) => value === rarityType)}
          options={rarityOptions}
          onChange={(selected?: { value: string } | null) => {
            if (selected) {
              const redirectSlug = redirectTo({
                rarity: selected.value,
              });
              if (redirectSlug) navigate(redirectSlug);
            }
          }}
          icon={faAngleDown}
        />
        <Select
          value={tournamentType}
          options={tournamentTypeOptions}
          onChange={selected => {
            if (selected) {
              navigate(selected.value);
            }
          }}
          icon={faAngleDown}
        />
        {displayLeaderboardModeSelect && (
          <LeaderboardModeSelect
            leaderboardMode={leaderboardMode}
            changeLeaderboardMode={setLeaderboardMode}
          />
        )}
        <Filters>
          <svg width="1" height="24">
            <rect width="1" height="24" fill="#EDEDED" />
          </svg>
          <Checkbox
            checked={onlyFollowed}
            onChange={toggleOnlyFollowed}
            label={
              <FormattedMessage
                id="Lobby.LeaderboardPicker.friendsOnly"
                defaultMessage="Following only"
              />
            }
          />
        </Filters>
      </Header>
      {leaderboardSlug && (
        <LeaderboardFetcher
          leaderboardSlug={leaderboardSlug}
          onlyFollowed={onlyFollowed}
          leaderboardMode={leaderboardMode}
        />
      )}
    </FlexColContainer>
  );
};
