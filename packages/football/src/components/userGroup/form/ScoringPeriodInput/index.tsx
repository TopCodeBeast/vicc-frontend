import { gql } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Select from '@sorare/core/src/components/form/Form/Select';
import { SimpleSelectOption } from '@sorare/core/src/components/form/Form/SimpleSelect';
import { useFormContext } from '@sorare/core/src/components/form/Form/context';

import { FieldWrapper } from '@football/components/userGroup/form/FieldWrapper';

import { ScoringPeriodInput_upcomingFixture } from './__generated__/index.graphql';

type Props = { upcomingFixture: ScoringPeriodInput_upcomingFixture };

const InputContainer = styled.div`
  display: flex;
  gap: var(--unit);
  & > * {
    flex: 1;
  }
`;

const START_WEEK_OPTIONS = 5;
const END_WEEK_OPTIONS = 25;

export const ScoringPeriodInput = ({ upcomingFixture }: Props) => {
  const { formatMessage } = useIntl();
  const { handleChange } = useFormContext();
  const [startWeek, setStartWeek] = useState<number>(upcomingFixture.gameWeek);

  const getGameWeekLabel = useCallback(
    (gameWeek: number) => {
      if (upcomingFixture.gameWeek === gameWeek) {
        return upcomingFixture.displayName;
      }
      return formatMessage(
        {
          id: 'ScoringPeriodInput.gameweek',
          defaultMessage: 'Game week {number}',
        },
        {
          number: gameWeek,
        }
      );
    },
    [formatMessage, upcomingFixture]
  );

  const startWeekOptions = useMemo<SimpleSelectOption[]>(() => {
    return new Array(START_WEEK_OPTIONS).fill(0).map((_, idx) => ({
      label: getGameWeekLabel(idx + upcomingFixture.gameWeek),
      value: `${idx + upcomingFixture.gameWeek}`,
    }));
  }, [upcomingFixture, getGameWeekLabel]);

  const endWeekOptions = useMemo<SimpleSelectOption[]>(() => {
    return [
      {
        label: formatMessage({
          id: 'UserGroups.create.never_ends',
          defaultMessage: 'Never ends',
        }),
        value: '',
      },
      ...new Array(END_WEEK_OPTIONS).fill(0).map((_, idx) => ({
        label: getGameWeekLabel(idx + startWeek),
        value: `${idx + startWeek}`,
      })),
    ];
  }, [startWeek, getGameWeekLabel, formatMessage]);

  return (
    <FieldWrapper>
      <InputContainer>
        <Select
          name="startGameWeek"
          initialValue={startWeekOptions[0]}
          id="newStartGameWeek"
          onChange={e => {
            setStartWeek(+(e.target as HTMLInputElement)?.value);
            handleChange('endGameWeek')({
              target: {
                value: '',
              },
            });
          }}
          isDisabled={!upcomingFixture}
          options={startWeekOptions}
          label={formatMessage({
            id: 'UserGroups.create.StartScoring',
            defaultMessage: 'Scoring starts',
          })}
        />
        <Select
          name="endGameWeek"
          id="newEndGameWeek"
          label={formatMessage({
            id: 'UserGroups.create.EndScoring',
            defaultMessage: 'Scoring ends',
          })}
          options={endWeekOptions}
        />
      </InputContainer>
    </FieldWrapper>
  );
};

ScoringPeriodInput.fragments = {
  upcomingFixture: gql`
    fragment ScoringPeriodInput_upcomingFixture on Vicc5Fixture {
      slug
      gameWeek
      displayName
    }
  `,
};

export default ScoringPeriodInput;
