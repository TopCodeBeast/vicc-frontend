import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { TypographyVariant } from '@core/atoms/typography';
import { transferMarket } from '@core/lib/glossary';

import { BundledTokenAuctionName_tokenAuction } from './__generated__/index.graphql';

interface Props {
  tokenAuction: BundledTokenAuctionName_tokenAuction;
  className?: string;
  Variant: TypographyVariant;
}

export const BundledTokenAuctionName = ({ tokenAuction, Variant }: Props) => {
  const { team } = tokenAuction;

  return (
    <Variant>
      <FormattedMessage {...transferMarket.bundle} />
      {team && (
        <>
          {' • '}
          {team}
        </>
      )}
    </Variant>
  );
};

BundledTokenAuctionName.fragments = {
  tokenAuction: gql`
    fragment BundledTokenAuctionName_tokenAuction on Auction {
      id
      team
    }
  ` as TypedDocumentNode<BundledTokenAuctionName_tokenAuction>,
};
