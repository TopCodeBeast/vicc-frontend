import { FormattedMessage } from 'react-intl';

import { Empty as EmptyCards } from '@sorare/core/src/components/cards/Empty';
import { filters } from '@sorare/core/src/lib/glossary';

import useFiltersCount from '@marketplace/search/FiltersManager/useFiltersCount';
import { SearchTopic } from '@marketplace/searchCards/AdvancedCardSearch/types';

import EmptyMarket from './EmptyMarket';
import NoResults from './NoResults';

interface Props {
  isGallery: boolean;
  topic?: SearchTopic;
}

export const Empty = ({ isGallery, topic }: Props) => {
  const filtersCount = useFiltersCount();

  const title = topic ? (
    <FormattedMessage
      {...filters.noCardsOfTopicFound}
      values={{ topic: topic.label }}
    />
  ) : (
    <FormattedMessage {...filters.noCardsFound} />
  );

  const galleryCTA = isGallery ? null : <EmptyMarket />;
  const description = filtersCount > 0 ? <NoResults /> : galleryCTA;

  return <EmptyCards title={title} description={description} />;
};

export default Empty;
