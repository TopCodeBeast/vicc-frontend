import { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import Select from '@sorare/core/src/atoms/inputs/Select';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';

import { Subscription } from '@marketplace/components/Subscription';
import { tokenAuctionSubscription } from '@marketplace/lib/fragments';

import MyPage from '../MyPage';
import { messages as sortMessages } from '../common/messages';
import { MySorarePage } from '../common/pages';
import { DefaultSortType, OpenSaleSortType } from '../common/types';
import useSportSelect from '../common/useSportSelect';
import AllAuctions from './AllAuctions';
import LostAuctions from './LostAuctions';
import OpenAuctions from './OpenAuctions';
import WonAuctions from './WonAuctions';

enum SelectType {
  ALL_AUCTIONS = 'allAuctions',
  OPEN_AUCTIONS = 'openAuctions',
  AUCTIONS_WON = 'auctionsWon',
  AUCTIONS_LOST = 'auctionsLost',
}

type SortType = OpenSaleSortType | DefaultSortType;

const getSortTypeOptions = (
  selectType: SelectType
): (OpenSaleSortType | DefaultSortType)[] => {
  switch (selectType) {
    case SelectType.OPEN_AUCTIONS: {
      return Object.values(OpenSaleSortType);
    }
    default: {
      return Object.values(DefaultSortType);
    }
  }
};

const messages = defineMessages({
  allAuctions: {
    id: 'MyAuctions.allAuctions',
    defaultMessage: 'All Auctions',
  },
  openAuctions: {
    id: 'MyAuctions.openAuctions',
    defaultMessage: 'Open Auctions',
  },
  auctionsWon: {
    id: 'MyAuctions.auctionsWon',
    defaultMessage: 'Auctions Won',
  },
  auctionsLost: {
    id: 'MyAuctions.auctionsLost',
    defaultMessage: 'Auctions Lost',
  },
});

const MyAuctions = () => {
  const { formatMessage } = useIntlContext();
  const { sportInputValue, SportSelect } = useSportSelect();

  const [{ selectType, sortType }, setState] = useQueryState({
    selectType: SelectType.ALL_AUCTIONS,
    sortType: DefaultSortType.LATEST as SortType,
  });

  const selectOptions = useMemo(
    () =>
      Object.values(SelectType).map(element => ({
        label: formatMessage(messages[element]),
        value: element,
      })),
    [formatMessage]
  );
  const sortOptions = useMemo(
    () =>
      getSortTypeOptions(selectType).map((element: SortType) => ({
        label: formatMessage(sortMessages[element]),
        value: element,
      })),
    [formatMessage, selectType]
  );

  const onSelectTypeChange = (item: {
    label: SelectType;
    value: SelectType;
  }) => {
    setState(prevState => {
      if (prevState.selectType === item.value) return prevState;

      return {
        selectType: item.value,
        sortType:
          item.value === SelectType.OPEN_AUCTIONS
            ? OpenSaleSortType.ENDING_SOON
            : DefaultSortType.LATEST,
      };
    });
  };
  const onSortTypeChange = (item: { label: SortType; value: SortType }) => {
    setState(prevState => ({ ...prevState, sortType: item.value }));
  };

  const displayItems = () => {
    switch (selectType) {
      case SelectType.ALL_AUCTIONS: {
        return (
          <AllAuctions
            sortType={sortType as DefaultSortType}
            sport={sportInputValue}
          />
        );
      }
      case SelectType.OPEN_AUCTIONS: {
        return (
          <OpenAuctions
            sortType={sortType as OpenSaleSortType}
            sport={sportInputValue}
          />
        );
      }
      case SelectType.AUCTIONS_WON: {
        return (
          <WonAuctions
            sortType={sortType as DefaultSortType}
            sport={sportInputValue}
          />
        );
      }
      default: {
        return (
          <LostAuctions
            sortType={sortType as DefaultSortType}
            sport={sportInputValue}
          />
        );
      }
    }
  };

  return (
    <MyPage
      page={MySorarePage.AUCTIONS}
      toolbar={
        <>
          <SportSelect />
          <Select
            menuLateralAlignment="right"
            value={{
              label: formatMessage(messages[selectType]),
              value: selectType,
            }}
            onChange={option =>
              onSelectTypeChange(
                option as { label: SelectType; value: SelectType }
              )
            }
            options={selectOptions}
          />
          <Select
            menuLateralAlignment="right"
            value={{
              label: formatMessage(sortMessages[sortType]),
              value: sortType,
            }}
            onChange={option =>
              onSortTypeChange(option as { label: SortType; value: SortType })
            }
            options={sortOptions}
          />
        </>
      }
    >
      <Subscription gql={tokenAuctionSubscription} />
      {displayItems()}
    </MyPage>
  );
};

export default MyAuctions;
