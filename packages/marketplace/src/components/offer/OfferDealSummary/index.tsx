import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Blockquote from '@sorare/core/src/atoms/layout/Blockquote';
import { Text14, Text16, Text20 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import SelectedPaymentMethodForConfirmation from '@marketplace/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';
import TokenSummary from '@marketplace/components/buyActions/TokenSummary';
import useMarketFeesHelperStatus, {
  MarketFeeStatus,
  isMarketFeeEnabled,
} from '@marketplace/hooks/useMarketFeesHelperStatus';

import FeesDetailsTooltip from '../FeesDetailsTooltip';
import { OfferDealSummary_token } from './__generated__/index.graphql';

type NonDirectOfferDealTypes = 'auction' | 'sell' | 'buy';

export type DealType = NonDirectOfferDealTypes | 'offer';

const messages = defineMessages({
  amount: {
    id: 'DealSummary.amount',
    defaultMessage: 'Amount',
  },
  details: {
    id: 'DealSummary.details',
    defaultMessage: 'Offer details',
  },
  duration: {
    id: 'DealSummary.duration',
    defaultMessage: 'Offer duration',
  },
  durationWarnings: {
    id: 'DealSummary.duration.warning',
    defaultMessage:
      'The Cards and ETH you send in an offer are held. You cannot include the Cards or ETH in another offer.',
  },
  nbDays: {
    id: 'DealSummary.duration.nbDays',
    defaultMessage: '{nbDays, plural, one {# day} other {# days}}',
  },
  nothing: {
    id: 'DealSummary.section.nothing',
    defaultMessage: 'Nothing',
  },
});

type Props = {
  withEmpty?: boolean;
  receiver?: ReactNode;
  sender?: ReactNode;
  validationMessages?: Record<string, ReactNode>;
  sendWeiAmount?: string;
  sendTokens?: OfferDealSummary_token[];
  receiveWeiAmount?: string;
  marketFeeAmountWei?: string;
  receiveTokens?: OfferDealSummary_token[];
  duration?: number;
  actionType?: 'reject' | 'cancel' | 'accept' | 'counter';
  paymentMethod: WalletPaymentMethod | null;
};

const StyledNothing = styled.div`
  margin: 10px 0px;
`;

const Nothing = () => {
  return (
    <StyledNothing>
      <Blockquote variant="red">
        <Text14>
          <FormattedMessage {...messages.nothing} />
        </Text14>
      </Blockquote>
    </StyledNothing>
  );
};

interface TokensProps {
  tokens: OfferDealSummary_token[];
  validationMessages?: Record<string, ReactNode>;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const WarningWrapper = styled.div`
  padding: var(--double-unit) 0 var(--unit);
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--double-unit);
  background: var(--c-neutral-300);
  padding: var(--double-unit);
  gap: var(--half-unit);
`;

const Tokens = ({ tokens, validationMessages }: TokensProps) => {
  return (
    <>
      {tokens.map(token => (
        <ItemWrapper key={token.assetId}>
          <TokenSummary token={token} withoutRecentSales />
          {validationMessages?.[token.slug] && (
            <WarningWrapper>{validationMessages[token.slug]}</WarningWrapper>
          )}
        </ItemWrapper>
      ))}
    </>
  );
};

interface AmountsProps {
  amount: string;
  marketFeeAmountWei?: string;
  marketFeeStatus: MarketFeeStatus;
}

const AmountLabel = styled(Text20)`
  font-style: italic;
`;

const ExponentLabel = styled(Text14)`
  color: var(--c-neutral-600);
`;

const Amounts = ({
  amount,
  marketFeeStatus = MarketFeeStatus.DISABLED,
  marketFeeAmountWei,
}: AmountsProps) => {
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      [SupportedCurrency.WEI.toLowerCase()]: amount,
    },
  });
  if (amount === '0') {
    return null;
  }

  const isFeeEnabled = isMarketFeeEnabled(marketFeeStatus);

  return (
    <ItemWrapper>
      <AmountLabel>{main}</AmountLabel>
      {exponent && <ExponentLabel>{`≈ ${exponent}`}</ExponentLabel>}
      {marketFeeAmountWei && isFeeEnabled && (
        <FeesDetailsTooltip
          forceEthDisplay
          priceWei={amount}
          marketFeeAmountWei={marketFeeAmountWei}
          marketFeeStatus={marketFeeStatus}
        />
      )}
    </ItemWrapper>
  );
};

const OfferDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const OfferDetails = ({ duration }: Pick<Props, 'duration'>) => {
  if (!duration) {
    return null;
  }
  return (
    <OfferDetailsWrapper>
      <div>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage {...messages.duration} />
        </Text14>
        <Text16>
          <FormattedMessage
            {...messages.nbDays}
            values={{ nbDays: duration }}
          />
        </Text16>
      </div>
      <Blockquote variant="grey">
        <Text14>
          <FormattedMessage {...messages.durationWarnings} />
        </Text14>
      </Blockquote>
    </OfferDetailsWrapper>
  );
};

interface OfferLegDescriptionProps {
  withEmpty: boolean;
  title: ReactNode;
  amount: string;
  marketFeeStatus?: MarketFeeStatus;
  marketFeeAmountWei?: string;
  tokens: OfferDealSummary_token[];
  validationMessages?: Record<string, ReactNode>;
  paymentMethod?: WalletPaymentMethod | null;
}

const Description = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--unit);
`;

const OfferLegDescription = ({
  withEmpty,
  amount,
  marketFeeAmountWei,
  title,
  tokens,
  marketFeeStatus = MarketFeeStatus.DISABLED,
  validationMessages,
  paymentMethod,
}: OfferLegDescriptionProps) => {
  const {
    flags: { useNewWallet = false },
  } = useFeatureFlags();
  const empty = amount === '0' && tokens.length === 0;
  if (empty && !withEmpty) {
    return null;
  }
  return (
    <Description>
      {title}
      {empty ? (
        <Nothing />
      ) : (
        <>
          <Tokens tokens={tokens} validationMessages={validationMessages} />
          <Amounts
            amount={amount}
            marketFeeAmountWei={marketFeeAmountWei}
            marketFeeStatus={marketFeeStatus}
          />
          {useNewWallet && amount !== '0' && paymentMethod && (
            <>
              <Text14 color="var(--c-neutral-600)">
                <FormattedMessage {...glossary.payWith} />
              </Text14>
              <SelectedPaymentMethodForConfirmation
                paymentMethod={paymentMethod}
                paymentCurrency={
                  paymentMethod === WalletPaymentMethod.ETH_WALLET
                    ? Currency.ETH
                    : Currency.FIAT
                }
              />
            </>
          )}
        </>
      )}
    </Description>
  );
};

const OfferRow = styled.div`
  display: flex;
  gap: var(--double-unit);
  flex-direction: column;
  @media ${tabletAndAbove} {
    flex-direction: row;
    padding-bottom: var(--double-unit);
    border-bottom: var(--c-neutral-300) solid 1px;
  }
`;

const OfferDealSummary = ({
  sendWeiAmount = '0',
  sendTokens = [],
  receiveWeiAmount = '0',
  marketFeeAmountWei = '0',
  receiveTokens = [],
  withEmpty = false,
  duration,
  sender,
  receiver,
  validationMessages,
  paymentMethod,
}: Props) => {
  const marketFeeStatus = useMarketFeesHelperStatus(sendTokens);
  return (
    <Root>
      <OfferRow>
        <OfferLegDescription
          withEmpty={withEmpty}
          title={sender}
          amount={sendWeiAmount}
          tokens={sendTokens}
          validationMessages={validationMessages}
          paymentMethod={paymentMethod}
        />
        <OfferLegDescription
          withEmpty={withEmpty}
          title={receiver}
          amount={receiveWeiAmount}
          marketFeeStatus={marketFeeStatus}
          marketFeeAmountWei={marketFeeAmountWei}
          tokens={receiveTokens}
        />
      </OfferRow>
      <OfferDetails duration={duration} />
    </Root>
  );
};

OfferDealSummary.fragments = {
  token: gql`
    fragment OfferDealSummary_token on Token {
      assetId
      slug
      collection
      slug
      secondaryMarketFeeEnabled
      metadata {
        ... on TokenCricketMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          rarity
          playerSlug
        }
      }
      ...TokenSummary_token
    }
    ${TokenSummary.fragments.token}
  `,
};

export default OfferDealSummary;
