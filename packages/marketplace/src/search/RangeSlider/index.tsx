import classNames from 'classnames';
import {
  ChangeEvent,
  FocusEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePagination } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';

import RangeSliderAtom, {
  RangeValues,
} from '@sorare/core/src/atoms/inputs/RangeSlider';
import { Caption } from '@sorare/core/src/atoms/typography';
import {
  IconWrapper,
  InputsLine,
  LabelContent,
  Separator,
  StyledInput,
  StyledLabel,
} from '@sorare/core/src/components/search/RangeSliderWithInputs';
import { useRangeSlider } from '@sorare/core/src/hooks/useRangeSlider';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { clamp } from '@sorare/core/src/lib/math';

interface Props {
  attribute: string;
  minForced?: number;
  maxForced?: number;
  algorithm?: {
    scale: (x: number) => number;
    unscale: (x: number) => number;
  };
  steps?: { value: number; label?: string }[];
  fromInput?: (value: number) => number;
  toInput?: (value: number) => string;
  greaterThanMode?: boolean;
  icon?: ReactNode;
}

const DEFAULT_ALGORITHM = {
  scale: (x: number) => x,
  unscale: (x: number) => x,
};

const defaultFromInputFn = (value: number) => value;
const defaultToInputFn = (value: number) => value.toString();

