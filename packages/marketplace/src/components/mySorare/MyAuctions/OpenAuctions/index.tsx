import { TypedDocumentNode, gql } from '@apollo/client';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { extractArrayData } from '@sorare/core/src/gql/extractData';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { Auction } from '@marketplace/components/auction/Auction';

import DisplayItems from '../../common/DisplayItems';
import { OpenSaleSortType } from '../../common/types';
import {
  OpenTokenAuctionsQuery,
  OpenTokenAuctionsQueryVariables,
} from './__generated__/index.graphql';

const OPEN_TOKEN_AUCTIONS_QUERY = gql`
  query OpenTokenAuctionsQuery($newlyListed: Boolean, $sport: [Sport!]) {
    currentUser {
      slug
      buyingAuctions(newlyListed: $newlyListed, sport: $sport) {
        id
        ...Auction_auction
      }
    }
  }
  ${Auction.fragments.auction}
` as TypedDocumentNode<OpenTokenAuctionsQuery, OpenTokenAuctionsQueryVariables>;

const OpenAuctions = ({
  sortType,
  sport,
}: {
  sortType: OpenSaleSortType;
  sport: Sport[];
}) => {
  const newlyListed = sortType === OpenSaleSortType.NEWLY_LISTED;
  const { loading, data } = useQuery(OPEN_TOKEN_AUCTIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      newlyListed,
      sport,
    },
  });

  const { items, count } = extractArrayData(
    data?.currentUser?.buyingAuctions,
    p => <Auction key={p.id} auction={p} />
  );

  const displayLoading = !items && loading;

  return (
    <DisplayItems displayLoading={displayLoading} count={count} items={items} />
  );
};

export default OpenAuctions;
