import { faRepeat, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, TextField } from '@material-ui/core';
import classnames from 'classnames';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedNumber } from 'react-intl';
import styled, { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useRegexp from '@sorare/core/src/hooks/useRegexp';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { Currency } from '@sorare/core/src/lib/currency';
import { currencySymbol } from '@sorare/core/src/lib/fiat';
import { OverrideClasses } from '@sorare/core/src/style/utils';

const SwitchButton = styled(IconButton).attrs({
  color: 'transparent',
  small: true,
  disableRipple: true,
  disableDebounce: true,
})`
  color: var(--c-neutral-600);
`;

type BaseProps = {
  currency?: Currency | null;
  ethAmount: number;
  fiatAmount: number;
  editable?: boolean;
  disabled?: boolean;
  fiatCurrency: string;
  highBid?: boolean;
  defaultCurrency?: Currency;
  onChange: (currency: Currency, value: number) => void;
  onToggleEthDisplay?: (ethDisplay: boolean) => void;
  variant?: 'base' | 'withdraw';
  placeholder?: string;
};

type PropsWithMins = BaseProps & {
  minEthAmount: number;
  minFiatAmount: number;
};

type PropsWithoutMins = BaseProps & {
  minEthAmount?: never;
  minFiatAmount?: never;
};

type Props = PropsWithMins | PropsWithoutMins;

const RootDiv = styled.div`
  display: flex;
  align-items: flex-start;
`;

const AmountsDiv = styled.div`
  width: 100%;
`;

const ActionsDiv = styled.div`
  display: flex;
`;

const AmountInputDisplay = styled(Title5)`
  color: var(--c-brand-600);
  font-weight: bold;
  &.highBid {
    color: var(--c-red-600);
  }
  &.withdraw {
    color: inherit;
    &.empty {
      color: var(--c-neutral-600);
    }
  }
  &.disabled {
    color: var(--c-neutral-800);
  }

  .dark-theme & {
    color: var(--c-neutral-1000);

    &.highBid {
      color: var(--c-red-600);
    }
    &.withdraw {
      color: inherit;
      &.empty {
        color: var(--c-neutral-600);
      }
    }
    &.disabled {
      color: var(--c-neutral-800);
    }
  }
`;

const [StyledTextField, classes] = OverrideClasses(TextField, null, {
  inputRoot: css`
    font-family: apercu-pro, system-ui, sans-serif;
    font-weight: 900;
    font-style: italic;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    max-width: 100%;
  `,
  input: css`
    color: var(--c-brand-600);
    .dark-theme & {
      color: var(--c-neutral-1000);
      &:focus {
        color: var(--c-neutral-1000);
      }
      &.highBid {
        color: var(--c-red-600);
      }
    }
    &:focus {
      color: var(--c-brand-600);
    }
    &.highBid {
      color: var(--c-red-600);
    }
    &.withdraw {
      color: inherit;
    }
    &.withdraw:focus {
      color: inherit;
    }
    &.disabled {
      color: var(--c-neutral-800);
    }
  `,
});

export const InputField = ({
  ethAmount,
  fiatAmount,
  editable = true,
  fiatCurrency,
  onChange,
  highBid = false,
  defaultCurrency,
  minEthAmount,
  minFiatAmount,
  variant,
  placeholder,
  onToggleEthDisplay,
  disabled,
  currency,
}: Props) => {
  const {
    flags: { useNewWallet },
  } = useFeatureFlags();
  const [ethDisplay, toggleEthDisplay] = useToggle(
    currency ? false : defaultCurrency === Currency.ETH
  );
  const [input, setInput] = useState<string>(
    ethDisplay ? ethAmount.toString() : fiatAmount.toString()
  );
  const allowedDecimals = useMemo(() => (ethDisplay ? 4 : 2), [ethDisplay]);
  const allowedDecimalsOtherCurrency = useMemo(
    () => (ethDisplay ? 2 : 4),
    [ethDisplay]
  );

  // Checks the number of allowed decimals
  const decimalRegexp = useRegexp(
    `^([0-9]+)?([.,][0-9]{0,${allowedDecimals}})?$`
  );

  const toggleDisplayedCurrency = useCallback(() => {
    toggleEthDisplay();
    if (ethDisplay) {
      setInput(fiatAmount.toString());
    } else {
      setInput(ethAmount.toString());
    }
  }, [ethAmount, ethDisplay, fiatAmount, toggleEthDisplay]);

  useEffect(() => {
    if (useNewWallet && ethDisplay && currency === Currency.FIAT)
      toggleDisplayedCurrency();
    if (useNewWallet && !ethDisplay && currency === Currency.ETH)
      toggleDisplayedCurrency();
    if (onToggleEthDisplay) onToggleEthDisplay(ethDisplay);
  }, [
    currency,
    ethDisplay,
    onToggleEthDisplay,
    toggleDisplayedCurrency,
    useNewWallet,
  ]);

  const handle = (amount: string) => {
    if (decimalRegexp.test(amount)) {
      setInput(amount);
      onChange(
        ethDisplay ? Currency.ETH : Currency.FIAT,
        Number.parseFloat(amount || '0')
      );
    }
  };

  const handler = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    handle(amount);
  };

  const resetInput = () => {
    handle('0');
  };

  return (
    <RootDiv>
      <AmountsDiv>
        <StyledTextField
          type="number"
          autoFocus
          value={input || ''}
          onChange={handler}
          disabled={!editable || disabled}
          placeholder={placeholder}
          InputProps={{
            inputMode: 'decimal',
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <AmountInputDisplay
                  className={classnames(variant, {
                    highBid,
                    empty: !input,
                    disabled,
                  })}
                >
                  {ethDisplay ? 'ETH' : currencySymbol(fiatCurrency)}
                </AmountInputDisplay>
              </InputAdornment>
            ),
            classes: {
              root: classes.inputRoot,
              input: classnames(classes.input, variant, {
                highBid,
                disabled,
              }),
            },
            inputProps: {
              'aria-label': ethDisplay ? 'ether' : 'fiat',
              step: ethDisplay ? 0.0001 : 0.1,
              min: ethDisplay ? minEthAmount : minFiatAmount,
            },
          }}
        />
        <Text16 color="var(--c-neutral-600)">
          ≈&nbsp;
          <FormattedNumber
            value={ethDisplay ? fiatAmount : ethAmount}
            // eslint-disable-next-line react/style-prop-object
            style="currency"
            currency={ethDisplay ? fiatCurrency : 'ETH'}
            maximumFractionDigits={allowedDecimalsOtherCurrency}
            minimumFractionDigits={allowedDecimalsOtherCurrency}
          />
        </Text16>
      </AmountsDiv>
      {!disabled && (
        <ActionsDiv>
          {!useNewWallet && (
            <SwitchButton onClick={toggleDisplayedCurrency} className={variant}>
              <FontAwesomeIcon icon={faRepeat} size="xs" />
            </SwitchButton>
          )}
          {+input > 0 && editable && (
            <SwitchButton onClick={resetInput} className={variant}>
              <FontAwesomeIcon icon={faXmark} size="xs" />
            </SwitchButton>
          )}
        </ActionsDiv>
      )}
    </RootDiv>
  );
};

export default InputField;
