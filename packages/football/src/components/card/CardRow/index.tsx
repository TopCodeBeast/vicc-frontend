import { gql } from '@apollo/client';

import FlexFill from '@sorare/core/src/atoms/layout/FlexFill';
import ResponsiveRow from '@sorare/core/src/atoms/layout/ResponsiveRow';

import { Token } from '@sorare/marketplace/src/components/token/Token';

/* eslint-disable sorare/no-unrendered-component-imports */
import BundledAuctionEligibilityByAssetIds from '@football/components/auction/BundledAuctionEligibilityByAssetIds';
/* eslint-disable sorare/no-unrendered-component-imports */
import CardPropertiesByAssetId from '@football/components/card/CardPropertiesByAssetId';
/* eslint-disable sorare/no-unrendered-component-imports */
import CardTeamsByAssetId from '@football/components/card/CardTeamsByAssetId';

import { CardRow_card } from './__generated__/index.graphql';

interface Props {
  count?: number;
  cards: CardRow_card[];
}

export const CardRow = ({ cards, count = 5 }: Props) => {
  return (
    <ResponsiveRow>
      {cards.map(
        c =>
          c.token && (
            <Token
              forceDesktopLayout
              hideSorareUser
              key={c.slug}
              token={c.token}
            />
          )
      )}
      <FlexFill count={count - cards.length} />
    </ResponsiveRow>
  );
};

CardRow.fragments = {
  card: gql`
    fragment CardRow_card on Card {
      slug
      assetId
      token {
        assetId
        slug
        ...Token_token
      }
      ...CardPropertiesByAssetId_card
      ...BundledAuctionEligibilityByAssetIds_card
      ...CardTeamsByAssetId_card
    }
    ${Token.fragments.token}
    ${CardPropertiesByAssetId.fragments.card}
    ${BundledAuctionEligibilityByAssetIds.fragments.card}
    ${CardTeamsByAssetId.fragments.card}
  `,
};

export default CardRow;
