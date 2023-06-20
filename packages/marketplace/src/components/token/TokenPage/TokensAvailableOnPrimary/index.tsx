import { useMemo } from 'react';
import { useHits } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Rarity, Sport } from '@sorare/core/src/__generated__/globalTypes';
import BlockHeader from '@sorare/core/src/atoms/layout/BlockHeader';
import { InstantBlockchainCardSearch } from '@sorare/core/src/components/search/InstantSearch';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { CardHit } from '@sorare/core/src/lib/algolia';

import { tokenPageMessages } from '@sorare/marketplace/src/components/token/TokenPage/tokenPageMessages';
import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';

import TokensRow from '../TokensRow';

const PageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
type TokenProps = {
  hitsPerRow: number;
  sport: Sport;
};
export const TokensAvailableOnPrimary = ({ hitsPerRow, sport }: TokenProps) => {
  const { hits } = useHits<CardHit>();

  const objectIds = useMemo(
    () => hits.map((h: any) => idFromObject(h.objectID) as string),
    [hits]
  );

  if (!hits.length) return null;

  return (
    <PageBlock>
      <BlockHeader
        title={
          <FormattedMessage {...tokenPageMessages.alsoAvailableOnPrimary} />
        }
      />
      <TokensRow
        hitsPerRow={hitsPerRow}
        {...(sport === Sport.FOOTBALL
          ? { slugs: objectIds }
          : { assetIds: objectIds })}
      />
    </PageBlock>
  );
};

type Props = {
  rarity: Rarity;
  playerSlug: string;
  sport: Sport;
  hitsPerRow: number;
};

export const AvailableOnPrimary = ({
  hitsPerRow = 3,
  rarity,
  playerSlug,
  sport,
}: Props) => {
  const filters = useDefaultFilters({
    primary: true,
    playerSlug,
    rarity,
    bundled: false,
  });

  return (
    <InstantBlockchainCardSearch
      indexes={['Ending Soon']}
      analyticsTags={['AvailableOnPrimary']}
      defaultHitsPerPage={hitsPerRow}
      sport={sport}
      defaultFilters={filters}
    >
      <TokensAvailableOnPrimary sport={sport} hitsPerRow={hitsPerRow} />
    </InstantBlockchainCardSearch>
  );
};

export default AvailableOnPrimary;
