import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedDate, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { NativeSelect } from '@core/atoms/inputs/NativeSelect';
import { Text16 } from '@core/atoms/typography';
import { useIntlContext } from '@core/contexts/intl';
import { range } from '@core/lib/arrays';

enum InputTypes {
  year = 'year',
  month = 'month',
  day = 'day',
}

type Option = {
  value: string;
  label: ReactNode;
};
const CenterText16 = styled(Text16)`
  text-align: center;
  width: 100%;
`;
const date = new Date();
const currentYear = date.getFullYear();

const yearsOptions = range(100).map(i => {
  return {
    value: (currentYear - i)?.toString(),
    label: (currentYear - i).toString(),
  };
});

const daysOption = range(31).map(i => {
  return {
    value: (i + 1)?.toString(),
    label: (i + 1).toString().padStart(2, '0'),
  };
});

const placeholders = defineMessages({
  [InputTypes.year]: {
    id: 'IntlDate.year',
    defaultMessage: 'Year',
  },
  [InputTypes.month]: {
    id: 'IntlDate.month',
    defaultMessage: 'Month',
  },
  [InputTypes.day]: {
    id: 'IntlDate.day',
    defaultMessage: 'Day',
  },
});

const Root = styled.div`
  color: var(--c-neutral-1000);
  display: flex;
  gap: var(--unit);
  align-items: center;
  justify-content: flex-start;
`;

const IntlDate = ({
  onChange,
  value: initialValue,
  autoComplete,
}: {
  onChange: (date: Date) => void;
  value?: Date;
  autoComplete?: 'bday';
}) => {
  const { formatDate } = useIntlContext();
  const monthOptions = range(12).map(i => {
    const fakeDate = new Date(2023, i, 1);
    return {
      // monthIndex is used in the Date constructor
      value: i.toString(),
      label: formatDate(fakeDate, {
        timeZone: undefined,
        month: 'long',
      }),
    };
  });
  const optionsByType = {
    [InputTypes.year]: yearsOptions,
    [InputTypes.month]: monthOptions,
    [InputTypes.day]: daysOption,
  };

  const { formatDateToParts, formatMessage } = useIntl();
  const filterParts = formatDateToParts(undefined);
  const [month, setMonth] = useState<Option | undefined>(
    initialValue && {
      value: initialValue.getUTCMonth().toString(),
      label: (
        <CenterText16 bold>
          <FormattedDate value={initialValue} timeZone="UTC" month="long" />
        </CenterText16>
      ),
    }
  );
  const [year, setYear] = useState<Option | undefined>(
    initialValue && {
      value: initialValue.getUTCFullYear().toString(),
      label: <CenterText16 bold>{initialValue.getUTCFullYear()}</CenterText16>,
    }
  );
  const [day, setDay] = useState<Option | undefined>(
    initialValue && {
      value: initialValue.getUTCDate().toString(),
      label: <CenterText16 bold>{initialValue.getUTCDate()}</CenterText16>,
    }
  );

  const getValue = (type: InputTypes) => {
    if (type === InputTypes.year) return year;
    if (type === InputTypes.month) return month;
    return day;
  };

  const onSelectChange = (option: Option | undefined, type: InputTypes) => {
    if (type === InputTypes.year) {
      setYear(option);
      return;
    }
    if (type === InputTypes.month) {
      setMonth(option);
      return;
    }
    setDay(option);
  };
  const updatedDate = useMemo(
    () =>
      year &&
      month &&
      day &&
      new Date(
        Date.UTC(Number(year.value), Number(month.value), Number(day.value))
      ),
    [year, month, day]
  );

  useEffect(() => {
    if (updatedDate) onChange(updatedDate);
  }, [onChange, updatedDate]);

  return (
    <Root>
      {filterParts.map(part => {
        if (Object.keys(InputTypes).includes(part.type)) {
          const type = part.type as InputTypes;

          return (
            <div key={type}>
              <NativeSelect
                autoComplete={
                  autoComplete ? `${autoComplete}-${type}` : undefined
                }
                placeholder={formatMessage(placeholders[type])}
                values={optionsByType[type]}
                onChange={value => {
                  onSelectChange(
                    optionsByType[type].find(o => o.value === value)!,
                    type
                  );
                }}
                name={type}
                value={getValue(type)?.value?.toString() || ''}
              />
            </div>
          );
        }
        return null;
      })}
    </Root>
  );
};

export default IntlDate;
