import { useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import {
  Sport,
  SubscribableType,
} from '@sorare/core/src/__generated__/globalTypes';
import Select from '@sorare/core/src/atoms/inputs/Select';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';

const messages = defineMessages({
  all: {
    id: 'MyFollows.all',
    defaultMessage: 'All',
    selectedTypes: [
      SubscribableType.PLAYER,
      SubscribableType.TEAM,
      SubscribableType.COUNTRY,
      SubscribableType.BASEBALL_PLAYER,
      SubscribableType.NBA_PLAYER,
    ],
  },
  player: {
    id: 'MyFollows.player',
    defaultMessage: 'Player',
    selectedTypes: [
      SubscribableType.PLAYER,
      SubscribableType.BASEBALL_PLAYER,
      SubscribableType.NBA_PLAYER,
    ],
  },
  club: {
    id: 'MyFollows.club',
    defaultMessage: 'Club',
    selectedTypes: [SubscribableType.TEAM],
  },
  country: {
    id: 'MyFollows.country',
    defaultMessage: 'Country',
    selectedTypes: [SubscribableType.COUNTRY],
  },
});

const SubscribableTypeBySport: {
  [sport in Sport]: SubscribableType[];
} = {
  [Sport.FOOTBALL]: [
    SubscribableType.PLAYER,
    SubscribableType.TEAM,
    SubscribableType.COUNTRY,
  ],
  [Sport.BASEBALL]: [SubscribableType.BASEBALL_PLAYER],
  [Sport.NBA]: [SubscribableType.NBA_PLAYER],
};

type SelectType = keyof typeof messages;

type Props = {
  sportInputValue: Sport[];
};
const useSubscribableTypesSelect = ({ sportInputValue }: Props) => {
  const [{ selectedType }, setSelectedType] = useQueryState({
    selectedType: 'all' as SelectType,
  });

  const { formatMessage } = useIntlContext();

  const selectedSubscribableTypesVariables: SubscribableType[] = useMemo(() => {
    return messages[selectedType].selectedTypes.filter(s => {
      return sportInputValue.some(sport =>
        SubscribableTypeBySport[sport].includes(s)
      );
    });
  }, [sportInputValue, selectedType]);

  const selectOptions = useMemo(() => {
    return Object.entries(messages)
      .filter(entries => {
        return sportInputValue.some(sport => {
          return entries[1].selectedTypes.find(s =>
            SubscribableTypeBySport[sport].includes(s)
          );
        });
      })
      .map(entries => ({
        label: formatMessage(entries[1]),
        value: entries[0],
      }));
  }, [formatMessage, sportInputValue]);

  useEffect(() => {
    if (!selectOptions.find(o => o.value === selectedType)) {
      setSelectedType({ selectedType: 'all' as SelectType });
    }
  }, [selectOptions, selectedType, setSelectedType]);
  return {
    SubscribableTypeSelect: () => (
      <Select
        menuLateralAlignment="right"
        value={{
          label: formatMessage(messages[selectedType]),
          value: selectedType,
        }}
        onChange={option =>
          setSelectedType({ selectedType: option!.value as SelectType })
        }
        options={selectOptions}
      />
    ),
    selectedSubscribableTypesVariables,
  };
};

export default useSubscribableTypesSelect;
