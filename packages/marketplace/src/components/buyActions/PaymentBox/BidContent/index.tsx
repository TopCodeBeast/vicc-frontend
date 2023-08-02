import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text16 } from '@sorare/core/src/atoms/typography';
import MonetaryInputField from '@sorare/core/src/components/form/Form/MonetaryInputField';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { Currency } from '@sorare/core/src/lib/currency';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';
import { fromWei } from '@sorare/core/src/lib/wei';

import AuctionState from '@marketplace/components/buyActions/BidField/AuctionState';
import { usePaymentContext } from '@marketplace/components/buyActions/Context';
import { PaymentProvider_auction } from '@marketplace/components/buyActions/PaymentProvider/__generated__/fragments.graphql';
import { BuyConfirmationProviderStateProps } from '@marketplace/contexts/buyingConfirmation';

import { SummaryTableTotal } from '../SummaryTable/SummaryTableTotal';

const messages = defineMessages({
  bidInputTitle: {
    id: 'NewPaymentBox.bidInputTitle',
    defaultMessage: 'Your bid',
  },
  autoBidInputTitle: {
    id: 'NewPaymentBox.autoBidInputTitle',
    defaultMessage: 'Your max bid',
  },
  outBidInputTitle: {
    id: 'NewPaymentBox.outBidInputTitle',
    defaultMessage: 'New max bid',
  },
});

interface Props {
  auction: PaymentProvider_auction;
  loadingPolling?: boolean;
  outBidByAutoBid?: boolean;
  isLoading?: boolean;
  setOutBidCallback?: React.Dispatch<
    React.SetStateAction<((string: any) => void) | undefined>
  >;
  confirmationProviderStateProps?: Omit<
    BuyConfirmationProviderStateProps,
    'payment' | 'customAmountDisplay'
  >;
  referenceCurrency: SupportedCurrency;
}

const InputTitle = styled(Text16)`
  text-align: center;
  display: flex;
  align-items: center;
  gap: var(--unit);
  justify-content: center;
`;

const WarningContainer = styled.div`
  color: var(--c-red-600);
  border-radius: var(--unit);
  text-align: center;
`;

const BidInput = styled.div`
  &.usingConversionCredit {
    margin-bottom: var(--double-unit);
  }
`;

const OutBidByAutoBidWarning = () => {
  return (
    <WarningContainer>
      <FormattedMessage
        id="NewPaymentBox.outBidByAutoBid"
        defaultMessage="Another bidder is winning. Increase your bid."
      />
    </WarningContainer>
  );
};

const BidContent = (props: Props) => {
  const {
    currency,
    fiatCurrency: { code },
    walletPreferences: { onlyShowFiatCurrency },
  } = useCurrentUserContext();
  const { formatWei, formatNumber } = useIntlContext();

  const [displayEth, setDisplayEth] = useState(
    !onlyShowFiatCurrency && currency === Currency.ETH
  );

  const {
    auction,
    outBidByAutoBid = false,
    isLoading,
    setOutBidCallback,
  } = props;

  const monetaryAmountIndex = getMonetaryAmountIndex(code) as
    | 'eur'
    | 'usd'
    | 'gbp';

  const {
    defaultMonetaryAmount,
    monetaryAmount,
    updateAmountFromEth,
    fiatCurrency,
    updateAmountFromFiat,
    amountTooLow,
    sport,
    usingConversionCredit,
    totalMonetaryAmount,
    isFiat,
    conversionCreditMonetaryAmount,
  } = usePaymentContext();

  const ethMinimumAmount = formatWei(defaultMonetaryAmount.wei, undefined, {
    maximumFractionDigits: 4,
  });
  const fiatMinimumAmount = useMemo(
    () =>
      formatNumber(defaultMonetaryAmount[monetaryAmountIndex] / 100, {
        style: 'currency',
        currency: fiatCurrency,
      }),
    [formatNumber, defaultMonetaryAmount, monetaryAmountIndex, fiatCurrency]
  );

  const ethAmount = useMemo(
    () => fromWei(monetaryAmount.wei),
    [monetaryAmount.wei]
  );

  const fiatAmount = useMemo(
    () => monetaryAmount[monetaryAmountIndex] / 100,
    [monetaryAmountIndex, monetaryAmount]
  );

  const autoBidTitle = outBidByAutoBid
    ? messages.outBidInputTitle
    : messages.autoBidInputTitle;

  const inputTitle = auction?.autoBid ? autoBidTitle : messages.bidInputTitle;

  const onChange = useCallback(
    (inputCurrency: Currency, amount: number) => {
      if (inputCurrency === Currency.FIAT) {
        updateAmountFromFiat(amount, code as SupportedCurrency);
      } else {
        updateAmountFromEth(amount);
      }
    },
    [code, updateAmountFromEth, updateAmountFromFiat]
  );

  return (
    <>
      <AuctionState displayEth={displayEth} auction={auction} />
      {outBidByAutoBid && !isLoading && <OutBidByAutoBidWarning />}
      <div>
        <BidInput className={classNames({ usingConversionCredit })}>
          <InputTitle bold>
            <FormattedMessage {...inputTitle} />
            {auction?.autoBid && (
              <Tooltip
                enterTouchDelay={0}
                interactive
                placement="top"
                title={
                  <FormattedMessage
                    id="NewPaymentBox.autoBidTooltip"
                    defaultMessage="Sorare will continue to bid up on your behalf until your max bid is reached."
                  />
                }
              >
                <FontAwesomeIcon
                  color="var(--c-neutral-600)"
                  icon={faInfoCircle}
                />
              </Tooltip>
            )}
          </InputTitle>
          <MonetaryInputField
            ethAmount={ethAmount}
            fiatAmount={fiatAmount}
            fiatCurrency={fiatCurrency}
            onChange={onChange}
            defaultCurrency={currency}
            onToggleEthDisplay={setDisplayEth}
            setOutBidCallback={setOutBidCallback}
            error={
              amountTooLow &&
              !isLoading && (
                <WarningContainer>
                  <FormattedMessage
                    id="BidInput.amountTooLow"
                    defaultMessage="Please bid {value} or higher"
                    values={{
                      value: displayEth ? ethMinimumAmount : fiatMinimumAmount,
                    }}
                  />
                </WarningContainer>
              )
            }
          />
        </BidInput>
        {usingConversionCredit && (
          <SummaryTableTotal
            usingConversionCredit={usingConversionCredit}
            sport={sport}
            currency={displayEth ? Currency.ETH : Currency.FIAT}
            totalMonetaryAmount={totalMonetaryAmount}
            isFiat={isFiat}
            conversionCreditMonetaryAmount={conversionCreditMonetaryAmount}
          />
        )}
      </div>
    </>
  );
};

export default BidContent;
