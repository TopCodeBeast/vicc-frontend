import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Block from '@sorare/core/src/atoms/layout/Block';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import InputField from '@sorare/core/src/components/form/Form/InputField';
import useInputOnChangeCallback from '@sorare/core/src/components/form/Form/InputField/useInputOnChangeCallback';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { roundCeilFloat, toWei } from '@sorare/core/src/lib/wei';
import { theme } from '@sorare/core/src/style/theme';

import FeesDetailsTooltip from '@sorare/marketplace/src/components/offer/FeesDetailsTooltip';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import {
  MarketFeeStatus,
  isMarketFeeEnabled,
} from '@sorare/marketplace/src/hooks/useMarketFeesHelperStatus';

import { setReceiveEth, setSendEth } from '../../actions';
import { CardDataType, StateProps } from '../../types';

const InputContainer = styled(Block)<{ $disabled: boolean }>`
  padding: var(--double-unit);
  border-radius: ${theme.radius.md}px;
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
  counterOfferSport,
  marketFeeStatus = MarketFeeStatus.DISABLED,
}: StateProps<D> & {
  receiver?: boolean;
  counterOfferSport?: Sport;
  marketFeeStatus?: MarketFeeStatus;
}) => {
  const {
    fiatCurrency: { code: currencyCode },
    currency,
  } = useCurrentUserContext();
  const { convertFromEth } = useCurrencyConverters();
  const { sendEth, minSendEth, minReceiveEth, receiveEth } = state;
  const { getMarketFeesRateBySport } = useConfigContext();
  const { secondaryMarketFeesRate } = useMarketplaceContext();

  const ethAmount = receiver ? receiveEth : sendEth;
  const minEth = receiver ? minReceiveEth : minSendEth;

  const getMarketFeeAmount = useCallback(
    (amount: number) => {
      const res = counterOfferSport
        ? getMarketFeesRateBySport(counterOfferSport) * amount
        : secondaryMarketFeesRate * amount;
      return roundCeilFloat(res, 5);
    },
    [counterOfferSport, getMarketFeesRateBySport, secondaryMarketFeesRate]
  );

  const marketFeeAmount = getMarketFeeAmount(ethAmount);

  const [fiatAmount, setFiatAmount] = useState<number>(() =>
    roundCeilFloat(convertFromEth(ethAmount, currencyCode), 2)
  );

  const localCallback = useCallback(
    (newEthAmount, newFiatAmount) => {
      setFiatAmount(newFiatAmount);
      if (receiver) {
        const newMarketFeesAmount =
          newEthAmount > 0 && getMarketFeeAmount(newEthAmount);
        dispatch(setReceiveEth(newEthAmount, newMarketFeesAmount || undefined));
        return;
      }
      dispatch(setSendEth(newEthAmount));
    },
    [receiver, dispatch, getMarketFeeAmount]
  );

  const onChangeCallback = useInputOnChangeCallback(
    localCallback,
    currencyCode
  );

  const minFiatAmount = useMemo(
    () => convertFromEth(minEth, currencyCode),
    [convertFromEth, minEth, currencyCode]
  );

  const disabled = useMemo(() => {
    if (receiver) {
      if (state.sendEth > 0) return true;
    } else if (state.receiveEth > 0) return true;
    return false;
  }, [receiver, state.receiveEth, state.sendEth]);

  const marketFeeEnabled = isMarketFeeEnabled(marketFeeStatus);

  const showMarketFeesHelper = marketFeeEnabled && ethAmount > 0 && !!receiver;

  return (
    <div>
      <InputContainer variant="square" border="around" $disabled={disabled}>
        <InputField
          currency={state.currency}
          ethAmount={ethAmount}
          fiatAmount={fiatAmount}
          fiatCurrency={currencyCode}
          onChange={onChangeCallback}
          defaultCurrency={currency}
          minEthAmount={minEth}
          minFiatAmount={minFiatAmount}
          highBid={minEth > ethAmount}
          disabled={disabled}
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
                forceEthDisplay
                priceWei={toWei(ethAmount)}
                marketFeeAmountWei={toWei(marketFeeAmount)}
                marketFeeStatus={marketFeeStatus}
              />
            </MarketFeeHelper>
            <Text16 color="var(--c-neutral-600)">
              {marketFeeStatus === MarketFeeStatus.PARTIALLY_ENABLED ? (
                <FormattedMessage
                  id="AmountInput.marketFeeAmountPartial"
                  defaultMessage="Up to {marketFeeAmount} ETH"
                  values={{ marketFeeAmount }}
                />
              ) : (
                <FormattedMessage
                  id="AmountInput.marketFeeAmount"
                  defaultMessage="{marketFeeAmount} ETH"
                  values={{ marketFeeAmount }}
                />
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
