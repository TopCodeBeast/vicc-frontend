import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, TypographyVariant } from '@sorare/core/src/atoms/typography';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { format } from '@sorare/core/src/lib/seasons';

import ItemEligibility from '@football/components/card/ItemEligibility';

import { BundledAuctionTitle_card } from './__generated__/index.graphql';

interface Props {
  team: string | null;
  cards: BundledAuctionTitle_card[];
  Variant: TypographyVariant;
}

const Root = styled.div`
  display: flex;
  gap: 10px;
`;

export const BundledAuctionTitle = ({ team, cards, Variant }: Props) => {
  const [{ singleCivilYear, season }] = cards;

  return (
    <Root>
      <div>
        {team && (
          <Variant>
            <FormattedMessage {...transferMarket.bundle} />
            {team && (
              <>
                {' • '}
                {team}
              </>
            )}
          </Variant>
        )}
        <Text16>{format(season, { singleCivilYear })}</Text16>
      </div>
      <ItemEligibility cards={cards} />
    </Root>
  );
};

BundledAuctionTitle.fragments = {
  card: gql`
    fragment BundledAuctionTitle_card on Card {
      assetId
      slug
      singleCivilYear
      season {
        id
        startYear
      }
      ...ItemEligibility_card
    }
    ${ItemEligibility.fragments.card}
  `,
};

export default BundledAuctionTitle;
