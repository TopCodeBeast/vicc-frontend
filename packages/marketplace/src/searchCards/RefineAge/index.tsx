import { useEffect, useState } from 'react';
import { usePagination } from 'react-instantsearch-hooks-web';

import { RangeValues } from '@sorare/core/src/atoms/inputs/RangeSlider';
import RangeSliderWithInputs from '@sorare/core/src/components/search/RangeSliderWithInputs';
import { useRangeSlider } from '@sorare/core/src/hooks/useRangeSlider';
import {
  fromAgeToMaxBirthDate,
  fromAgeToMinBirthDate,
  fromBirthDateToAge,
} from '@sorare/core/src/lib/birthDate';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { FILTERS } from '@sorare/core/src/lib/filters';
import { clamp } from '@sorare/core/src/lib/math';

import { makeRangeFilter } from '../RangeSlider';

interface Props {
  attribute: string;
}

export const RefineAge = ({ attribute }: Props) => {
  const {
    refine,
    canRefine,
    range: { min, max },
    start: [currentRefinementMin, currentRefinementMax],
  } = useRangeSlider({
    attribute,
  });
  const track = useEvents();

  const localCurrentRefinementMax =
    currentRefinementMax === Infinity ? max || 0 : currentRefinementMax;
  const localCurrentRefinementMin =
    currentRefinementMin === -Infinity ? min || 0 : currentRefinementMin;

  // currentValues is expressed in years since the birth date
  const [currentValues, setCurrentValues] = useState({
    min: fromBirthDateToAge(localCurrentRefinementMax || max || 0), // on first load, when we don't have the min and max, we get null value, so the || 0 fixes the crash
    max: fromBirthDateToAge(localCurrentRefinementMin || min || 0),
  });
  const { refine: setPage } = usePagination();

  useEffect(() => {
    if (canRefine) {
      setCurrentValues(values => {
        if (
          fromBirthDateToAge(localCurrentRefinementMax || 0) !== values.max ||
          fromBirthDateToAge(localCurrentRefinementMin || 0) !== values.min
        ) {
          setCurrentValues({
            min: fromBirthDateToAge(localCurrentRefinementMax || 0),
            max: fromBirthDateToAge(localCurrentRefinementMin || 0),
          });
        }
        return values;
      });
    }
  }, [canRefine, localCurrentRefinementMax, localCurrentRefinementMin]);

  // If we don't have results, then don't show anything
  if (min === undefined || max === undefined) return null;

  const onValuesUpdated = (event: unknown, value: number | number[]) => {
    const values = value as number[];

    setCurrentValues({
      min: values[0],
      max: values[1],
    });
  };

  const onChange = (event: unknown, value: number | number[]) => {
    const values = value as number[];
    const nextMin = Math.max(min, fromAgeToMinBirthDate(values[1]));
    const nextMax = Math.min(max, fromAgeToMaxBirthDate(values[0]));

    if (currentRefinementMin !== nextMin || currentRefinementMax !== nextMax) {
      setPage(0);
      refine([nextMin, nextMax]);
      track('Use Market Filter', {
        filterName: attribute,
        filterValue: `${Math.floor(nextMin)}-${Math.ceil(nextMax)}`,
      });
    }
  };

  const computedMin = fromBirthDateToAge(max);
  const computedMax = fromBirthDateToAge(min);

  const minValue = clamp(currentValues.min, computedMin, computedMax);
  const maxValue = clamp(currentValues.max, computedMin, computedMax);

  return (
    <div className="FilterWidget visible">
      <RangeSliderWithInputs
        id="refine-age"
        min={computedMin}
        max={computedMax}
        rangeValues={{
          low: minValue,
          high: maxValue,
        }}
        onChange={(range: RangeValues) => {
          onValuesUpdated(null, [range.low, range.high]);
        }}
        onChangeCommitted={(range: RangeValues) =>
          onChange(null, [range.low, range.high])
        }
      />
    </div>
  );
};

export const RefineCardPlayerAge = makeRangeFilter(
  () => <RefineAge attribute={FILTERS.age.attribute} />,
  FILTERS.age
);
