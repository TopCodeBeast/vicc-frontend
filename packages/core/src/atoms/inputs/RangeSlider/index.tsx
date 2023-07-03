import { ChangeEvent, useState } from 'react';
import styled, { css } from 'styled-components';

const thumbDiameter = '4 * var(--unit)';
const trackHeight = 'var(--half-unit)';

const Wrapper = styled.div`
  position: relative;
  height: calc(${thumbDiameter});
`;

const thumb = css`
  pointer-events: auto;
  cursor: pointer;
  height: calc(${thumbDiameter});
  width: calc(${thumbDiameter});
  border-radius: 50%;
  border: 2px solid var(--c-neutral-300);
  background: no-repeat center
    url("data:image/svg+xml;utf8,<svg width='8' height='12' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M.5 0h1v12h-1V0Zm3 0h1v12h-1V0Zm4 0h-1v12h1V0Z' fill='%238B8F96'/></svg>")
    var(--c-neutral-100);
  .dark-theme & {
    background-color: var(--c-neutral-400);
    border-color: var(--c-neutral-500);
  }
`;

const track = css`
  background: none;
  width: 100%;
  height: ${trackHeight};
  border-radius: 0px 100px 100px 0px;
`;

const StyledInput = styled.input`
  position: absolute;
  font: inherit;
  margin: 0;
  background: none;
  pointer-events: none;
  width: 100%;
  height: 0;
  padding-top: calc((${thumbDiameter} / 2));
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-appearance: none;
  &::-moz-range-thumb {
    ${thumb}
  }
  &::-webkit-slider-thumb {
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-appearance: none;
    ${thumb}
    margin-top: calc(-1 * (${thumbDiameter} - ${trackHeight}) / 2);
  }
  &::-moz-range-track {
    ${track}
  }
  &::-webkit-slider-runnable-track {
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-appearance: none;
    ${track}
  }
`;

const Track = styled.span`
  ${track}
  position: absolute;
  background-color: var(--c-neutral-300);
  margin-top: calc((${thumbDiameter} - ${trackHeight}) / 2);
  .dark-theme & {
    background: var(--c-neutral-400);
  }
`;

type InBetweenTrackProps = { startPercent: number; endPercent: number };

// using attrs with style to avoid re-generating a class everytime it gets rendered (which happens every time the slider moves)
const InBetweenTrack = styled.span.attrs(
  ({ startPercent, endPercent }: InBetweenTrackProps) => ({
    style: {
      left: `${startPercent}%`,
      width: `calc(${endPercent}% - ${startPercent}%)`,
    },
  })
)<InBetweenTrackProps>`
  ${track}
  position: absolute;
  background-color: var(--c-brand-600);
  margin-top: calc((${thumbDiameter} - ${trackHeight}) / 2);
`;

export type RangeValues = {
  low: number;
  high: number;
};

type Props = {
  min?: number;
  max?: number;
  rangeValues: RangeValues;
  name?: string;
  id?: string;
  onChange: (values: RangeValues) => void;
  onMouseUp?: (values: RangeValues) => void;
  disabled?: boolean;
};

export const RangeSlider = ({
  min = 0,
  max = 100,
  name,
  id,
  rangeValues,
  onChange,
  onMouseUp,
  disabled,
}: Props) => {
  /* 3 states:
    - value of the first thumb
    - value of the second thumb
    - range defined by the two previous values
    We need to track the thumb values separately from the range because the thumbs
    can cross path and the first thumb does not always have the lowest value
  */
  const [valueOne, setValueOne] = useState(rangeValues.low);
  const [valueTwo, setValueTwo] = useState(rangeValues.high);

  const valuesAreInSync =
    (rangeValues.low === valueOne && rangeValues.high === valueTwo) ||
    (rangeValues.low === valueTwo && rangeValues.high === valueOne);

  // it means the rangeValues have been modified from outside this component
  if (!valuesAreInSync) {
    setValueOne(rangeValues.low);
    setValueTwo(rangeValues.high);
  }

  const onInputRelease = () => {
    onMouseUp?.({ low: valueOne, high: valueTwo });
  };

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>,
    otherValue: number
  ) => {
    const newValue = event.target.valueAsNumber;
    const low = Math.min(newValue, otherValue);
    const high = Math.max(newValue, otherValue);

    onChange({ low, high });
    setValue(newValue);
  };

  return (
    <Wrapper>
      <Track />
      <InBetweenTrack
        startPercent={(100 * (rangeValues.low - min)) / (max - min)}
        endPercent={(100 * (rangeValues.high - min)) / (max - min)}
      />
      <StyledInput
        type="range"
        name={name ? `${name}-1` : undefined}
        id={id ? `${id}-1` : undefined}
        value={valueOne}
        disabled={disabled}
        onChange={e => onInputChange(e, setValueOne, valueTwo)}
        onMouseUp={onInputRelease}
        onTouchEnd={onInputRelease}
        min={min}
        max={max}
      />
      <StyledInput
        type="range"
        name={name ? `${name}-2` : undefined}
        id={id ? `${id}-2` : undefined}
        value={valueTwo}
        disabled={disabled}
        onChange={e => onInputChange(e, setValueTwo, valueOne)}
        onMouseUp={onInputRelease}
        onTouchEnd={onInputRelease}
        min={min}
        max={max}
      />
    </Wrapper>
  );
};

export default RangeSlider;
