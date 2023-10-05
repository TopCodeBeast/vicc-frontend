import { TypedDocumentNode, gql } from '@apollo/client';

import {
  OfferDirection,
  OfferState,
  SortingOption,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import DirectOffer from '../DirectOffer';
import DisplayItems from '../DisplayItems';
import { DefaultSortType, OfferSelectType } from '../types';
import {
  MyOffersQuery,
  MyOffersQueryVariables,
} from './__generated__/index.graphql';

export const OPENED_STATES = [
  OfferState.OPENED,
  OfferState.PENDING_REJECTION,
  OfferState.MINTED,
  OfferState.SETTLEABLE,
  OfferState.SETTLEMENT_PUBLISHED,
];

export const ENDED_STATES = [
  OfferState.ACCEPTED,
  OfferState.CANCELLED,
  OfferState.REJECTED,
  OfferState.ENDED,
  OfferState.FLAGGED,
];

export const statesFromSelectType = (selectType: OfferSelectType) => {
  return {
    [OfferSelectType.ALL_OFFERS]: null,
    [OfferSelectType.OPEN_OFFERS]: OPENED_STATES,
    [OfferSelectType.ENDED_OFFERS]: ENDED_STATES,
    [OfferSelectType.ACCEPTED_OFFERS]: [OfferState.ACCEPTED],
    [OfferSelectType.REJECTED_OFFERS]: [OfferState.REJECTED],
  }[selectType];
};

const MY_OFFERS_QUERY = gql`
  query MyOffersQuery(
    $cursor: String
    $direction: OfferDirection!
    $sortType: SortingOption
    $sport: [Sport!]
    $states: [OfferState!]
  ) {
    currentUser {
      slug
      offers(
        direction: $direction
        first: 10
        after: $cursor
        sortType: $sortType
        sport: $sport
        states: $states
      ) {
        totalCount
        nodes {
          id
          ...MyViccDirectOffer_tokenOffer
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${DirectOffer.fragments.tokenOffer}
` as TypedDocumentNode<MyOffersQuery, MyOffersQueryVariables>;

export const DisplayMyOffers = ({
  sortType: sortTypeProp,
  sport,
  direction,
  states,
}: {
  sortType: DefaultSortType;
  sport: Sport[];
  direction: OfferDirection;
  states: OfferState[] | null;
}) => {
  const sortType =
    sortTypeProp === DefaultSortType.LATEST
      ? SortingOption.DESC
      : SortingOption.ASC;
  const { loading, data, loadMore } = usePaginatedQuery(MY_OFFERS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    connection: 'TokenOfferConnection',
    variables: {
      sortType,
      sport,
      direction,
      states,
    },
  });

  const { items, count, cursor, hasMore } = extractConnectionData(
    data?.currentUser?.offers,
    node => <DirectOffer key={node!.id} offer={node!} />
  );

  const displayLoading = !items && loading;

  return (
    <DisplayItems
      displayLoading={displayLoading}
      count={count}
      items={items}
      loadMoreSection={{
        hasMore,
        loading,
        loadMore: () => {
          loadMore(false, {
            cursor,
            sortType,
            sport,
            direction,
            states,
          });
        },
      }}
    />
  );
};
