import {
  OfferDirection,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';

import {
  DisplayMyOffers,
  statesFromSelectType,
} from '../common/DisplayMyOffers';
import DisplayOffers from '../common/DisplayOffers';
import { MySorarePage } from '../common/pages';
import { DefaultSortType, OfferSelectType } from '../common/types';

export const MyOffers = ({
  page,
}: {
  page: MySorarePage.OFFERS_RECEIVED | MySorarePage.OFFERS_SENT;
}) => {
  return (
    <DisplayOffers
      page={page}
      displayItems={(
        selectType: OfferSelectType,
        sortType: DefaultSortType,
        sport: Sport[]
      ) => (
        <DisplayMyOffers
          sortType={sortType}
          sport={sport}
          direction={
            page === MySorarePage.OFFERS_RECEIVED
              ? OfferDirection.RECEIVED
              : OfferDirection.SENT
          }
          states={statesFromSelectType(selectType)}
        />
      )}
    />
  );
};
