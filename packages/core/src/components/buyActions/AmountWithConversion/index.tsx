import styled from 'styled-components';

import { Text14, Title6 } from '@core/atoms/typography';
import useAmountWithConversion, {
  Props as UseAmountWithConversionProps,
} from '@core/hooks/useAmountWithConversion';

const Line = styled.div<{ $column: boolean }>`
  display: flex;
  ${props =>
    props.$column
      ? `flex-direction: column;`
      : `align-items: baseline;
      gap: var(--half-unit);`};
`;

const Exponent = styled(Text14)`
  color: var(--c-neutral-600);
  display: inline;
`;

export type Props = UseAmountWithConversionProps & {
  column?: boolean;
  withApproxSymbol?: boolean;
  hideExponent?: boolean;
};

export const AmountWithConversion = (props: Props) => {
  const {
    column = false,
    withApproxSymbol = false,
    hideExponent = false,
    ...useAmountWithConversionProps
  } = props;
  const { main, exponent } = useAmountWithConversion(
    useAmountWithConversionProps
  );
  return (
    <Line $column={column}>
      {main && <Title6 color="var(--c-neutral-1000)">{main}</Title6>}
      {!hideExponent && exponent && (
        <Exponent>
          {withApproxSymbol && '≈ '}
          {exponent}
        </Exponent>
      )}
    </Line>
  );
};
