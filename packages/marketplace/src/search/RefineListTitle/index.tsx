import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { MessageDescriptor } from 'react-intl';

import FilterTitle from '@sorare/core/src/components/search/FilterTitle';

interface Props {
  attribute: string;
  name: MessageDescriptor;
}

export const RefineListTitle = ({ attribute, name }: Props) => {
  const { indexUiState } = useInstantSearch();

  const selected = indexUiState.refinementList?.[attribute]?.length || false;

  return <FilterTitle name={name} selected={selected} />;
};

export default RefineListTitle;
