import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Title3 } from '@sorare/core/src/atoms/typography';
import { createCardSorts } from '@sorare/core/src/lib/algolia';
import { glossary } from '@sorare/core/src/lib/glossary';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';
import {
  CollectibleFilter,
  RefineActiveClub,
  RefineCardEdition,
  RefineOnSale,
  RefineRarity,
  RefineSeason,
  RefineSerialNumber,
  RefineTeam,
  filterSeparator,
} from '@sorare/marketplace/src/searchCards';

import AdvancedCardSearch from '@sorare/football/src/components/searchCards/AdvancedCardSearch';
import { RefineMultipleFootballPositions } from '@sorare/football/src/components/searchCards/RefinePosition';

import { PlayerSearch_player } from './__generated__/index.graphql';

const cardFilters = [
  RefineRarity(),
  filterSeparator,
  RefineOnSale({ startsOpen: true }),
  filterSeparator,
  RefineSeason,
  RefineMultipleFootballPositions,
  RefineTeam,
  RefineActiveClub,
  RefineCardEdition,
  RefineSerialNumber({ withJerseySerial: true }),
  CollectibleFilter({ withLegend: false }),
];

interface Props {
  player: PlayerSearch_player;
}

const cardSortsWithBestValue = createCardSorts({ withBestValue: true });

export const Search = ({ player }: Props) => {
  const filters = useDefaultFilters({ playerSlug: player.slug });

  return (
    <AdvancedCardSearch
      sorts={cardSortsWithBestValue}
      defaultSort="Lowest Price"
      title={
        <Title3>
          <FormattedMessage {...glossary.cards} />
        </Title3>
      }
      analyticsTags={['Player', 'Football']}
      defaultFilters={filters}
      cardFilters={cardFilters}
      isBlockchain
      topic={{ type: 'player', label: player.displayName }}
    />
  );
};

Search.fragments = {
  player: gql`
    fragment PlayerSearch_player on Player {
      slug
      displayName
    }
  `,
};

export default Search;
