import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode, useMemo } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Select from '@sorare/core/src/atoms/inputs/Select';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';

import { Subscription } from '@marketplace/components/Subscription';

import MyPage from '../../MyPage';
import { messages } from '../messages';
import { MyViccPage } from '../pages';
import {
  OfferSelectType as SelectType,
  DefaultSortType as SortType,
} from '../types';
import useSportSelect from '../useSportSelect';
import {
  onOfferUpdated,
  onOfferUpdatedVariables,
} from './__generated__/index.graphql';

interface Props {
  page: MyViccPage;
  displayItems: (
    selectType: SelectType,
    sortType: SortType,
    sport: Sport[]
  ) => ReactNode;
}

const OFFER_SUBSCRIPTION = gql`
  subscription onOfferUpdated {
    tokenOfferWasUpdated {
      id
      status
    }
  }
` as TypedDocumentNode<onOfferUpdated, onOfferUpdatedVariables>;

const DisplayOffers = ({ page, displayItems }: Props) => {
  const { formatMessage } = useIntlContext();

  const { sportInputValue, SportSelect } = useSportSelect();

  const [{ selectType, sortType }, setState] = useQueryState({
    selectType: SelectType.ALL_OFFERS,
    sortType: SortType.LATEST as SortType,
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
      Object.values(SortType).map(element => ({
        label: formatMessage(messages[element]),
        value: element,
      })),
    [formatMessage]
  );

  const onSelectTypeChange = (item: {
    label: SelectType;
    value: SelectType;
  }) => {
    setState(prevState => {
      if (prevState.selectType === item.value) {
        return prevState;
      }
      return {
        selectType: item.value,
        sortType: SortType.LATEST,
      };
    });
  };
  const onSortTypeChange = (item: { label: SortType; value: SortType }) => {
    setState(prevState => ({ ...prevState, sortType: item.value }));
  };

  const renderItems = useMemo(
    () => displayItems(selectType, sortType, sportInputValue),
    [displayItems, selectType, sortType, sportInputValue]
  );

  return (
    <MyPage
      page={page}
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
              label: formatMessage(messages[sortType]),
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
      <Subscription gql={OFFER_SUBSCRIPTION} />
      {renderItems}
    </MyPage>
  );
};

export default DisplayOffers;
