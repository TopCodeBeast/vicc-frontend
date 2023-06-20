import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Collection,
  Currency,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import { Skeleton } from '@sorare/core/src/atoms/animations/Skeleton';
import Block from '@sorare/core/src/atoms/layout/Block';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import { range } from '@sorare/core/src/lib/arrays';
import { isA } from '@sorare/core/src/lib/gql';

import FlexToken from 'components/token/FlexToken';
import { PriceHistoryQuery } from 'hooks/__generated__/useGetPriceHistory.graphql';
import useGetPriceHistory from 'hooks/useGetPriceHistory';

import PriceHistoryDate from '../PriceHistoryDate';
import PriceHistoryValue from '../PriceHistoryValue';

type PriceHistoryQuery_tokens_tokenPrices =
  PriceHistoryQuery['tokens']['tokenPrices'][number];

type PriceHistoryQuery_tokens_tokenPrices_deal =
  PriceHistoryQuery_tokens_tokenPrices['deal'];

type PriceHistoryQuery_tokens_tokenPrices_deal_TokenAuction =
  PriceHistoryQuery_tokens_tokenPrices_deal & { __typename: 'TokenAuction' };

type PriceHistoryQuery_tokens_tokenPrices_deal_TokenAuction_nfts =
  PriceHistoryQuery_tokens_tokenPrices_deal_TokenAuction['nfts'][number];

type PriceHistoryQuery_tokens_tokenPrices_deal_TokenOffer =
  PriceHistoryQuery_tokens_tokenPrices_deal & { __typename: 'TokenOffer' };

type PriceHistoryQuery_tokens_tokenPrices_deal_TokenOffer_senderSide_nfts =
  PriceHistoryQuery_tokens_tokenPrices_deal_TokenOffer['senderSide']['nfts'][number];

const messages = defineMessages({
  noResult: {
    id: 'PriceHistory.noResult',
    defaultMessage: 'No recent sales',
  },
  auction: {
    id: 'PriceHistory.auction',
    defaultMessage: 'Auction',
  },
  publicOffer: {
    id: 'PriceHistory.publicOffer',
    defaultMessage: 'Public offer',
  },
});

const HistoryList = styled.div`
  display: flex;
  overflow: auto;
  gap: var(--half-unit);
  flex-direction: column;
`;
const SkeletonWrapped = styled(Skeleton)`
  width: 100%;
  height: 88.5px;
  display: block;
`;

export const EmptyResult = styled(Block)`
  padding: var(--intermediate-unit);
  &.compact {
    font: var(--t-12);
    padding: var(--unit);
  }
`;

const ItemLink = styled(OpenItemDialogLink)`
  display: grid;
  grid-template-areas:
    'card deal fiat'
    'card date eth';
  grid-template-columns: 40px 1fr 1fr;
  column-gap: var(--intermediate-unit);
  padding: var(--intermediate-unit);
`;

const Card = styled.div`
  grid-area: card;
`;
const Deal = styled(Text16)`
  grid-area: deal;
  align-self: flex-end;
`;
const Date = styled(Text14)`
  grid-area: date;
  align-self: flex-start;
`;
const Fiat = styled(Text16)`
  grid-area: fiat;
  align-self: flex-end;
  text-align: right;
`;
const Eth = styled(Text14)`
  grid-area: eth;
  align-self: flex-start;
  text-align: right;
`;

type TransactionToken =
  | PriceHistoryQuery_tokens_tokenPrices_deal_TokenAuction_nfts
  | PriceHistoryQuery_tokens_tokenPrices_deal_TokenOffer_senderSide_nfts;
export interface ItemProps {
  priceHistorySample: PriceHistoryQuery_tokens_tokenPrices;
  currency?: Currency;
  onClick?: (token: TransactionToken) => void;
  count?: number;
}

const TransactionLabel = ({
  deal,
}: {
  deal: PriceHistoryQuery_tokens_tokenPrices_deal;
}) => {
  if (
    isA<PriceHistoryQuery_tokens_tokenPrices_deal_TokenAuction>(
      'TokenAuction',
      deal
    )
  )
    return <FormattedMessage {...messages.auction} />;
  return <FormattedMessage {...messages.publicOffer} />;
};

const getTokenFromDeal = (deal: PriceHistoryQuery_tokens_tokenPrices_deal) => {
  const dealIsTokenOffer =
    isA<PriceHistoryQuery_tokens_tokenPrices_deal_TokenOffer>(
      'TokenOffer',
      deal
    );

  const items = dealIsTokenOffer ? deal.senderSide.nfts : deal.nfts;
  if (items.length === 1) return items[0];
  return null;
};

const Item = ({ priceHistorySample, onClick }: ItemProps) => {
  const token = getTokenFromDeal(priceHistorySample.deal);

  if (!token) return null;

  return (
    <Block noCollapse noPadding>
      <ItemLink
        onClick={() => {
          if (onClick) onClick(token);
        }}
        item={token}
        sport={token.sport}
      >
        <Card>
          <FlexToken token={token} width={80} />
        </Card>
        <Deal color="var(--c-neutral-1000)">
          <TransactionLabel deal={priceHistorySample.deal} />
        </Deal>
        <Date color="var(--c-neutral-600)">
          <PriceHistoryDate date={priceHistorySample.date} />
        </Date>
        <Fiat bold color="var(--c-neutral-1000)">
          <PriceHistoryValue
            amount={priceHistorySample.amount}
            amountInFiat={priceHistorySample.amountInFiat}
            currency={Currency.FIAT}
          />
        </Fiat>
        <Eth color="var(--c-neutral-600)">
          <PriceHistoryValue
            amount={priceHistorySample.amount}
            amountInFiat={priceHistorySample.amountInFiat}
            currency={Currency.ETH}
          />
        </Eth>
      </ItemLink>
    </Block>
  );
};

const PriceHistoryFromProps = ({
  variables,
  currency,
  count = 5,
  onClick,
}: Omit<ItemProps, 'priceHistorySample'> & {
  variables: {
    rarity: Rarity;
    collection: Collection;
    playerSlug: string;
  };
}) => {
  const { data, loading } = useGetPriceHistory(variables);
  const priceHistory = data?.tokens?.tokenPrices.slice(0, count);

  if (!loading && !data) return null;

  if (!loading && priceHistory?.length === 0) {
    return (
      <EmptyResult>
        <FormattedMessage {...messages.noResult} />
      </EmptyResult>
    );
  }

  return (
    <HistoryList>
      {loading
        ? range(count).map(i => (
            <Block noPadding key={i}>
              <SkeletonWrapped />
            </Block>
          ))
        : priceHistory?.map(priceHistorySample => (
            <Item
              key={priceHistorySample.id}
              currency={currency}
              priceHistorySample={priceHistorySample}
              onClick={onClick}
            />
          ))}
    </HistoryList>
  );
};

export default PriceHistoryFromProps;
