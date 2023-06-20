import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion, {
  Props as UseAmountWithConversionProps,
} from '@sorare/core/src/hooks/useAmountWithConversion';
import { Color } from '@sorare/core/src/style/types';

const JustifyEnd = styled.div`
  text-align: right;
`;

type Props = UseAmountWithConversionProps & {
  color?: Color;
  bold?: boolean;
};

const PaymentBoxAmountWithConversion = ({
  bold = false,
  color,
  ...props
}: Props) => {
  const { main, exponent } = useAmountWithConversion(props);

  return (
    <JustifyEnd>
      <Text16 bold={bold} color={color || 'var(--c-neutral-1000)'}>
        {main}
      </Text16>
      {exponent && (
        <Text14 color={color || 'var(--c-neutral-600)'}>{exponent}</Text14>
      )}
    </JustifyEnd>
  );
};

export default PaymentBoxAmountWithConversion;
