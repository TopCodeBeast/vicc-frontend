import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';

type EthInputWithConversionProps = {
  onChange: (value: any) => void;
  initialValue?: string;
  minEthValue?: number;
  maxEthValue?: number;
  bounded?: boolean;
};

const Input = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Field = styled(TextField)`
  flex: 1;
  & .MuiInputBase-root {
    width: 100%;
  }
`;

const EthInputWithConversion = ({
  onChange,
  minEthValue = 0,
  maxEthValue,
  initialValue = '0.01',
  bounded = false,
}: EthInputWithConversionProps) => {
  const { fiatCurrency } = useCurrentUserContext();
  const { convertFromEth, convertToEth } = useCurrencyConverters();
  const convertEth = useCallback(
    (eth: any) => convertFromEth(eth.toString(), fiatCurrency.code).toFixed(2),
    [convertFromEth, fiatCurrency.code]
  );
  const convertFiat = (eur: any) =>
    convertToEth(eur, fiatCurrency.code).toFixed(4);

  const [amountInEth, setAmountInEth] = useState<string>(initialValue);
  const [amountInEur, setAmountInEur] = useState<string>(
    convertEth(initialValue)
  );

  const setEth = useCallback(
    (value: any) => {
      setAmountInEth(value);
      if (value) {
        setAmountInEur(convertEth(value));
        onChange(value);
      }
    },
    [convertEth, onChange]
  );

  const setFiat = (value: any) => {
    setAmountInEur(value);
    if (value) {
      setAmountInEth(convertFiat(value));
      onChange(convertFiat(value));
    }
  };

  useEffect(() => {
    if (bounded && minEthValue > Number.parseFloat(amountInEth))
      setEth(minEthValue);
  }, [bounded, amountInEth, minEthValue, setEth]);

  useEffect(() => {
    if (bounded && maxEthValue && maxEthValue < Number.parseFloat(amountInEth))
      setEth(maxEthValue);
  }, [bounded, amountInEth, minEthValue, setEth, maxEthValue]);

  return (
    <Input>
      <Field
        type="number"
        placeholder="1"
        variant="outlined"
        value={amountInEth}
        onChange={event => setEth(event.target.value)}
        InputProps={{
          endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
          inputProps: {
            'aria-label': 'ether',
            min: minEthValue,
            max: maxEthValue,
            step: 0.0001,
          },
        }}
      />
      <Field
        type="number"
        placeholder="1"
        variant="outlined"
        value={amountInEur}
        onChange={event => setFiat(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {fiatCurrency.symbol}
            </InputAdornment>
          ),
          inputProps: {
            'aria-label': 'fiat',
            min: 0,
            step: 0.01,
          },
        }}
      />
    </Input>
  );
};

export default EthInputWithConversion;
