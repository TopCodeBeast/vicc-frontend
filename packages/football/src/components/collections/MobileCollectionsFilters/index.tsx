import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import DialogContentWithNavigation from '@sorare/core/src/atoms/layout/DialogContentWithNavigation';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { filters, glossary } from '@sorare/core/src/lib/glossary';

import { CheckboxFilters } from '@football/components/collections/CheckboxFilters';
import { StartedOnlyFilter } from '@football/components/collections/StartedOnlyFilter';
import { CollectionsFiltersState } from '@football/components/collections/types';

import { MobileCollectionsFilters_cardCollectionConnection } from './__generated__/index.graphql';

const Wrapper = styled.div`
  padding: 0 var(--double-unit);
`;

type Props = {
  open: boolean;
  onClose: () => void;
  collectionConnection: MobileCollectionsFilters_cardCollectionConnection;
  onFiltersChange: (newState: CollectionsFiltersState) => void;
  filtersState: CollectionsFiltersState;
};

export const MobileCollectionsFilters = ({
  open,
  onClose,
  collectionConnection,
  onFiltersChange,
  filtersState,
}: Props) => {
  /* On mobile the filters are not immediately applied until the user confirms. 
  This is the state for the filters that have been selected but not necessarily applied */
  const [selectedFiltersState, setSelectedFiltersState] = useState<
    Omit<CollectionsFiltersState, 'query'>
  >({
    rarities: filtersState.rarities,
    seasonStartYears: filtersState.seasonStartYears,
    startedOnly: filtersState.startedOnly,
  });

  const onRaritiesChange = (newRarities: Rarity[] | undefined) => {
    setSelectedFiltersState({ ...selectedFiltersState, rarities: newRarities });
  };
  const onSeasonsChange = (newSeasons: number[] | undefined) => {
    setSelectedFiltersState({
      ...selectedFiltersState,
      seasonStartYears: newSeasons,
    });
  };
  const onStartedOnlyChange = (startedOnly: boolean) => {
    setSelectedFiltersState({ ...selectedFiltersState, startedOnly });
  };
  const onClearAll = () => {
    setSelectedFiltersState({
      rarities: undefined,
      seasonStartYears: undefined,
      startedOnly: false,
    });
  };
  const onSubmitFilters = () => {
    onFiltersChange({ ...selectedFiltersState, query: filtersState.query });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen hideCloseButton noMargin>
      <DialogContentWithNavigation
        title={
          <Text16 bold>
            <FormattedMessage {...filters.filters} />
          </Text16>
        }
        onBackButton={onClose}
        stickyHeader
        noPadding
        right={
          <Button
            color="transparent"
            compact
            onClick={onClearAll}
            disabled={
              !selectedFiltersState.rarities &&
              !selectedFiltersState.seasonStartYears
            }
          >
            <Text16>
              <FormattedMessage {...filters.clearAll} />
            </Text16>
          </Button>
        }
        footer={
          <Button onClick={onSubmitFilters} fullWidth medium color="blue">
            <FormattedMessage {...glossary.save} />
          </Button>
        }
      >
        <Wrapper>
          <CheckboxFilters
            collectionConnection={collectionConnection}
            rarities={selectedFiltersState.rarities}
            seasonStartYears={selectedFiltersState.seasonStartYears}
            onRaritiesChange={onRaritiesChange}
            onSeasonsChange={onSeasonsChange}
          />
          <StartedOnlyFilter
            startedOnly={selectedFiltersState.startedOnly}
            onChange={onStartedOnlyChange}
          />
        </Wrapper>
      </DialogContentWithNavigation>
    </Dialog>
  );
};

MobileCollectionsFilters.fragments = {
  cardCollectionConnection: gql`
    fragment MobileCollectionsFilters_cardCollectionConnection on CardCollectionConnection {
      ...CheckboxFilters_cardCollectionConnection
    }
    ${CheckboxFilters.fragments.cardCollectionConnection}
  `,
};
