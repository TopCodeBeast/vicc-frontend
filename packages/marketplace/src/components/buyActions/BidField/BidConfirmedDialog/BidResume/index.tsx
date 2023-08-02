import { TypedDocumentNode, gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import {
  MonetaryAmount,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { useTimeLeft } from '@sorare/core/src/hooks/useTimeLeft';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { BidResume_tokenAuction } from './__generated__/index.graphql';

const messages = defineMessages({
  yourCurrentBid: {
    id: 'BidResume.currentBidTitle',
    defaultMessage: 'Your current bid',
  },
  yourMaxBid: {
    id: 'BidResume.yourMaxBid',
    defaultMessage: 'Your max bid',
  },
  timeLeft: {
    id: 'BidResume.timeLeft',
    defaultMessage: 'Auction ends in {timeLeft}',
  },
});

const Content = styled.div`
  width: 100%;
  border: solid 1px var(--c-neutral-400);
  border-radius: var(--unit);
  text-align: left;
`;

const FirstRow = styled.div`
  display: flex;
  border-bottom: solid 1px var(--c-neutral-400);

  > div {
    border-left: solid 1px var(--c-neutral-400);

    &:first-child {
      border-left: none;
    }
  }
`;

const Cell = styled.div`
  padding: var(--unit);
  flex-grow: 1;
`;

type AmountCellProps = {
  title: MessageDescriptor;
  referenceCurrency: SupportedCurrency;
  amount: string;
  maximumAmounts?: MonetaryAmount;
};

const AmountCell = ({
  title,
  amount,
  maximumAmounts,
  referenceCurrency,
}: AmountCellProps) => {
  return (
    <Cell>
      <Text14 bold>
        <FormattedMessage {...title} />
      </Text14>
      <AmountWithConversion
        monetaryAmount={
          maximumAmounts || {
            referenceCurrency,
            [referenceCurrency.toLowerCase()]: amount,
          }
        }
        column
      />
    </Cell>
  );
};

const BidResume = ({ auction }: { auction: BidResume_tokenAuction }) => {
  const { message } = useTimeLeft(parseISO(auction.endDate));
  if (!auction.bestBid) return null;

  return (
    <Content>
      <FirstRow>
        <AmountCell
          title={messages.yourCurrentBid}
          amount={auction.currentPrice}
          referenceCurrency={auction.currency}
        />
        {auction.autoBid && (
          <AmountCell
            title={messages.yourMaxBid}
            amount={auction.currentPrice}
            referenceCurrency={auction.currency}
            maximumAmounts={auction.myBestBid?.maximumAmounts}
          />
        )}
      </FirstRow>
      <Cell>
        <Text14>
          <FormattedMessage
            {...messages.timeLeft}
            values={{ timeLeft: message }}
          />
        </Text14>
      </Cell>
    </Content>
  );
};

BidResume.fragments = {
  tokenAuction: gql`
    fragment BidResume_tokenAuction on TokenAuction {
      id
      bidsCount
      endDate
      currentPrice
      currency
      autoBid
      bestBid {
        id
      }
      myBestBid {
        id
        maximumAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<BidResume_tokenAuction>,
};

export default BidResume;
