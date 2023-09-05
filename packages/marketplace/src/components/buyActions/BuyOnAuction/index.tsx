import qs from 'qs';
import { useHits } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  Rarity,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { ChevronRightBold } from '@sorare/core/src/atoms/icons/ChevronRightBold';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { InstantBlockchainCardSearch } from '@sorare/core/src/components/search/InstantSearch';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import UninteractiveToken from '@sorare/core/src/components/token/UninteractiveToken';
import { AUCTION_MARKET_URL } from '@sorare/core/src/constants/routes';
import { formatScarcity } from '@sorare/core/src/lib/cards';

import useDefaultFilters from '@marketplace/hooks/useDefaultFilters';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--c-neutral-200);
  padding: var(--unit);
  border-radius: var(--unit);
  gap: var(--unit);
  .dark-theme & {
    background-color: var(--c-neutral-300);
  }
`;

const Image = styled.div`
  flex-shrink: 0;
  width: calc(6 * var(--unit));
`;

const Metas = styled.div`
  flex-grow: 1;
  text-align: left;
`;

const Icon = styled.div`
  flex-shrink: 0;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--half-unit);
`;

type BuyOnAuctionPoweredByAlgoliaProps = {
  playerSlug?: string;
  rarity?: Rarity;
  sport?: Sport;
};

type BuyOnAuctionProps = {
  rarity: Rarity;
  sport: Sport;
};

const getMarketUrl = ({
  rarity,
  sport,
  playerName,
}: {
  rarity: Rarity;
  sport: Sport;
  playerName: string;
}) => {
  const params = {
    [SEARCH_PARAMS.RARITY]: rarity,
    [SEARCH_PARAMS.PLAYER_NAME]: playerName,
  };
  const res = `${AUCTION_MARKET_URL[sport]}${qs.stringify(params, {
    addQueryPrefix: true,
    skipNulls: true,
  })}`;
  return res;
};

export const BuyOnAuction = ({ rarity, sport }: BuyOnAuctionProps) => {
  const { hits, results } = useHits<{
    player: { display_name: string };
    sale: { price: number };
    picture_url: string;
  }>();

  if (!hits || hits.length === 0 || !results) return null;

  const hit = hits[0];
  const playerName = hit?.player?.display_name;
  const {
    sale: { price },
  } = hit;
  const { nbHits } = results;
  const weiAmount = (price * 10 ** 13).toString();
  const token = {
    slug: hit.objectID,
    assetId: hit.objectID,
    pictureUrl: hit.picture_url,
  };

  return (
    <Wrapper>
      <Title6 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="buyOnAuction.title"
          defaultMessage="Pay with card on auctions."
        />
      </Title6>
      <Text14 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="buyOnAuction.desc"
          defaultMessage="Buy directly from Vicc's new card auctions using your credit or debit card."
        />
      </Text14>
      <StyledLink to={getMarketUrl({ sport, playerName, rarity })}>
        <Image>
          <UninteractiveToken width={80} token={token} />
        </Image>
        <Metas>
          <Text14 bold color="var(--c-neutral-1000)">
            {playerName}
          </Text14>
          <Text14 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="buyOnAuction.metas"
              defaultMessage="{nbHits, plural, one {{nbHits} {rarity} Card available} other { {nbHits} {rarity} Cards available}}"
              values={{ nbHits, rarity: formatScarcity(rarity) }}
            />
          </Text14>
          <Price>
            <Text14 color="var(--c-neutral-1000)">
              <FormattedMessage
                id="buyOnAuction.price"
                defaultMessage="Starting at:"
              />
            </Text14>
            <AmountWithConversion
              monetaryAmount={{
                referenceCurrency: SupportedCurrency.WEI,
                wei: weiAmount,
              }}
            />
          </Price>
        </Metas>
        <Icon>
          <ChevronRightBold color="var(--c-neutral-600)" />
        </Icon>
      </StyledLink>
    </Wrapper>
  );
};
export const BuyOnAuctionPoweredByAlgolia = ({
  playerSlug,
  rarity,
  sport,
}: BuyOnAuctionPoweredByAlgoliaProps) => {
  const filters = useDefaultFilters({
    primary: true,
    bundled: false,
    playerSlug,
    rarity,
  });

  if (!playerSlug || !rarity || !sport) return null;

  return (
    <InstantBlockchainCardSearch
      indexes={['Lowest Price']}
      analyticsTags={['BuyOnAuction']}
      defaultHitsPerPage={1}
      sport={sport}
      defaultFilters={filters}
      attributesToRetrieve={[
        'assetId',
        'slug',
        'picture_url',
        'player.display_name',
        'sale.price',
      ]}
    >
      <BuyOnAuction rarity={rarity} sport={sport} />
    </InstantBlockchainCardSearch>
  );
};

export default BuyOnAuctionPoweredByAlgolia;
