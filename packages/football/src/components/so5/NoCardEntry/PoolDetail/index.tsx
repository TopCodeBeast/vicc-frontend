import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { PoolDetail_noCardRoute } from './__generated__/index.graphql';

type Props = {
  noCardRoute: Nullable<PoolDetail_noCardRoute>;
};

const PoolDetail = ({ noCardRoute }: Props) => {
  const { cardCountsByRarity } = noCardRoute || {};
  return (
    <FormattedMessage
      id="Lobby.CompetitionList.NoCardEntry.actualPoolDetail"
      defaultMessage="For this Game Week the pool of players available is composed of {limitedCount} Limited Cards, {rareCount} Rare Cards, {superRareCount} Super Rare Cards, {uniqueCount} Unique Cards."
      values={{
        limitedCount: cardCountsByRarity?.limited || 0,
        rareCount: cardCountsByRarity?.rare || 0,
        superRareCount: cardCountsByRarity?.superRare || 0,
        uniqueCount: cardCountsByRarity?.unique || 0,
      }}
    />
  );
};

PoolDetail.fragments = {
  noCardRoute: gql`
    fragment PoolDetail_noCardRoute on NoCardRoute {
      id
      cardCountsByRarity {
        limited
        rare
        superRare
        unique
      }
    }
  ` as TypedDocumentNode<PoolDetail_noCardRoute>,
};

export default PoolDetail;
