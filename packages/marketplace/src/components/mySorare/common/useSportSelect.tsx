import { useCallback, useMemo } from 'react';
import { defineMessage } from 'react-intl';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Select from '@sorare/core/src/atoms/inputs/Select';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';
import { sportsLabelsMessages } from '@sorare/core/src/lib/glossary';

import { SportSelectType } from './types';

const SportSelectValue = {
  [SportSelectType.ALL_SPORTS]: [Sport.CRICKET, Sport.BASEBALL, Sport.NBA],
  [SportSelectType.FOOTBALL]: [Sport.CRICKET],
  [SportSelectType.BASEBALL]: [Sport.BASEBALL],
  [SportSelectType.NBA]: [Sport.NBA],
};

const messages = {
  [SportSelectType.ALL_SPORTS]: defineMessage({
    id: 'MySorare.sportSelect.all',
    defaultMessage: 'All Sports',
  }),
  [SportSelectType.FOOTBALL]: sportsLabelsMessages.FOOTBALL,
  [SportSelectType.BASEBALL]: sportsLabelsMessages.BASEBALL,
  [SportSelectType.NBA]: sportsLabelsMessages.NBA,
};

export default () => {
  const { formatMessage } = useIntlContext();

  const [selectedSport, setSelectedSport] = useLocalStorage<SportSelectType>(
    'MySorare.selectedSport',
    SportSelectType.ALL_SPORTS
  );

  const [{ sportType }, setSortType] = useQueryState({
    sportType: selectedSport || SportSelectType.ALL_SPORTS,
  });

  const onSportChange = useCallback(
    (item?: { label: string; value: SportSelectType } | null) => {
      if (!item) return;
      setSortType({ sportType: item.value });
      setSelectedSport(item.value);
    },
    [setSelectedSport, setSortType]
  );

  const sportOptions = useMemo(
    () =>
      Object.values(SportSelectType).map(element => ({
        label: formatMessage(messages[element]),
        value: element,
      })),
    [formatMessage]
  );

  const value = useMemo(() => {
    return {
      label: formatMessage(messages[sportType]),
      value: sportType,
    };
  }, [sportType, formatMessage]);

  const SportSelect = useCallback(() => {
    return (
      <Select
        menuLateralAlignment="right"
        value={value}
        onChange={onSportChange}
        options={sportOptions}
      />
    );
  }, [value, sportOptions, onSportChange]);

  return {
    sportOptions,
    sportType,
    SportSelect,
    sportInputValue: SportSelectValue[sportType],
  };
};
