import { TypedDocumentNode, gql } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';

import { Rarity, Sport } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { FOOTBALL_TRANSFER_MARKET } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { createCardSorts } from '@sorare/core/src/lib/algolia';
import { metadatas } from '@sorare/core/src/lib/seo/football';

import { MarketStackTitle } from '@sorare/marketplace/src/components/market/MarketStackTitle';
import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';
import {
  FavoriteFilter,
  RefineCardEdition,
  RefineCardLevel,
  RefineLatestSeason,
  RefinePrice,
  RefineSeason,
  RefineSerialNumber,
  RefineTeam,
  filterSeparator,
} from '@sorare/marketplace/src/searchCards';

import AdvancedCardSearch from '@football/components/searchCards/AdvancedCardSearch';
import { RefineFootballPosition } from '@football/components/searchCards/RefinePosition';
import PageTemplate from '@football/pages/TransferMarket/PageTemplate';

import {
  Vicc5SecondaryMarketStackPlayerQuery,
  Vicc5SecondaryMarketStackPlayerQueryVariables,
} from './__generated__/index.graphql';

const cardSortsWithBestValue = createCardSorts({
  withBestValue: true,
  withHighestPrice: true,
  withEndingSoon: false,
});

const SO5_SECONDARY_MARKET_STACK_PLAYER_QUERY = gql`
  query Vicc5SecondaryMarketStackPlayerQuery($slug: String!) {
    #football {
      player(slug: $slug) {
        slug
        displayName
      }
    #}
  }
` as TypedDocumentNode<
  Vicc5SecondaryMarketStackPlayerQuery,
  Vicc5SecondaryMarketStackPlayerQueryVariables
>;

const TransferMarketStack = () => {
  const { player_slug: playerSlug, rarity } = useParams();
  const { data, loading } = useQuery(SO5_SECONDARY_MARKET_STACK_PLAYER_QUERY, {
    variables: {
      slug: playerSlug!,
    },
    skip: !playerSlug,
  });

  useTitleAndDescription(
    metadatas.transfers.title,
    metadatas.transfers.description
  );

  const filters = useDefaultFilters({
    secondary: true,
    rarity,
    playerSlug,
    onlySettlableCards: true,
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (
    !data?.player ||
    !rarity ||
    !Object.keys(Rarity).includes(rarity)
  ) {
    return <Navigate to={FOOTBALL_TRANSFER_MARKET} />;
  }

  return (
    <PageTemplate showBack>
      <AdvancedCardSearch
        cardFilters={[
          RefineLatestSeason,
          filterSeparator,
          RefinePrice({ startsOpen: true }),
          RefineCardLevel,
          RefineSerialNumber({ withJerseySerial: true }),
          RefineSeason,
          RefineTeam,
          RefineFootballPosition,
          RefineCardEdition,
          FavoriteFilter,
        ]}
        analyticsTags={['TransferMarketStack', 'Football']}
        sorts={cardSortsWithBestValue}
        defaultSort="Lowest Price"
        defaultFilters={filters}
        togglePrimary
        removeEndedSingleSaleOffers
        topic={{
          type: 'stack',
          label: data.player.displayName,
        }}
        title={
          <MarketStackTitle
            player={data.player}
            rarity={rarity as Rarity}
            sport={Sport.CRICKET}
          />
        }
        isBlockchain
        distinct={false}
      />
    </PageTemplate>
  );
};

export default TransferMarketStack;
