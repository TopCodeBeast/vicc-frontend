import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import arrow from '@core/components/collections/assets/arrow.svg';

const Wrapper = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

const StyledImg = styled.img`
  width: var(--intermediate-unit);
`;

type Props = { bonus: number };

export const Bonus = ({ bonus }: Props) => {
  const { formatNumber } = useIntl();

  return (
    <Wrapper>
      <Text16 bold>
        {formatNumber(bonus * 100, {
          maximumFractionDigits: 1,
          trailingZeroDisplay: 'stripIfInteger',
          signDisplay: 'exceptZero',
        })}
        %
      </Text16>
      <StyledImg alt="" src={arrow} />
    </Wrapper>
  );
};
