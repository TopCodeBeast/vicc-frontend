import MyPage from '../MyPage';
import { MySorarePage } from '../common/pages';
import useSortByDate from '../common/useSortByDate';
import useSportSelect from '../common/useSportSelect';
import BoughtSingleSaleOffers from './BoughtSingleSaleOffers';

const MyPurchases = () => {
  const { sortType, SortSelect } = useSortByDate();
  const { sportInputValue, SportSelect } = useSportSelect();

  return (
    <MyPage
      page={MySorarePage.PURCHASES}
      toolbar={
        <>
          <SportSelect />
          <SortSelect />
        </>
      }
    >
      <BoughtSingleSaleOffers sortType={sortType} sport={sportInputValue} />
    </MyPage>
  );
};

export default MyPurchases;
