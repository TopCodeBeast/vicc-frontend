import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Fiat } from '@sorare/core/src/atoms/icons/Fiat';
import { Info } from '@sorare/core/src/atoms/icons/Info';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { currencies } from '@sorare/core/src/lib/fiat';
import { toWei } from '@sorare/core/src/lib/wei';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  HighlightedRewardRow,
  RewardRow,
} from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRow';

import { MoneyReward_so5RewardConfig } from './__generated__/index.graphql';

const AmountContainer = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
  flex: 1;
`;
const InfoWrapper = styled(Info)`
  color: var(--c-neutral-600);
  width: var(--intermediate-unit);
`;

const MinimumFiatGuaranteed = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-600);
`;

type Props = {
  reward: MoneyReward_so5RewardConfig;
  highlighted?: boolean;
};
const MoneyReward = ({
  reward: { ethAmount, usdAmount, minimumGuaranteedUsdAmount },
  highlighted,
}: Props) => {
  const { fiatCurrency } = useCurrentUserContext();
  const { convertFromEth, convertToEth, convertToWei } =
    useCurrencyConverters();

  const minimumEthGuaranteed = useMemo(() => {
    if (minimumGuaranteedUsdAmount && ethAmount) {
      return convertToEth(
        minimumGuaranteedUsdAmount.toString(),
        currencies.usd.code
      );
    }
    return 0;
  }, [minimumGuaranteedUsdAmount, ethAmount, convertToEth]);

  const minimumFiatGuaranteed = useMemo(() => {
    if (minimumGuaranteedUsdAmount) {
      return convertFromEth(
        convertToEth(
          minimumGuaranteedUsdAmount.toString(),
          currencies.usd.code
        ),
        fiatCurrency.code
      );
    }
    return 0;
  }, [
    minimumGuaranteedUsdAmount,
    convertFromEth,
    convertToEth,
    fiatCurrency.code,
  ]);

  const amount = useMemo(() => {
    if (typeof ethAmount === 'number' && ethAmount > 0) {
      return toWei(Math.max(ethAmount, minimumEthGuaranteed));
    }
    return convertToWei(String(usdAmount), currencies.usd.code).toString();
  }, [convertToWei, ethAmount, minimumEthGuaranteed, usdAmount]);

  const { main: ethAmountDisplay } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      [SupportedCurrency.WEI.toLowerCase()]: amount,
    },
    primaryCurrency: Currency.ETH,
  });

  const WrapperComponent = highlighted ? HighlightedRewardRow : RewardRow;
  return (
    <WrapperComponent>
      <Fiat />
      <AmountContainer>
        <Text16>
          {usdAmount ? (
            <FormattedNumber
              value={usdAmount}
              currency="USD"
              currencyDisplay="narrowSymbol"
              style="currency"
              trailingZeroDisplay="stripIfInteger"
              minimumFractionDigits={0}
            />
          ) : (
            ethAmountDisplay
          )}
        </Text16>
        {!!usdAmount && (
          <Tooltip
            title={
              <Text14>
                <FormattedMessage
                  id="Lobby.CompetitionDetails.Rewards.usdAmountTooltip"
                  defaultMessage="You will receive ~ {amount}. Value is subject to change based on the exchange rate."
                  values={{
                    amount: ethAmountDisplay,
                  }}
                />
              </Text14>
            }
          >
            <InfoWrapper />
          </Tooltip>
        )}
      </AmountContainer>
      {minimumFiatGuaranteed > 0 && (
        <MinimumFiatGuaranteed>
          <Caption>
            <FormattedMessage
              id="Lobby.CompetitionDetails.Rewards.minimumGuarantee"
              defaultMessage="Minimum guarantee of {value}"
              values={{
                value: (
                  <FormattedNumber
                    value={minimumFiatGuaranteed!}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    currency={fiatCurrency.code}
                  />
                ),
              }}
            />
          </Caption>
          <Tooltip
            title={
              <FormattedMessage
                id="Lobby.CompetitionDetails.Rewards.minimumGuaranteeTooltip"
                defaultMessage="Minimum guarantee can vary depending on the rate fluctuation and currency displayed."
              />
            }
          >
            <InfoWrapper />
          </Tooltip>
        </MinimumFiatGuaranteed>
      )}
    </WrapperComponent>
  );
};

MoneyReward.fragments = {
  so5RewardConfig: gql`
    fragment MoneyReward_so5RewardConfig on Vicc5RewardConfig {
      ethAmount
      usdAmount
      minimumGuaranteedUsdAmount
    }
  `,
};

export default MoneyReward;
