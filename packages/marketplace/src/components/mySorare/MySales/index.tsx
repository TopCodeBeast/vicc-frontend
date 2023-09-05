import { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import Select from '@sorare/core/src/atoms/inputs/Select';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';

import MyPage from '../MyPage';
import { messages as sortMessages } from '../common/messages';
import { MyViccPage } from '../common/pages';
import { DefaultSortType, OpenSaleSortType } from '../common/types';
import useSportSelect from '../common/useSportSelect';
import AllSingleSaleOffers from './AllSingleSaleOffers';
import NoBuyerSingleSaleOffers from './NoBuyerSingleSaleOffers';
import OpenSingleSaleOffers from './OpenSingleSaleOffers';
import SoldSingleSaleOffers from './SoldSingleSaleOffers';

enum SelectType {
  ALL = 'all',
  OPEN_SALE = 'openSale',
  SOLD = 'sold',
  ENDED_WITH_NO_BUYER = 'endedWithNoBuyer',
}

type SortType = OpenSaleSortType | DefaultSortType;

const getSortTypeOptions = (
  selectType: SelectType
): (OpenSaleSortType | DefaultSortType)[] => {
  switch (selectType) {
    case SelectType.OPEN_SALE: {
      return Object.values(OpenSaleSortType);
    }
    default: {
      return Object.values(DefaultSortType);
    }
  }
};

const messages = defineMessages({
  all: {
    id: 'MySales.all',
    defaultMessage: 'All Sales',
  },
  openSale: {
    id: 'MySales.openSale',
    defaultMessage: 'Open Sale',
  },
  sold: {
    id: 'MySales.sold',
    defaultMessage: 'Sold',
  },
  endedWithNoBuyer: {
    id: 'MySales.endedWithNoBuyer',
    defaultMessage: 'Ended with no buyer',
  },
});

const MySales = () => {
  const { formatMessage } = useIntlContext();
  const { sportInputValue, SportSelect } = useSportSelect();
  const [state, setState] = useQueryState({
    selectType: SelectType.ALL,
    sortType: DefaultSortType.LATEST as SortType,
  });

  const { selectType, sortType } = state;

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
          item.value === SelectType.OPEN_SALE
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
      case SelectType.ALL: {
        return (
          <AllSingleSaleOffers
            sortType={sortType as DefaultSortType}
            sport={sportInputValue}
          />
        );
      }
      case SelectType.OPEN_SALE: {
        return (
          <OpenSingleSaleOffers
            sortType={sortType as OpenSaleSortType}
            sport={sportInputValue}
          />
        );
      }
      case SelectType.SOLD: {
        return (
          <SoldSingleSaleOffers
            sortType={sortType as DefaultSortType}
            sport={sportInputValue}
          />
        );
      }
      default: {
        return (
          <NoBuyerSingleSaleOffers
            sortType={sortType as DefaultSortType}
            sport={sportInputValue}
          />
        );
      }
    }
  };

  return (
    <MyPage
      page={MyViccPage.SALES}
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
      {displayItems()}
    </MyPage>
  );
};

export default MySales;
