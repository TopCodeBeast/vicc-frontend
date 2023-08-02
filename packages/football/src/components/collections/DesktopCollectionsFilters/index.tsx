import { TypedDocumentNode, gql } from '@apollo/client';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';

import { CheckboxFilters } from '@football/components/collections/CheckboxFilters';
import { StartedOnlyFilter } from '@football/components/collections/StartedOnlyFilter';
import { CollectionsFiltersState } from '@football/components/collections/types';

import { DesktopCollectionsFilters_cardCollectionConnection } from './__generated__/index.graphql';

type Props = {
  collectionConnection: DesktopCollectionsFilters_cardCollectionConnection;
  onFiltersChange: (newState: CollectionsFiltersState) => void;
  filtersState: CollectionsFiltersState;
};

export const DesktopCollectionsFilters = ({
  collectionConnection,
  filtersState,
  onFiltersChange,
}: Props) => {
  const onRaritiesChange = (newRarities: Rarity[] | undefined) => {
    onFiltersChange({ ...filtersState, rarities: newRarities });
  };

  const onSeasonsChange = (newSeasons: number[] | undefined) => {
    onFiltersChange({ ...filtersState, seasonStartYears: newSeasons });
  };

  const onStartedOnlyChange = (startedOnly: boolean) => {
    onFiltersChange({ ...filtersState, startedOnly });
  };

  return (
    <>
      <CheckboxFilters
        collectionConnection={collectionConnection}
        rarities={filtersState.rarities}
        seasonStartYears={filtersState.seasonStartYears}
        onRaritiesChange={onRaritiesChange}
        onSeasonsChange={onSeasonsChange}
      />
      <StartedOnlyFilter
        startedOnly={filtersState.startedOnly}
        onChange={onStartedOnlyChange}
      />
    </>
  );
};

DesktopCollectionsFilters.fragments = {
  cardCollectionConnection: gql`
    fragment DesktopCollectionsFilters_cardCollectionConnection on CardCollectionConnection {
      ...CheckboxFilters_cardCollectionConnection
    }
    ${CheckboxFilters.fragments.cardCollectionConnection}
  ` as TypedDocumentNode<DesktopCollectionsFilters_cardCollectionConnection>,
};
