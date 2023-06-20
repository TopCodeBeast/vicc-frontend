import { differenceInSeconds, parseISO } from 'date-fns';
import { ComponentType, ReactNode, useEffect, useMemo, useState } from 'react';
import { useHits, usePagination } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { Empty } from '@sorare/core/src/components/cards/Empty';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { range } from '@sorare/core/src/lib/arrays';
import { theme } from '@sorare/core/src/style/theme';

import EmptyMarket from 'components/market/Empty/EmptyMarket';
import { Grid, GridItem } from 'components/market/Grid';
import PrimaryOfferPreview, {
  LoadingPrimaryOfferPreview,
} from 'components/primaryOffer/PrimaryOfferPreview';
import {
  PrimaryOffersByIdsQuery,
  PrimaryOffersByIdsQueryVariables,
} from '@sorare/marketplace/src/lib/__generated__/fragments.graphql';
import { PRIMARY_OFFERS_BY_IDS_QUERY } from '@sorare/marketplace/src/lib/fragments';

type PrimaryOffersByIdsQuery_tokens_primaryOffers =
  PrimaryOffersByIdsQuery['tokens']['primaryOffers'][number];

const MAX_AUTO_NEXT_PAGE = 5;

const StyledGrid = styled(Grid)`
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledGridItem = styled(GridItem)`
  background-color: var(--c-neutral-200);
  border-radius: ${theme.radius.md}px;
  overflow: hidden;
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;

type LoaderProps = {
  customLoadingPrimaryOfferPreview?: ReactNode;
};

const Loader = ({ customLoadingPrimaryOfferPreview }: LoaderProps) => {
  return (
    <StyledGrid>
      {range(10).map(i => (
        // eslint-disable-next-line react/no-array-index-key
        <StyledGridItem key={i}>
          {customLoadingPrimaryOfferPreview || <LoadingPrimaryOfferPreview />}
        </StyledGridItem>
      ))}
    </StyledGrid>
  );
};

type Props = {
  renderStarterBundleProjection?: (id: string) => ReactNode;
  CustomPreview?: ComponentType<{
    to: string;
    assetIds: string[];
  }> | null;
  customLoadingPrimaryOfferPreview?: ReactNode;
  BatchSportSpecificQuery?: ComponentType<{ assetIds: string[] }> | null;
};
const PrimaryOfferGrid = ({
  renderStarterBundleProjection,
  CustomPreview = null,
  customLoadingPrimaryOfferPreview,
  BatchSportSpecificQuery = null,
}: Props) => {
  const { hits, results } = useHits();
  const { refine: setPage, currentRefinement: page, nbPages } = usePagination();

  const [sortedItems, setSortedItems] = useState<
    PrimaryOffersByIdsQuery_tokens_primaryOffers[] | undefined
  >(undefined);

  const primaryOffersIds = useMemo(
    () => hits.map((h: any) => idFromObject(h.sale.id) as string),
    [hits]
  );

  const { data, loading } = useQuery<
    PrimaryOffersByIdsQuery,
    PrimaryOffersByIdsQueryVariables
  >(PRIMARY_OFFERS_BY_IDS_QUERY, {
    variables: {
      ids: primaryOffersIds,
    },
    skip: !results || hits.length === 0,
  });

  useEffect(() => {
    if (loading || !data) {
      return;
    }

    const tokens = (data.tokens.primaryOffers || []).filter(primaryOffer => {
      const endDate = parseISO(primaryOffer.endDate);
      if (differenceInSeconds(Date.now(), endDate) > 10) {
        return false;
      }
      if (primaryOffer.cancelledAt || primaryOffer.buyer) {
        return false;
      }

      return primaryOffer;
    });

    const items = primaryOffersIds
      .map(hit => {
        return tokens.find(primaryOffer => {
          return idFromObject(primaryOffer.id) === hit;
        });
      })
      .filter(Boolean);

    // As we filter out the hits we receive from Algolia to handle indexing lags
    // we might be in a situation where there are no more hits to display.
    // This logic will go to the next page up to reaching page `MAX_AUTO_NEXT_PAGE` (safety)
    // until there are some hits left to display.
    if (
      hits.length > 0 &&
      data.tokens.primaryOffers.length > 0 &&
      items.length === 0 &&
      page < nbPages - 1 &&
      page < MAX_AUTO_NEXT_PAGE
    ) {
      setPage(page + 1);
    }
    setSortedItems(items);
  }, [hits, data, loading, primaryOffersIds, page, nbPages, setPage]);

  // If algolia return empty hits, we do not execute queries and do not set sortedItems.
  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned yet.
  // https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react-hooks/
  // eslint-disable-next-line no-underscore-dangle
  if (
    results &&
    // eslint-disable-next-line no-underscore-dangle
    !results.__isArtificial &&
    (results.nbHits === 0 || sortedItems?.length === 0)
  ) {
    return (
      <Empty
        title={
          <FormattedMessage
            id="primaryOfferGrid.empty.title"
            defaultMessage="Sold out"
          />
        }
        description={
          <EmptyContent>
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage
                id="primaryOfferGrid.empty.desc"
                defaultMessage="Come back later to catch the next batch."
              />
            </Text16>
            <EmptyMarket
              ctaMessage={
                <FormattedMessage
                  id="primaryOfferGrid.empty.cta"
                  defaultMessage="Check new card auctions"
                />
              }
            />
          </EmptyContent>
        }
      />
    );
  }

  // If algolia return results.nbHits > 0, queries are executed then sortedItem is set to [...]
  if (loading || !sortedItems) {
    return (
      <Loader
        customLoadingPrimaryOfferPreview={customLoadingPrimaryOfferPreview}
      />
    );
  }

  return (
    <StyledGrid>
      {BatchSportSpecificQuery && (
        <BatchSportSpecificQuery
          assetIds={sortedItems.flatMap(item =>
            item.nfts.map(nft => nft.assetId)
          )}
        />
      )}
      {sortedItems.map(item => {
        return (
          <StyledGridItem key={item.id}>
            <PrimaryOfferPreview
              primaryOffer={item}
              bundlePrediction={
                renderStarterBundleProjection
                  ? renderStarterBundleProjection(idFromObject(item.id)!)
                  : undefined
              }
              CustomPreview={CustomPreview}
            />
          </StyledGridItem>
        );
      })}
    </StyledGrid>
  );
};

export default PrimaryOfferGrid;
