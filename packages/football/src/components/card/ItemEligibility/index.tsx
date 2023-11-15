import { TypedDocumentNode, gql } from '@apollo/client';

import { CardCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';

import Vicc5Eligibility from '@football/components/so5/CardProperties/So5Eligibility';
import { messages } from '@football/lib/cardCoverage';

import {
  ItemEligibility_auction,
  ItemEligibility_card,
} from './__generated__/index.graphql';

type Props = {
  cards: ItemEligibility_card[];
};

export const ItemEligibility = ({ cards }: Props) => {
  const bundle = cards.length > 1;
  const coverageStatuses = new Set(cards.map(c => c.coverageStatus));

  if (coverageStatuses.has(CardCoverageStatus.NOT_ELIGIBLE)) {
    return <Vicc5Eligibility description={messages.notEligible} />;
  }

  if (coverageStatuses.has(CardCoverageStatus.LEGEND)) {
    return <Vicc5Eligibility partial description={messages.legend} />;
  }

  if (coverageStatuses.has(CardCoverageStatus.PARTIAL)) {
    return (
      <Vicc5Eligibility
        partial
        description={bundle ? messages.partialBundle : messages.partial}
      />
    );
  }

  if (coverageStatuses.has(CardCoverageStatus.SPECIAL)) {
    return <Vicc5Eligibility description={messages.collectible} />;
  }

  if (coverageStatuses.has(CardCoverageStatus.NOT_COVERED)) {
    return (
      <Vicc5Eligibility
        description={bundle ? messages.notCoveredBundle : messages.notCovered}
      />
    );
  }

  return null;
};

const cardFragment = gql`
  fragment ItemEligibility_card on Card {
    slug
    assetId
    coverageStatus
  }
` as TypedDocumentNode<ItemEligibility_card>;

ItemEligibility.fragments = {
  card: cardFragment,
  auction: gql`
    fragment ItemEligibility_auction on AuctionInterface {
      slug
      cards {
        slug
        assetId
        ...ItemEligibility_card
      }
    }
    ${cardFragment}
  ` as TypedDocumentNode<ItemEligibility_auction>,
};

export default ItemEligibility;
