import { Currency } from '__generated__/globalTypes';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useIntlContext } from 'contexts/intl';
import { useSentryContext } from 'contexts/sentry';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';

import { useWalletPreferences } from './wallets/useWalletPreferences';

type AmountProps = {
  amount: string;
  unit: 'wei';
};

export type Props = {
  amountInFiat?: any;
  decimals?: number;
  currencyFirst?: Currency;
  ethFirst?: boolean;
  displayEth?: boolean;
  context: string;
} & AmountProps;

const useAmountWithConversion = (props: Props) => {
  const { onlyShowFiatCurrency } = useWalletPreferences();
  const { convertFromWei } = useCurrencyConverters();
  const { formatNumber, formatWei } = useIntlContext();

  const {
    fiatCurrency,
    currency,
    displayEth: userDisplayEth,
  } = useCurrentUserContext();

  const { sendSafeError } = useSentryContext();

  const {
    context,
    amount: weiAmount,
    decimals,
    ethFirst,
    currencyFirst,
    amountInFiat = null,
    displayEth = userDisplayEth,
  } = props;
  const d = decimals ?? 4;

  let primaryCurrency = currency;
  if (ethFirst) {
    primaryCurrency = Currency.ETH;
  } else if (currencyFirst) {
    primaryCurrency = currencyFirst;
  }

  const fiat = formatNumber(
    amountInFiat
      ? amountInFiat[fiatCurrency.code.toLowerCase()]
      : convertFromWei(weiAmount, fiatCurrency.code),
    {
      style: 'currency',
      currency: fiatCurrency.code,
    }
  );

  if (!weiAmount) {
    sendSafeError(
      new Error(`Received null value for FormattedWei, context: ${context}`)
    );
  }

  const eth =
    weiAmount &&
    formatWei(weiAmount, undefined, {
      maximumFractionDigits: d,
    });

  const main = onlyShowFiatCurrency || primaryCurrency === 'FIAT' ? fiat : eth;

  const exponent =
    (displayEth || primaryCurrency === 'ETH') && primaryCurrency === 'ETH'
      ? fiat
      : eth;

  return {
    main,
    exponent: onlyShowFiatCurrency ? null : exponent,
  };
};

export default useAmountWithConversion;
