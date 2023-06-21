import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { TypographyVariant } from '@core/atoms/typography';
import { isA } from '@core/lib/gql';

import { BundledAuctionName_auction } from './__generated__/index.graphql';

type BundledAuctionName_auction_contentProvider_Competition =
  BundledAuctionName_auction['contentProvider'] & { __typename: 'Competition' };

interface Props {
  bundledAuction: BundledAuctionName_auction;
  className?: string;
  Variant: TypographyVariant;
}

export const BundledAuctionName = ({ bundledAuction, Variant }: Props) => {
  const { contentProvider } = bundledAuction;

  const description =
    isA<BundledAuctionName_auction_contentProvider_Competition>(
      'Competition',
      contentProvider
    )
      ? contentProvider?.displayName
      : contentProvider?.name;

  return (
    <Variant>
      <FormattedMessage
        id="Cards.bundle"
        defaultMessage="Bundle • {name}"
        values={{ name: contentProvider ? description : '' }}
      />
    </Variant>
  );
};

BundledAuctionName.fragments = {
  auction: gql`
    fragment BundledAuctionName_auction on EnglishAuctionInterface {
      slug
      contentProvider {
        ... on Club {
          slug
          name
        }
        ... on NationalTeam {
          slug
          name
        }
        ... on Competition {
          slug
          displayName
        }
      }
    }
  `,
};

export default BundledAuctionName;
