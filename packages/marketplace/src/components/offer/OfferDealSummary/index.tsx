import { TypedDocumentNode, gql } from '@apollo/client';
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
import {
  MonetaryAmountOutput,
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';
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
      'The Cards and money you send in an offer are held. You cannot include the Cards or money in another offer.',
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
  sendAmount?: MonetaryAmountOutput;
  sendTokens?: OfferDealSummary_token[];
  receiveAmount?: MonetaryAmountOutput;
  marketFeeAmount?: MonetaryAmountOutput;
  receiveTokens?: OfferDealSummary_token[];
  sendAmountCurrency: SupportedCurrency;
  receiveAmountCurrency: SupportedCurrency;
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
  border-radius: var(--unit);
  background: var(--c-neutral-300);
  padding: var(--unit);
  gap: var(--half-unit);
`;

const Tokens = ({ tokens, validationMessages }: TokensProps) => {
  return (
    <>
      {tokens.map(token => (
        <ItemWrapper key={token.assetId}>
          <TokenSummary small token={token} withoutRecentSales />
          {validationMessages?.[token.slug] && (
            <WarningWrapper>{validationMessages[token.slug]}</WarningWrapper>
          )}
        </ItemWrapper>
      ))}
    </>
  );
};

const AmountLabel = styled(Text20)`
  font-style: italic;
`;

const ExponentLabel = styled(Text14)`
  color: var(--c-neutral-600);
`;

interface AmountsProps {
  amount: MonetaryAmountOutput;
  marketFeeAmount?: MonetaryAmountOutput;
  marketFeeStatus: MarketFeeStatus;
  referenceCurrency: SupportedCurrency;
}

const Amounts = ({
  amount,
  marketFeeStatus = MarketFeeStatus.DISABLED,
  marketFeeAmount,
  referenceCurrency,
}: AmountsProps) => {
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: amount,
    primaryCurrency:
      referenceCurrency === SupportedCurrency.WEI
        ? Currency.ETH
        : Currency.FIAT,
  });
  if (amount.eur === 0) {
    return null;
  }
  const isFeeEnabled = isMarketFeeEnabled(marketFeeStatus);
  return (
    <ItemWrapper>
      <AmountLabel>{main}</AmountLabel>
      {exponent && referenceCurrency === SupportedCurrency.WEI && (
        <ExponentLabel>{`≈ ${exponent}`}</ExponentLabel>
      )}
      {marketFeeAmount && isFeeEnabled && (
        <FeesDetailsTooltip
          monetaryAmount={amount}
          marketFeeMonetaryAmount={marketFeeAmount}
          referenceCurrency={referenceCurrency}
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
  amount: MonetaryAmountOutput;
  marketFeeStatus?: MarketFeeStatus;
  marketFeeAmount?: MonetaryAmountOutput;
  tokens: OfferDealSummary_token[];
  validationMessages?: Record<string, ReactNode>;
  paymentMethod?: WalletPaymentMethod | null;
  referenceCurrency: SupportedCurrency;
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
  marketFeeAmount,
  title,
  tokens,
  marketFeeStatus = MarketFeeStatus.DISABLED,
  validationMessages,
  paymentMethod,
  referenceCurrency,
}: OfferLegDescriptionProps) => {
  const {
    flags: { useCashWallet = false },
  } = useFeatureFlags();
  const empty = amount.wei === '0' && tokens.length === 0;
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
            marketFeeAmount={marketFeeAmount}
            marketFeeStatus={marketFeeStatus}
            referenceCurrency={referenceCurrency}
          />
          {useCashWallet && amount.eur !== 0 && paymentMethod && (
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
  sendAmount = zeroMonetaryAmount,
  sendAmountCurrency,
  sendTokens = [],
  receiveAmount = zeroMonetaryAmount,
  marketFeeAmount = zeroMonetaryAmount,
  receiveAmountCurrency,
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
          amount={sendAmount}
          tokens={sendTokens}
          validationMessages={validationMessages}
          paymentMethod={paymentMethod}
          referenceCurrency={sendAmountCurrency}
        />
        <OfferLegDescription
          withEmpty={withEmpty}
          title={receiver}
          amount={receiveAmount}
          marketFeeStatus={marketFeeStatus}
          marketFeeAmount={marketFeeAmount}
          tokens={receiveTokens}
          referenceCurrency={receiveAmountCurrency}
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
      secondaryMarketFeeEnabled
      metadata {
        ... on TokenMetadataInterface {
          id
          rarity
          playerSlug
        }
      }
      ...TokenSummary_token
    }
    ${TokenSummary.fragments.token}
  ` as TypedDocumentNode<OfferDealSummary_token>,
};

export default OfferDealSummary;
