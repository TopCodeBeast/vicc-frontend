import {
  AdvancedBlockchainCardSearch,
  FullProps,
} from '@sorare/marketplace/src/searchCards/AdvancedCardSearch';

export const CardSearch = (
  props: Omit<FullProps, 'CardResultsComponent' | 'sport'> & {}
) => {
  const { ...rest } = props;
  return <AdvancedBlockchainCardSearch {...rest} />;
};

export default CardSearch;