// Notes around the usage of this slider:
// For setting hardcoded minimum and maximum, avoid using min and max (these are provided automatically by Algolia)
// If you want to set them, use minForced and maxForced.
// Explanation: the reason for this is that by setting min and max, we will force new extra disjunctive queries at
// every page load that are counted as extra queries
// We are not using the scale props of the Slider component because it actually makes it more complicated in terms of transformations. We are handling the scaling ourselves with the algorithm props by scaling the value we receive from the Slider.
export const RangeSlider = ({
  attribute,
  minForced,
  maxForced,
  algorithm = DEFAULT_ALGORITHM,
  fromInput = defaultFromInputFn,
  toInput = defaultToInputFn,
  greaterThanMode = false,
  icon,
}: Props) => {
  const {
    range: { max: realMax },
  } = useRangeSlider({
    attribute,
  });

  const needGreaterThanMode =
    !!greaterThanMode &&
    realMax !== undefined &&
    maxForced !== undefined &&
    realMax > maxForced;

  const actualMaxForced =
    greaterThanMode && !needGreaterThanMode ? undefined : maxForced;

  const {
    refine,
    canRefine,
    range: { min, max },
    start: [currentRefinementMin, currentRefinementMax],
  } = useRangeSlider({
    attribute,
    // Forcing the min/max requires a work-around to not trigger a refinement (impacts URL & numericFilters param).
    // See InstantSearch/index.tsx & packages/marketplace/src/searchCards/RangeSlider/index.tsx
    min: minForced,
    max: greaterThanMode ? undefined : maxForced,
  });

  const minimum = minForced ?? (min || 0);
  const maximum = actualMaxForced ?? (max || 0);

  const localCurrentRefinementMin =
    currentRefinementMin && currentRefinementMin === -Infinity
      ? minimum || 0
      : currentRefinementMin || 0;

  const localCurrentRefinementMax =
    currentRefinementMax && currentRefinementMax === Infinity
      ? maximum || 0
      : currentRefinementMax || 0;

  const [currentValues, setCurrentValues] = useState<RangeValues>({
    low: algorithm.unscale(localCurrentRefinementMin || minimum),
    high: algorithm.unscale(localCurrentRefinementMax || maximum),
  });

  const [inputValues, setInputValues] = useState<{ low: string; high: string }>(
    {
      low: toInput(algorithm.scale(currentValues.low)),
      high: toInput(algorithm.scale(currentValues.high)),
    }
  );

  const [editingInputs, setEditingInputs] = useState(false);

  const track = useEvents();
  const { refine: setPage } = usePagination();

  const { sliderMin, sliderMax } = useMemo(() => {
    return {
      sliderMin: algorithm.unscale(minimum),
      sliderMax: algorithm.unscale(maximum),
    };
  }, [algorithm, maximum, minimum]);

  const reachEnd = currentValues.high === sliderMax;

  const refineValues = useCallback(() => {
    if (
      localCurrentRefinementMin !== currentValues.low ||
      localCurrentRefinementMax !== currentValues.high
    ) {
      const newMin = Math.max(
        Math.round(algorithm.scale(currentValues.low!)),
        minimum!
      );
      const newMax = Math.min(
        Math.round(algorithm.scale(currentValues.high!)),
        maximum!
      );

      track('Use Market Filter', {
        filterName: attribute,
        filterValue: `${Math.floor(newMin)}-${Math.ceil(newMax)}`,
      });
      setPage(0);
      refine([newMin, needGreaterThanMode && reachEnd ? max : newMax]);
    }
  }, [
    algorithm,
    attribute,
    currentValues.high,
    currentValues.low,
    localCurrentRefinementMax,
    localCurrentRefinementMin,
    max,
    maximum,
    minimum,
    needGreaterThanMode,
    refine,
    setPage,
    reachEnd,
    track,
  ]);

  const changeInputValues = (range: { low?: string; high?: string }) => {
    setInputValues(prev => ({ ...prev, ...range }));
  };

  const changeSliderValues = useCallback(
    (range: { low?: number; high?: number }, updateInputValues?: boolean) => {
      if (
        range.high !== undefined &&
        Math.round(range.high) === Math.round(sliderMax)
      ) {
        range.high = sliderMax;
      }

      const clampedLow =
        range.low !== undefined
          ? clamp(range.low, sliderMin, sliderMax)
          : undefined;
      const clampedHigh =
        range.high !== undefined
          ? clamp(range.high, sliderMin, sliderMax)
          : undefined;

      setCurrentValues(prev => ({
        ...prev,
        ...(clampedLow !== undefined && { low: clampedLow }),
        ...(clampedHigh !== undefined && { high: clampedHigh }),
      }));

      if (updateInputValues) {
        changeInputValues({
          ...(clampedLow !== undefined && {
            low: toInput(algorithm.scale(clampedLow)),
          }),
          ...(clampedHigh !== undefined && {
            high: toInput(algorithm.scale(clampedHigh)),
          }),
        });
      }
    },
    [algorithm, toInput, sliderMin, sliderMax]
  );

  // // the `currentRefinement` probably changed because of `Clear all filter`
  // // we need to reset the `currentValues` to their initial state
  useEffect(() => {
    if (canRefine) {
      changeSliderValues(
        {
          low: algorithm.unscale(localCurrentRefinementMin || minimum),
          high: algorithm.unscale(localCurrentRefinementMax || maximum),
        },
        !editingInputs
      );
    }
  }, [
    canRefine,
    localCurrentRefinementMin,
    localCurrentRefinementMax,
    algorithm,
    minimum,
    maximum,
    changeSliderValues,
    editingInputs,
  ]);

  useDebounce(
    () => {
      if (editingInputs) {
        refineValues();
      }
    },
    200,
    [inputValues]
  );

  // If we don't have results, and we haven't forced a min/max on the slider, then don't show anything
  if (
    (min === undefined || max === undefined) &&
    !minForced &&
    !actualMaxForced
  ) {
    return null;
  }

  const disabled = false;//minimum === maximum; //TODO******************************filter
  const shouldDisplayPlus = needGreaterThanMode && reachEnd;

  return (
    <div className={classNames('FilterWidget', { visible: !disabled })}>
      <RangeSliderAtom
        rangeValues={{
          low: currentValues.low,
          high: currentValues.high,
        }}
        min={sliderMin}
        max={sliderMax}
        disabled={disabled}
        onChange={(range: RangeValues) => {
          changeSliderValues(
            {
              low: range.low,
              high: range.high,
            },
            true
          );
        }}
        onMouseUp={refineValues}
      />
      <InputsLine>
        <StyledLabel>
          <LabelContent>
            <Caption color="var(--c-neutral-600)">
              <FormattedMessage
                id="RangeSliderWithInputs.min"
                defaultMessage="Min"
              />
            </Caption>
          </LabelContent>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            id="a-input1"
            name={attribute}
            type="number"
            min={toInput(algorithm.scale(sliderMin))}
            max={toInput(algorithm.scale(sliderMax))}
            value={inputValues.low}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              setEditingInputs(false);
              changeSliderValues(
                {
                  low: algorithm.unscale(fromInput(+event.target.value)),
                },
                true
              );
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              changeInputValues({
                low: event.target.value,
              });
              changeSliderValues({
                low: algorithm.unscale(fromInput(+event.target.value)),
              });
            }}
            onFocus={() => setEditingInputs(true)}
            withIcon={!!icon}
            borderColor="var(--c-neutral-300)"
          />
        </StyledLabel>
        <Separator>-</Separator>
        <StyledLabel>
          <LabelContent>
            <Caption color="var(--c-neutral-600)">
              <FormattedMessage
                id="RangeSliderWithInputs.max"
                defaultMessage="Max"
              />
            </Caption>
          </LabelContent>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            id="b-input2"
            name={attribute}
            type="number"
            min={toInput(algorithm.scale(sliderMin))}
            max={toInput(algorithm.scale(sliderMax))}
            value={shouldDisplayPlus ? '' : inputValues.high}
            placeholder={
              shouldDisplayPlus
                ? `${+toInput(algorithm.scale(sliderMax))}+`
                : undefined
            }
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              setEditingInputs(false);
              changeSliderValues(
                {
                  high: algorithm.unscale(fromInput(+event.target.value)),
                },
                true
              );
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              changeInputValues({
                high: event.target.value,
              });
              changeSliderValues({
                high: algorithm.unscale(fromInput(+event.target.value)),
              });
            }}
            onFocus={() => setEditingInputs(true)}
            withIcon={!!icon}
            borderColor="var(--c-neutral-300)"
          />
        </StyledLabel>
      </InputsLine>
    </div>
  );
};

export default RangeSlider;
