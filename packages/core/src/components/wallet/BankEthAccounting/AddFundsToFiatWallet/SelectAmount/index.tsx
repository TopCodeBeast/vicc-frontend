import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '__generated__/globalTypes';
import { RadioGroup } from '@core/atoms/inputs/RadioGroup';
import Collapsible from '@core/atoms/layout/Collapsible';
import { Text16 } from '@core/atoms/typography';
import { InputField } from '@core/components/form/Form/InputField';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Amounts = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const AmountInput = styled.div`
  width: 100%;
  padding: var(--unit);
  border-radius: var(--unit);
  border: 1px solid var(--c-neutral-400);
`;

type Props = {
  onChange: (value: string) => void;
};

export const SelectAmount = ({ onChange: doOnChange }: Props) => {
  const { formatNumber, formatMessage } = useIntlContext();
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();

  const formatValue = (n: number) =>
    formatNumber(n, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
    });

  const options = [
    {
      value: '25',
      label: formatValue(25),
    },
    {
      value: '50',
      label: formatValue(50),
    },
    {
      value: '500',
      label: formatValue(500),
    },
    {
      value: 'other',
      label: formatMessage({
        id: 'addFundsToFiatWallet.selectAmount.other',
        defaultMessage: 'Other',
      }),
    },
  ];
  const [amount, setAmount] = useState<string>(options[0].value);

  const onChange = (value: string) => {
    setAmount(value);
  };

  useEffect(() => {
    if (amount !== 'other') {
      doOnChange(amount);
    }
  }, [amount, doOnChange]);

  return (
    <Wrapper>
      <Text16 bold>
        <FormattedMessage
          id="addFundsToFiatWallet.selectAmount.title"
          defaultMessage="Select amount"
        />
      </Text16>
      <Amounts>
        <RadioGroup
          row
          rounded
          ghost
          hideRadio
          border
          name="amounts"
          onChange={onChange}
          options={options}
          flexWrap
        />
        <Collapsible open={amount === 'other'}>
          <AmountInput>
            <InputField
              ethAmount={0}
              fiatAmount={100}
              fiatCurrency={code}
              defaultCurrency={Currency.FIAT}
              placeholder="100"
              hideConversion
              onChange={(c, value) => {
                doOnChange(value.toString());
              }}
            />
          </AmountInput>
        </Collapsible>
      </Amounts>
    </Wrapper>
  );
};
