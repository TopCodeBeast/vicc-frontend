import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import diamond from '@sorare/core/src/assets/animations/diamond.png';
import { Text16 } from '@sorare/core/src/atoms/typography';
import RangeSliderWithInputs from '@sorare/core/src/components/search/RangeSliderWithInputs';

const Wrapper = styled.div``;

type Props = {
  boundariesRange: {
    min: number;
    max: number;
  };
  value: {
    min: number;
    max: number;
  };
  onChange: (value: { min: number; max: number }) => void;
  disabled?: boolean;
};

export const PointsFilter = ({
  boundariesRange,
  value,
  onChange,
  disabled,
}: Props) => {
  return (
    <Wrapper>
      <Text16>
        <FormattedMessage id="PointsFilter.Points" defaultMessage="Points" />
      </Text16>
      <RangeSliderWithInputs
        disabled={disabled}
        id="value-filter"
        min={boundariesRange.min}
        max={boundariesRange.max}
        rangeValues={{
          low: value.min,
          high: value.max,
        }}
        onChange={({ low, high }) => onChange({ min: low, max: high })}
        icon={<img src={diamond} alt="" />}
      />
    </Wrapper>
  );
};
