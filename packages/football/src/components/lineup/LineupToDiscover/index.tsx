import { gql } from '@apollo/client';
import { cloneElement } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { InstantSearch } from '@sorare/core/src/components/search/InstantSearch';
import { useConfigContext } from '@sorare/core/src/contexts/config';

import { Lineup, Props as LineupProps } from '@sorare/football/src/components/lineup/Lineup';

import WithLiveCardsOnSale from './WithLiveCardsOnSale';
import { LineupToDiscover_so5Leaderboard } from './__generated__/index.graphql';

type Props = LineupProps & {
  amateurDraftedLeaderboard?: LineupToDiscover_so5Leaderboard;
  leaderboard: LineupToDiscover_so5Leaderboard;
  onPaymentSuccess: () => void;
};

const SUGGESTION_CARDS_MAX_HITS = 20;

const LineupToDiscover = (props: Props) => {
  const {
    so5: { so5LeaguesAlgoliaFilters },
  } = useConfigContext();
  const { amateurDraftedLeaderboard, onPaymentSuccess, ...otherProps } = props;
  const { leaderboard } = otherProps;
  const correspondingLeagueFilter = Object.keys(so5LeaguesAlgoliaFilters).find(
    leagueSlug =>
      amateurDraftedLeaderboard?.so5League.displayName.includes(leagueSlug)
  );

  const lineupWithoutSuggestion = (
    <Lineup key={leaderboard.slug} leaderboard={leaderboard} />
  );

  if (
    !amateurDraftedLeaderboard ||
    !correspondingLeagueFilter ||
    // only suggest secondary cards for semi-pro (experimentation scope)
    leaderboard.division !== 2
  ) {
    return lineupWithoutSuggestion;
  }

  return (
    <InstantSearch
      indexes={['Best Value']}
      defaultHitsPerPage={SUGGESTION_CARDS_MAX_HITS}
      analyticsTags={['LineupToDiscover']}
      sport={Sport.FOOTBALL}
      defaultFilters={[
        'sale.primary:false',
        'rarity:limited',
        'NOT position:Goalkeeper',
        so5LeaguesAlgoliaFilters[correspondingLeagueFilter],
      ]}
      distinct
    >
      <WithLiveCardsOnSale
        loadingView={lineupWithoutSuggestion}
        amateurLeaderboardSlug={amateurDraftedLeaderboard!.slug}
        leagueFilter={correspondingLeagueFilter}
        so5Leaderboard={leaderboard}
        onPaymentSuccess={onPaymentSuccess}
        {...otherProps}
      >
        {lineupProps => cloneElement(lineupWithoutSuggestion, lineupProps)}
      </WithLiveCardsOnSale>
    </InstantSearch>
  );
};

LineupToDiscover.fragments = {
  so5Leaderboard: gql`
    fragment LineupToDiscover_so5Leaderboard on So5Leaderboard {
      slug
      division
      so5League {
        slug
        displayName
      }
      ...Lineup_so5Leaderboard
      ...WithLiveCardsOnSale_so5Leaderboard
    }
    ${Lineup.fragments.so5Leaderboard}
    ${WithLiveCardsOnSale.fragments.so5Leaderboard}
  `,
};

export default LineupToDiscover;
