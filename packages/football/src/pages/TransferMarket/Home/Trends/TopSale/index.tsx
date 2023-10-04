import { TypedDocumentNode, gql } from '@apollo/client';

import { FeaturedPageDuration } from '@sorare/core/src/__generated__/globalTypes';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { LEGACY_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import FlexToken from '@sorare/marketplace/src/components/token/FlexToken';
import TokenDescription from '@sorare/marketplace/src/components/token/TokenDescription';

import { Trend } from '@football/pages/TransferMarket/Home/Trends/Trend';
import {
  TrendDescription,
  TrendTitle,
} from '@football/pages/TransferMarket/Home/Trends/ui';

import { TopSale_tokenOwner } from './__generated__/index.graphql';

type Props = {
  tokenOwner: TopSale_tokenOwner;
  timeframe: FeaturedPageDuration;
};

export const TopSale = ({ tokenOwner, timeframe }: Props) => {
  const { generateSportPath } = useSportContext();
  const track = useEvents();

  const { price, token } = tokenOwner;
  const { sport, slug } = token;
  return (
    <Trend
      to={generateSportPath(LEGACY_CARD_SHOW, {
        sport,
        params: { slug },
      })}
      onClick={() =>
        track('Click Market Trend', {
          trend: 'sales',
          slug,
          timeframe,
        })
      }
      img={<FlexToken token={token} width={40} />}
      infos={
        <TokenDescription
          token={token}
          Title={TrendTitle}
          Details={TrendDescription}
          detailsColor="var(--c-neutral-600)"
          separator=" • "
          withoutLink
        />
      }
      numbers={<AmountWithConversion monetaryAmount={price} column />}
    />
  );
};

TopSale.fragments = {
  tokenOwner: gql`
    fragment TopSale_tokenOwner on Owner {
      id
      token {
        assetId
        slug
        sport
        ...FlexToken_token
        ...TokenDescription_token
      }
      price {
        ...MonetaryAmountFragment_monetaryAmount
      }
    }
    ${monetaryAmountFragment}
    ${FlexToken.fragments.token}
    ${TokenDescription.fragments.token}
  ` as TypedDocumentNode<TopSale_tokenOwner>,
};
