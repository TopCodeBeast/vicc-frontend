import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Title3 } from '@sorare/core/src/atoms/typography';
import { createCardSorts } from '@sorare/core/src/lib/algolia';
import { glossary } from '@sorare/core/src/lib/glossary';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';
import {
  RefineActiveClub,
  RefineAppearances,
  RefineAverageScore,
  RefineCardLevel,
  RefineCardPlayerAge,
  RefineLeague,
  RefinePlayer,
  RefineRarity,
  RefineSeason,
  RefineTeam,
} from '@sorare/marketplace/src/searchCards';

import AdvancedCardSearch from '@football/components/searchCards/AdvancedCardSearch';
import { RefineFootballPosition } from '@football/components/searchCards/RefinePosition';

import { CountrySearch_country } from './__generated__/index.graphql';

const cardFilters = [
  RefineRarity(),
  RefineFootballPosition,
  RefineSeason,
  RefineCardLevel,
  RefinePlayer,
  RefineTeam,
  RefineActiveClub,
  RefineLeague,
  RefineCardPlayerAge,
  RefineAverageScore(),
  RefineAppearances(),
];

interface Props {
  country: CountrySearch_country;
}

const cardSortsWithBestValue = createCardSorts({
  withBestValue: true,
  withHighestAverageScore: true,
  withPopularPlayer: true,
});

export const Search = ({ country }: Props) => {
  const filters = useDefaultFilters({ countrySlug: country.slug });

  return (
    <AdvancedCardSearch
      sorts={cardSortsWithBestValue}
      defaultSort="Newly Listed"
      title={
        <Title3>
          <FormattedMessage {...glossary.cards} />
        </Title3>
      }
      analyticsTags={['Country', 'Football']}
      defaultFilters={filters}
      cardFilters={cardFilters}
      isBlockchain
      topic={{ type: 'country', label: toDisplayName(country.slug) }}
    />
  );
};

Search.fragments = {
  country: gql`
    fragment CountrySearch_country on Country {
      slug
    }
  `,
};

export default Search;
