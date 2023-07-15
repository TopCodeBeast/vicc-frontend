import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { useTimeLeft } from '@sorare/core/src/hooks/useTimeLeft';

import { AuctionState_tokenAuction } from './__generated__/index.graphql';

const AuctionStateContainer = styled.div`
  text-align: center;
  color: var(--c-neutral-700);
`;

const AuctionState = ({
  displayEth,
  auction,
}: {
  displayEth: boolean;
  auction: AuctionState_tokenAuction;
}) => {
  const { bidsCount, currentPrice, currency, endDate } = auction;
  const { isEnded, message } = useTimeLeft(parseISO(endDate));
  const { main: ethAmount, exponent: fiatAmount } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: currency,
      [currency.toLowerCase()]: currentPrice,
    },
    primaryCurrency: Currency.ETH,
  });

  return (
    <AuctionStateContainer>
      <Text14>
        <FormattedMessage
          id="AuctionState.CurrentBid"
          defaultMessage="Current bid: <b>{value}</b>"
          values={{
            b: Bold,
            value: displayEth ? ethAmount : fiatAmount,
          }}
        />
      </Text14>
      <Text14>
        <FormattedMessage
          id="AuctionState.state"
          defaultMessage="{bidsCount, plural, one {1 bid} other {# bids}}"
          values={{
            bidsCount,
          }}
        />
        {' · '}
        {isEnded ? (
          <FormattedMessage
            id="AuctionState.state.ended"
            defaultMessage="Ended"
          />
        ) : (
          <FormattedMessage
            id="AuctionState.state.endsIn"
            defaultMessage="Ends in {timeRemaining}"
            values={{
              timeRemaining: message,
            }}
          />
        )}
      </Text14>
    </AuctionStateContainer>
  );
};

AuctionState.fragments = {
  tokenAuction: gql`
    fragment AuctionState_tokenAuction on TokenAuction {
      id
      bidsCount
      endDate
      currentPrice
      currency
    }
  `,
};

export default AuctionState;
