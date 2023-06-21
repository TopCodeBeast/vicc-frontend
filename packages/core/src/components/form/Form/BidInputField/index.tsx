import { faRepeat } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Text14 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import useCurrencyConverters from '@core/hooks/useCurrencyConverters';
import useRegexp from '@core/hooks/useRegexp';
import useToggle from '@core/hooks/useToggle';
import { Currency } from '@core/lib/currency';
import { currencySymbol } from '@core/lib/fiat';
import { RoundingMode, fromWei, toWei } from '@core/lib/wei';

const Label = styled.label<{ $symbolAfter?: boolean }>`
  position: relative;
  max-width: 100%;
  margin: auto;
  text-align: center;
  display: flex;
  cursor: text;
  font: var(--t-bold) var(--t-48);
  color: var(--c-brand-600);

  ${({ $symbolAfter }) =>
    $symbolAfter
      ? `
    &:after {
    content: attr(data-before);
    margin-left: var(--half-unit);
    display: block;
    visibility: hidden;
  }
    `
      : `
    &:before {
    content: attr(data-before);
    display: block;
    visibility: hidden;
  }
    `}
`;

const Placeholder = styled.span<{ $symbolAfter?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  ${({ $symbolAfter }) =>
    $symbolAfter
      ? `
      &:before {
        content: attr(data-content);
        display: block;
        visibility: hidden;
      }
      &:after {
        content: attr(data-before);
        margin-left: var(--unit);
        display: block;
        color: var(--c-brand-600);
      }
    `
      : `
        &:before {
          content: attr(data-before);
          display: block;
          color: var(--c-brand-600);
        }
        &:after {
          content: attr(data-content);
          display: block;
          visibility: hidden;
        }`}
`;

const StyledInput = styled.input`
  width: 100%;
  display: inline-flex;
  text-align: center;
  font: inherit;
  border: none;
  background-color: transparent;
  color: var(--c-brand-600);
  line-height: 100%;
`;

const CenteredInputWithSymbol = ({
  value,
  symbol,
  placeholder,
  disabled,
  ariaLabel,
  symbolAfter,
  onChange,
}: {
  value: string;
  symbol: string;
  placeholder?: string;
  disabled?: boolean;
  symbolAfter?: boolean;
  ariaLabel: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Label data-before={symbol} $symbolAfter={symbolAfter}>
      <StyledInput
        placeholder={placeholder}
        value={value}
        type="text"
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
        autoFocus
        inputMode="decimal"
      />
      <Placeholder
        data-content={value}
        data-before={symbol}
        $symbolAfter={symbolAfter}
      />
    </Label>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Amounts = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SecondaryAmount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  ethAmount: number;
  fiatAmount: number;
  fiatCurrency: string;
  defaultCurrency?: Currency;
  onChange: (currency: Currency, value: number) => void;
  onToggleEthDisplay?: (ethDisplay: boolean) => void;
  placeholder?: string;
  error?: ReactNode;
  setOutBidCallback?: React.Dispatch<
    React.SetStateAction<((string: any) => void) | undefined>
  >;
  onlyShowFiatCurrency?: boolean;
};

export const BidInputField = ({
  ethAmount,
  fiatAmount,
  fiatCurrency,
  onChange,
  defaultCurrency,
  placeholder,
  onToggleEthDisplay,
  setOutBidCallback,
  error,
  onlyShowFiatCurrency = false,
}: Props) => {
  const {
    fiatCurrency: { code: currencyCode },
  } = useCurrentUserContext();
  const { formatWei, formatNumber } = useIntlContext();

  const { convertFromEth, convertFromWei } = useCurrencyConverters();

  const [ethDisplay, toggleEthDisplay] = useToggle(
    !onlyShowFiatCurrency && defaultCurrency === Currency.ETH
  );

  const [input, setInput] = useState<string>(
    ethDisplay ? ethAmount.toString() : fiatAmount.toString()
  );
  const allowedDecimals = useMemo(() => (ethDisplay ? 4 : 2), [ethDisplay]);

  const weiAmount = toWei(ethAmount);
  const ethAmountStr = formatWei(weiAmount, undefined, {
    maximumFractionDigits: 4,
  });

  const fiatAmountStr = formatNumber(convertFromWei(weiAmount, currencyCode), {
    style: 'currency',
    currency: currencyCode,
  });

  // Checks the number of allowed decimals
  const decimalRegexp = useRegexp(
    `^([0-9]+)?([.,][0-9]{0,${allowedDecimals}})?$`
  );

  const onlyDotsOrCommasRegexp = useRegexp(`^[.,]+$`);

  const toggleDisplayedCurrency = useCallback(() => {
    if (onToggleEthDisplay) onToggleEthDisplay(!ethDisplay);
    toggleEthDisplay();
    if (ethDisplay) {
      setInput(fiatAmount.toString());
    } else {
      setInput(ethAmount.toString());
    }
  }, [ethAmount, ethDisplay, fiatAmount, toggleEthDisplay, onToggleEthDisplay]);

  const handle = useCallback(
    (amount: string) => {
      if (decimalRegexp.test(amount)) {
        setInput(amount);

        const formattedAmount = onlyDotsOrCommasRegexp.test(amount)
          ? '0'
          : `${amount.replace(',', '.')}`;

        onChange(
          ethDisplay ? Currency.ETH : Currency.FIAT,
          Number.parseFloat(formattedAmount || '0')
        );
      }
    },
    [decimalRegexp, ethDisplay, onlyDotsOrCommasRegexp, onChange]
  );

  const handler = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    handle(amount);
  };

  useEffect(() => {
    if (setOutBidCallback) {
      setOutBidCallback(() => {
        return (amount: string) => {
          const ethAmountValue = fromWei(
            amount,
            4,
            RoundingMode.ROUND_DOWN
          ).toString();
          handle(
            ethDisplay
              ? ethAmountValue
              : convertFromEth(ethAmountValue, currencyCode).toFixed(2)
          );
        };
      });
    }
  }, [ethDisplay, currencyCode, handle, convertFromEth, setOutBidCallback]);

  return (
    <Root>
      <Amounts>
        <CenteredInputWithSymbol
          value={input || ''}
          onChange={handler}
          symbol={ethDisplay ? 'ETH' : currencySymbol(fiatCurrency)}
          placeholder={placeholder}
          ariaLabel={ethDisplay ? 'ether' : 'fiat'}
          symbolAfter={ethDisplay}
        />
        {error}
        {!onlyShowFiatCurrency && (
          <SecondaryAmount>
            <Text14 color="var(--c-neutral-600)">
              ≈&nbsp;
              {ethDisplay ? fiatAmountStr : ethAmountStr}
            </Text14>
            <IconButton
              small
              color="gray"
              aria-label="switch"
              onClick={toggleDisplayedCurrency}
              disableDebounce
            >
              <FontAwesomeIcon icon={faRepeat} size="xs" />
            </IconButton>
          </SecondaryAmount>
        )}
      </Amounts>
    </Root>
  );
};

export default BidInputField;
