import { gql } from '@apollo/client';

import { FeaturedPageDuration } from '@sorare/core/src/__generated__/globalTypes';
import AmountWithConversion from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { LEGACY_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import FlexToken from '@sorare/marketplace/src/components/token/FlexToken';
import TokenDescription from '@sorare/marketplace/src/components/token/TokenDescription';

import { Trend } from '@sorare/football/src/pages/TransferMarket/Home/Trends/Trend';
import {
  TrendDescription,
  TrendTitle,
} from '@sorare/football/src/pages/TransferMarket/Home/Trends/ui';

import { TopSale_tokenOwner } from './__generated__/index.graphql';

type Props = {
  tokenOwner: TopSale_tokenOwner;
  timeframe: FeaturedPageDuration;
};

export const TopSale = ({ tokenOwner, timeframe }: Props) => {
  const { generateSportPath } = useSportContext();
  const track = useEvents();

  return (
    <Trend
      to={generateSportPath(LEGACY_CARD_SHOW, {
        sport: tokenOwner.token.sport,
        params: { slug: tokenOwner.token.slug },
      })}
      onClick={() =>
        track('Click Market Trend', {
          trend: 'sales',
          slug: tokenOwner.token.slug,
          timeframe,
        })
      }
      img={<FlexToken token={tokenOwner.token} />}
      infos={
        <TokenDescription
          token={tokenOwner.token}
          Title={TrendTitle}
          Details={TrendDescription}
          detailsColor="var(--c-neutral-600)"
          separator=" • "
          withoutLink
        />
      }
      numbers={
        <AmountWithConversion
          column
          amount={tokenOwner.priceWei}
          amountInFiat={tokenOwner.priceFiat}
          unit="wei"
          context="Market.Home.Trends.TopSales"
        />
      }
    />
  );
};

TopSale.fragments = {
  tokenOwner: gql`
    fragment TopSale_tokenOwner on TokenOwner {
      id
      token {
        assetId
        slug
        sport
        ...FlexToken_token
        ...TokenDescription_token
      }
      priceFiat {
        eur
        usd
        gbp
      }
      priceWei
    }
    ${FlexToken.fragments.token}
    ${TokenDescription.fragments.token}
  `,
};
