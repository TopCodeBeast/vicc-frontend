import { TypedDocumentNode, gql } from '@apollo/client';
import { cloneElement } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { InstantSearch } from '@sorare/core/src/components/search/InstantSearch';
import { useConfigContext } from '@sorare/core/src/contexts/config';

import { Lineup, Props as LineupProps } from '@football/components/lineup/Lineup';

import WithLiveCardsOnSale from './WithLiveCardsOnSale';
import { LineupToDiscover_vicc5Leaderboard } from './__generated__/index.graphql';

type Props = LineupProps & {
  amateurDraftedLeaderboard?: LineupToDiscover_vicc5Leaderboard;
  leaderboard: LineupToDiscover_vicc5Leaderboard;
  onPaymentSuccess: () => void;
};

const SUGGESTION_CARDS_MAX_HITS = 20;

const LineupToDiscover = (props: Props) => {
  const {
    vicc5: { vicc5LeaguesAlgoliaFilters },
  } = useConfigContext();
  const { amateurDraftedLeaderboard, onPaymentSuccess, ...otherProps } = props;
  const { leaderboard } = otherProps;
  const correspondingLeagueFilter = Object.keys(vicc5LeaguesAlgoliaFilters).find(
    leagueSlug =>
      amateurDraftedLeaderboard?.vicc5League.displayName.includes(leagueSlug)
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
      sport={Sport.CRICKET}
      defaultFilters={[
        'sale.primary:false',
        'rarity:limited',
        'NOT position:Goalkeeper',
        vicc5LeaguesAlgoliaFilters[correspondingLeagueFilter],
      ]}
      distinct
    >
      <WithLiveCardsOnSale
        loadingView={lineupWithoutSuggestion}
        amateurLeaderboardSlug={amateurDraftedLeaderboard!.slug}
        leagueFilter={correspondingLeagueFilter}
        vicc5Leaderboard={leaderboard}
        onPaymentSuccess={onPaymentSuccess}
        {...otherProps}
      >
        {lineupProps => cloneElement(lineupWithoutSuggestion, lineupProps)}
      </WithLiveCardsOnSale>
    </InstantSearch>
  );
};

LineupToDiscover.fragments = {
  vicc5Leaderboard: gql`
    fragment LineupToDiscover_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      division
      vicc5League {
        slug
        displayName
      }
      ...Lineup_vicc5Leaderboard
      ...WithLiveCardsOnSale_vicc5Leaderboard
    }
    ${Lineup.fragments.vicc5Leaderboard}
    ${WithLiveCardsOnSale.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<LineupToDiscover_vicc5Leaderboard>,
};

export default LineupToDiscover;
