import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Caption } from '@sorare/core/src/atoms/typography';

import { BidsCount_auction } from './__generated__/index.graphql';

interface Props {
  auction: BidsCount_auction;
}

export const BidsCount = ({ auction }: Props) => {
  return (
    <Caption color="var(--c-neutral-600)">
      <FormattedMessage
        id="SaleInfo.bids"
        defaultMessage="{bids, plural, one {# bid} other {# bids}}"
        values={{ bids: auction.bidsCount }}
      />
    </Caption>
  );
};

BidsCount.fragments = {
  auction: gql`
    fragment BidsCount_auction on TokenAuction {
      id
      bidsCount
    }
  ` as TypedDocumentNode<BidsCount_auction>,
};
