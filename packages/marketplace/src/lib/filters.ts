import {
  fromAgeToMaxBirthDate,
  fromAgeToMinBirthDate,
} from '@sorare/core/src/lib/birthDate';

export const getAgeFilterValue = ({
  min,
  max,
}: {
  min?: number;
  max?: number;
}) => {
  if (min === undefined && max === undefined) {
    return undefined;
  }

  const minTimeStamp = min !== undefined ? fromAgeToMaxBirthDate(min) : '';
  const maxTimeStamp = max !== undefined ? fromAgeToMinBirthDate(max) : '';

  return `${maxTimeStamp}:${minTimeStamp}`;
};
