import { ReactNode, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';
import styled, { css } from 'styled-components';

import RangeSlider, { RangeValues } from '@core/atoms/inputs/RangeSlider';
import { Caption } from '@core/atoms/typography';
import { clamp } from '@core/lib/math';
import { Color } from '@core/style/types';

export const InputsLine = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--unit);
  margin-top: var(--double-unit);
`;

export const StyledLabel = styled.label`
  position: relative;
  flex: 1;
`;

export const StyledInput = styled.input<{
  withIcon: boolean;
  borderColor: Color;
}>`
  height: 72px;
  border-radius: 8px;
  border: 2px solid ${({ borderColor }) => borderColor};
  padding: calc(3.5 * var(--unit)) var(--double-unit) var(--double-unit);
  ${({ withIcon }) =>
    withIcon &&
    css`
      padding-left: calc(5 * var(--unit));
    `}
  font-size: 20px;
  font-weight: 700;
  color: var(--c-neutral-1000);
  background-color: transparent; /*Override user-agent styles*/
  width: 100%;
`;

export const LabelContent = styled.span`
  position: absolute;
  top: calc(1.5 * var(--unit));
  left: var(--double-unit);
`;

export const IconWrapper = styled.div`
  position: absolute;
  width: var(--double-and-a-half-unit);
  height: 20px;
  top: var(--quadruple-unit);
  left: var(--double-unit);
  display: flex;
  align-items: center;
  > * {
    max-width: 100%;
  }
`;

export const Separator = styled.span`
  display: flex;
  align-items: center;
  color: var(--c-neutral-1000);
`;

type Props = {
  id: string;
  min?: number;
  max?: number;
  rangeValues: RangeValues;
  icon?: ReactNode;
  onChange: (values: RangeValues) => void;
  onChangeCommitted?: (values: RangeValues) => void;
  disabled?: boolean;
  inputBorderColor?: Color;
};

const clampRangeValues = (values: RangeValues, min: number, max: number) => ({
  low: clamp(values.low, min, max),
  high: clamp(values.high, min, max),
});

export const RangeSliderWithInputs = ({
  id,
  min = 0,
  max = 100,
  rangeValues,
  icon,
  onChange,
  onChangeCommitted,
  disabled,
  inputBorderColor = 'var(--c-neutral-300)',
}: Props) => {
  const [inputValues, setInputValues] = useState<{
    low: string;
    high: string;
  }>({
    low: rangeValues.low.toString(),
    high: rangeValues.high.toString(),
  });

  useEffect(() => {
    const clampedRangeValues = clampRangeValues(rangeValues, min, max);
    setInputValues({
      low: clampedRangeValues.low.toString(),
      high: clampedRangeValues.high.toString(),
    });
  }, [max, min, rangeValues]);

  const onValuesChange = (values: RangeValues, commit = false) => {
    const clampedValues = clampRangeValues(values, min, max);
    const reorderedClampedValues = {
      low: Math.min(clampedValues.low, clampedValues.high),
      high: Math.max(clampedValues.low, clampedValues.high),
    };
    setInputValues({
      low: reorderedClampedValues.low.toString(),
      high: reorderedClampedValues.high.toString(),
    });

    onChange(reorderedClampedValues);
    if (commit) {
      onChangeCommitted?.(reorderedClampedValues);
    }
  };

  useDebounce(
    () => {
      if (
        +inputValues.low !== rangeValues.low ||
        +inputValues.high !== rangeValues.high
      ) {
        onValuesChange(
          { low: +inputValues.low, high: +inputValues.high },
          true
        );
      }
    },
    1000,
    [rangeValues, inputValues]
  );

  return (
    <div>
      <RangeSlider
        rangeValues={rangeValues}
        onChange={onValuesChange}
        onMouseUp={(values: RangeValues) => onValuesChange(values, true)}
        min={min}
        max={max}
        disabled={disabled}
      />
      <InputsLine>
        <StyledLabel>
          <LabelContent>
            <Caption as="span" color="var(--c-neutral-600)">
              <FormattedMessage
                id="RangeSliderWithInputs.min"
                defaultMessage="Min"
              />
            </Caption>
          </LabelContent>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            id={`${id}-input1`}
            type="number"
            max={max}
            value={inputValues.low}
            onChange={e =>
              setInputValues(old => ({ ...old, low: e.target.value }))
            }
            withIcon={!!icon}
            disabled={disabled}
            borderColor={inputBorderColor}
          />
        </StyledLabel>
        <Separator>-</Separator>
        <StyledLabel>
          <LabelContent>
            <Caption as="span" color="var(--c-neutral-600)">
              <FormattedMessage
                id="RangeSliderWithInputs.max"
                defaultMessage="Max"
              />
            </Caption>
          </LabelContent>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            id={`${id}-input2`}
            type="number"
            min={min}
            value={inputValues.high}
            onChange={e =>
              setInputValues(old => ({ ...old, high: e.target.value }))
            }
            withIcon={!!icon}
            disabled={disabled}
            borderColor={inputBorderColor}
          />
        </StyledLabel>
      </InputsLine>
    </div>
  );
};

export default RangeSliderWithInputs;
