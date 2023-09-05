import { TypedDocumentNode, gql } from '@apollo/client';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { Vicc5State } from '@sorare/core/src/__generated__/globalTypes';
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
  query LobbyLeaderboardPickerQuery($type: Vicc5State, $slug: String) {
    #football {
      vicc5 {
        vicc5Fixture(type: $type, slug: $slug) {
          slug
          vicc5Leaderboards {
            slug
            rarityType
            displayName
            universalVicc5UserGroups {
              slug
            }
          }
          myVicc5Lineups {
            id
            vicc5Leaderboard {
              slug
              rarityType
            }
            vicc5Rankings {
              id
              score
            }
          }
        }
      }
    #}
  }
` as TypedDocumentNode<
  LobbyLeaderboardPickerQuery,
  LobbyLeaderboardPickerQueryVariables
>;

interface Props {
  leaderboardSlug?: string;
  type?: Vicc5State;
}

export const LeaderboardPicker = ({ type }: Props) => {
  const { leaderboardSlug, slug } = useParams();
  const navigate = useNavigate();
  const [onlyFollowed, toggleOnlyFollowed] = useToggle(false);
  const [rarityType, setRarityType] = useState('');
  const [leaderboardMode, setLeaderboardMode] = useLocalStorage<
    'matchday' | 'overall'
  >(STORAGE.leaderboardMode, 'matchday');
  const { data } = useQuery(LOBBY_LEADERBOARD_PICKER_QUERY, {
    variables: { type, slug: slug === 'past' ? undefined : slug },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const vicc5Fixture = data?.football.vicc5.vicc5Fixture;
  const redirectTo = useCallback(
    ({ rarity, leaderboard }: { rarity?: string; leaderboard?: string }) => {
      if (!vicc5Fixture) return null;

      const { myVicc5Lineups, vicc5Leaderboards } = vicc5Fixture;
      if (
        !vicc5Leaderboards?.length ||
        vicc5Leaderboards?.find(
          vicc5Leaderboard => vicc5Leaderboard.slug === leaderboard
        )
      ) {
        return null;
      }
      const bestLineups = [...(myVicc5Lineups || [])].sort(
        (a, b) => b.vicc5Rankings[0]?.score - a.vicc5Rankings[0]?.score
      );
      const bestLineup = rarity
        ? bestLineups?.find(
            ({ vicc5Leaderboard }) => vicc5Leaderboard?.rarityType === rarity
          )
        : bestLineups?.[0];
      const defaultLineup = rarity
        ? vicc5Leaderboards.find(
            vicc5Leaderboard => vicc5Leaderboard?.rarityType === rarity
          )
        : vicc5Leaderboards[0];
      return bestLineup?.vicc5Leaderboard?.slug || defaultLineup?.slug;
    },
    [vicc5Fixture]
  );
  const vicc5Leaderboards = vicc5Fixture?.vicc5Leaderboards;
  const rarities = useMemo(() => {
    return vicc5Leaderboards?.reduce<
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
  }, [vicc5Leaderboards]);

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

  const currentLeaderboard = vicc5Leaderboards?.find(
    vicc5Leaderboard => vicc5Leaderboard.slug === leaderboardSlug
  );
  const displayLeaderboardModeSelect =
    !!currentLeaderboard?.universalVicc5UserGroups?.length;
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
    vicc5Leaderboards,
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
