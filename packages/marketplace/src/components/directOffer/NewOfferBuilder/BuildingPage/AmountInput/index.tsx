import Big from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Block from '@sorare/core/src/atoms/layout/Block';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import InputField from '@sorare/core/src/components/form/Form/InputField';
import useInputOnChangeCallback from '@sorare/core/src/components/form/Form/InputField/useInputOnChangeCallback';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import {
  getFiatMonetaryAmountIndex,
  getMonetaryAmountIndex,
} from '@sorare/core/src/lib/monetaryAmount';
import { fromWei, toWei } from '@sorare/core/src/lib/wei';

import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';
import FeesDetailsTooltip from '@marketplace/components/offer/FeesDetailsTooltip';
import { useStateOffer } from '@marketplace/hooks/offers/useStateOffer';
import {
  MarketFeeStatus,
  isMarketFeeEnabled,
} from '@marketplace/hooks/useMarketFeesHelperStatus';

import { setReceiveAmount, setSendAmount } from '../../actions';
import { CardDataType, StateProps } from '../../types';

const InputContainer = styled(Block)<{ $disabled: boolean }>`
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  ${props =>
    props.$disabled &&
    `background-color: var(--c-neutral-300);
    `}
`;
const MarketFeeHelper = styled.div`
  display: flex;
  gap: var(--unit);
`;

const AmountInput = <D extends CardDataType>({
  state,
  dispatch,
  receiver,
  marketFeeStatus = MarketFeeStatus.DISABLED,
}: StateProps<D> & {
  receiver?: boolean;
  counterOfferSport?: Sport;
  marketFeeStatus?: MarketFeeStatus;
}) => {
  const {
    fiatCurrency: { code: currencyCode },
    walletPreferences: { onlyShowFiatCurrency },
  } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();

  const {
    sendAmount,
    receiveAmount,
    sendAmountCurrency,
    receiveAmountCurrency,
    paymentMethod,
  } = state;
  const { marketFeeRateBasisPoints } = useConfigContext();
  const { receiveMinimumPrice, sendMinimumPrice } = useStateOffer(state);

  const referenceCurrency = receiver
    ? receiveAmountCurrency
    : sendAmountCurrency;
  const monetaryAmountIndex = getMonetaryAmountIndex(referenceCurrency);
  const amount = receiver ? receiveAmount : sendAmount;
  const minAmount = receiver ? receiveMinimumPrice : sendMinimumPrice;

  const getMarketFeeAmount = useCallback(
    (monetaryAmount: MonetaryAmountOutput) => {
      const res = new Big(monetaryAmount[monetaryAmountIndex]).multipliedBy(
        marketFeeRateBasisPoints
      );

      return toMonetaryAmount({
        [monetaryAmountIndex]: res.toString(),
        referenceCurrency,
      });
    },
    [
      marketFeeRateBasisPoints,
      monetaryAmountIndex,
      referenceCurrency,
      toMonetaryAmount,
    ]
  );

  const marketFeeAmount = getMarketFeeAmount(amount);

  const { main: feesMainAmount } = useAmountWithConversion({
    monetaryAmount: marketFeeAmount,
    primaryCurrency:
      referenceCurrency === SupportedCurrency.WEI
        ? Currency.ETH
        : Currency.FIAT,
  });

  const localCallback = useCallback(
    (newEthAmount: any, newFiatAmount: any) => {
      const newAmount = toMonetaryAmount({
        referenceCurrency,
        [monetaryAmountIndex]:
          referenceCurrency === SupportedCurrency.WEI
            ? toWei(newEthAmount)
            : Math.round(newFiatAmount * 100),
      });

      if (receiver) {
        const newMarketFeesAmount =
          newEthAmount > 0 && getMarketFeeAmount(newAmount);
        dispatch(setReceiveAmount(newAmount, newMarketFeesAmount || undefined));
        return;
      }
      dispatch(setSendAmount(newAmount));
    },
    [
      toMonetaryAmount,
      referenceCurrency,
      monetaryAmountIndex,
      receiver,
      dispatch,
      getMarketFeeAmount,
    ]
  );

  const onChangeCallback = useInputOnChangeCallback(
    localCallback,
    currencyCode
  );

  const disabled = useMemo(() => {
    if (receiver) {
      if (state.sendAmount.eur > 0) return true;
    } else if (state.receiveAmount.eur > 0) return true;
    return false;
  }, [receiver, state.receiveAmount.eur, state.sendAmount.eur]);

  const marketFeeEnabled = isMarketFeeEnabled(marketFeeStatus);

  const showMarketFeesHelper = marketFeeEnabled && amount.eur > 0 && !!receiver;

  return (
    <div>
      <InputContainer variant="square" border="around" $disabled={disabled}>
        <InputField
          currency={
            referenceCurrency === SupportedCurrency.WEI
              ? Currency.ETH
              : Currency.FIAT
          }
          ethAmount={fromWei(amount.wei)}
          fiatAmount={amount[getFiatMonetaryAmountIndex(currencyCode)] / 100}
          fiatCurrency={currencyCode}
          onChange={onChangeCallback}
          defaultCurrency={
            referenceCurrency === SupportedCurrency.WEI
              ? Currency.ETH
              : Currency.FIAT
          }
          minEthAmount={fromWei(minAmount.wei)}
          minFiatAmount={minAmount[getFiatMonetaryAmountIndex(currencyCode)]}
          highBid={new Big(minAmount[monetaryAmountIndex]).gt(
            amount[monetaryAmountIndex]
          )}
          disabled={disabled}
          hideConversion={
            referenceCurrency !== SupportedCurrency.WEI &&
            (paymentMethod === WalletPaymentMethod.FIAT_WALLET ||
              onlyShowFiatCurrency)
          }
        />
        {showMarketFeesHelper && (
          <>
            <MarketFeeHelper>
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage
                  id="AmountInput.marketFeeHelper"
                  defaultMessage="Market fee (incl. tax, if applicable):"
                />
              </Text16>
              <FeesDetailsTooltip
                monetaryAmount={amount}
                marketFeeMonetaryAmount={marketFeeAmount}
                marketFeeStatus={marketFeeStatus}
                referenceCurrency={referenceCurrency}
              />
            </MarketFeeHelper>
            <Text16 color="var(--c-neutral-600)">
              {marketFeeStatus === MarketFeeStatus.PARTIALLY_ENABLED ? (
                <FormattedMessage
                  id="AmountInput.marketFeeAmountPartial"
                  defaultMessage="Up to {marketFeeAmount}"
                  values={{ marketFeeAmount: feesMainAmount }}
                />
              ) : (
                feesMainAmount
              )}
            </Text16>
          </>
        )}
        {disabled && (
          <Caption style={{ marginTop: 8 }}>
            <FormattedMessage
              id="AmountInput.helper"
              defaultMessage="You cannot both receive and send funds in the same trade"
            />
          </Caption>
        )}
      </InputContainer>
    </div>
  );
};

export default AmountInput;
