import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { ChangeEvent, useMemo, useReducer } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import Radio from '@sorare/core/src/atoms/inputs/Radio';
import Select from '@sorare/core/src/atoms/inputs/Select';
import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import ScarcityBall from '@sorare/core/src/components/card/ScarcityBall';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { cardAttributes } from '@sorare/core/src/lib/glossary';
import { ScarcityType } from '@sorare/core/src/lib/scarcity';
import { theme } from '@sorare/core/src/style/theme';

import { FilterDialog } from './FilterDialog';

const MobileHeader = styled.header`
  display: flex;
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: none;
  }
`;
const DesktopHeader = styled.header`
  display: none;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: flex;
    gap: var(--double-unit);
    align-items: center;
    flex-wrap: wrap;
  }
`;
const Filter = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Scarcities = styled.div`
  display: flex;
  gap: var(--unit);
  flex-wrap: wrap;
`;

const StyledSelect = styled<typeof Select>(Select)`
  font-weight: bold;
`;
const RadioWrapper = styled.div`
  &:not(:first-child) {
    border-top: 1px solid var(--c-neutral-300);
  }
  padding: var(--double-unit) 0;
`;

const messages = defineMessages({
  sort: {
    id: 'SortAndFilters.sort',
    defaultMessage: 'Sort',
  },
  save: {
    id: 'SortAndFilters.save',
    defaultMessage: 'Save',
  },
  dialogHeader: {
    id: 'SortAndFilters.sortTournaments',
    defaultMessage: 'Sort Tournaments',
  },
  filterDialogHeader: {
    id: 'SortAndFilters.filterDialogHeader',
    defaultMessage: 'Filter Tournaments',
  },
  filter: {
    id: 'SortAndFilters.filter',
    defaultMessage: 'Filter',
  },
  apply: {
    id: 'SortAndFilters.apply',
    defaultMessage: 'Apply Filter',
  },
  filtersCompetition: {
    id: 'SortAndFilters.filters.competitions',
    defaultMessage: 'Competitions',
  },
});

const ShowRecommendedCompetitionFilter = ({
  onChange,
  checked,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}) => (
  <Checkbox
    label={
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage
          id="SortAndfilters.ShowRecommended.Label"
          defaultMessage="Show recommended competitions"
        />
      </Text16>
    }
    checked={checked}
    onChange={onChange}
  />
);

export type SortAndFiltersType = {
  filter?: { scarcity?: string; showRecommended?: boolean };
  sortBy?: (
    | {
        id: string;
        descending: boolean;
      }
    | undefined
  )[];
};
type Props = {
  defaultValues: SortAndFiltersType;
  sortLabel: { id: string; cell?: string }[];
  onChange: (sortAndFilter: SortAndFiltersType) => void;
  values: ScarcityType[];
};
export const SortAndFilters = ({
  sortLabel,
  onChange,
  defaultValues,
  values,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const [sortAndFilters, dispatch] = useReducer(
    (
      state: SortAndFiltersType,
      action: {
        type: 'sortBy' | 'filter';
        payload: any;
      }
    ) => {
      switch (action.type) {
        case 'filter': {
          return {
            ...state,
            filter: { ...state.filter, ...action.payload.filter },
          };
        }
        case 'sortBy': {
          return {
            ...state,
            sortBy: action.payload,
          };
        }
        default:
          return state;
      }
    },
    defaultValues
  );
  const scarcitiesOptions = useMemo(
    () => [
      {
        label: (
          <ScarcityBall
            scarcity="mix"
            iconOnly
            label={formatMessage({
              id: 'Lobby.SortAndFilters.All',
              defaultMessage: 'All scarcities',
            })}
          />
        ),
        value: 'all',
      },
      ...values.map(scarcity => ({
        label: <ScarcityBall scarcity={scarcity} />,
        value: scarcity,
      })),
    ],
    [values, formatMessage]
  );

  return (
    <div>
      <MobileHeader>
        <FilterDialog
          buttonLabel={formatMessage(messages.sort)}
          onCloseWithoutSaving={() => {
            dispatch({
              type: 'sortBy',
              payload: defaultValues.sortBy,
            });
          }}
          headerLabel={formatMessage(messages.dialogHeader)}
          onSave={() => onChange(sortAndFilters)}
          saveLabel={formatMessage(messages.save)}
        >
          {sortLabel
            .filter(({ cell }) => !!cell)
            .map(({ id, cell }) => {
              return (
                id &&
                cell && (
                  <RadioWrapper key={id}>
                    <Radio
                      value={id}
                      checked={sortAndFilters?.sortBy?.[0]?.id === id}
                      name="SortAndFilters"
                      onChange={() => {
                        dispatch({
                          type: 'sortBy',
                          payload: sortAndFilters.sortBy.map(() => ({
                            id,
                            descending: false,
                          })),
                        });
                      }}
                      labelContent={<Text16>{cell}</Text16>}
                    />
                  </RadioWrapper>
                )
              );
            })}
        </FilterDialog>
        <FilterDialog
          buttonLabel={formatMessage(messages.filter)}
          onCloseWithoutSaving={() => {
            dispatch({
              type: 'filter',
              payload: { filter: defaultValues.filter },
            });
          }}
          headerLabel={formatMessage(messages.filterDialogHeader)}
          onSave={() => onChange(sortAndFilters)}
          saveLabel={formatMessage(messages.apply)}
        >
          <Filter>
            <Title5>{formatMessage(cardAttributes.scarcity)}</Title5>
            <Scarcities>
              {scarcitiesOptions.map(item => {
                return (
                  item.value &&
                  item.label && (
                    <Button
                      color={
                        sortAndFilters.filter?.scarcity === item.value
                          ? 'black'
                          : 'white'
                      }
                      stroke={false}
                      key={item.value}
                      medium
                      onClick={() => {
                        dispatch({
                          type: 'filter',
                          payload: { filter: { scarcity: item.value } },
                        });
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                );
              })}
            </Scarcities>
            <Title5>
              <FormattedMessage {...messages.filtersCompetition} />
            </Title5>
            <ShowRecommendedCompetitionFilter
              checked={sortAndFilters?.filter?.showRecommended}
              onChange={e => {
                dispatch({
                  type: 'filter',
                  payload: { filter: { showRecommended: e.target.checked } },
                });
              }}
            />
          </Filter>
        </FilterDialog>
      </MobileHeader>
      <DesktopHeader>
        <StyledSelect
          onChange={(selected: any) => {
            if (!selected) {
              return;
            }
            dispatch({
              type: 'filter',
              payload: { filter: { scarcity: selected.value } },
            });
            onChange({
              filter: {
                ...sortAndFilters.filter,
                scarcity: selected.value,
              },
            });
          }}
          value={scarcitiesOptions.find(
            ({ value }) => value === sortAndFilters.filter?.scarcity
          )}
          options={scarcitiesOptions}
          icon={faAngleDown}
        />
        <ShowRecommendedCompetitionFilter
          checked={sortAndFilters?.filter?.showRecommended}
          onChange={e => {
            dispatch({
              type: 'filter',
              payload: { filter: { showRecommended: e.target.checked } },
            });
            onChange({
              filter: {
                ...sortAndFilters.filter,
                showRecommended: e.target.checked,
              },
            });
          }}
        />
      </DesktopHeader>
    </div>
  );
};
