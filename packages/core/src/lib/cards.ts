import { gql } from '@apollo/client';
import { isFuture, parseISO } from 'date-fns';
import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

import { OfferType, Sport } from '__generated__/globalTypes';

// import {
//   isListedOnMarket_card,
//   isSentInDirectOffer_card,
// } from './__generated__/cards.graphql';
import { sortBy } from './arrays';
import { Token } from './deal';
// import { withFragments } from './gql';
import { formatWord } from './humanize';

export const CARD_SIZE = 320;
export const CARD_ASPECT_RATIO = 50 / 81;
export const CARD_ASPECT_RATIO_SMALL = 16 / 17;

const cardWidth = 250;

export const getCardBorderRadiusWithOffsets = (
  cardBorderRadiusInPx = 24,
  offsetWidth = 0,
  offsetHeight = 0,
  aspectRatio = CARD_ASPECT_RATIO
) => {
  return `${(100 / (cardWidth + offsetWidth)) * cardBorderRadiusInPx}% /
  ${(100 / (cardWidth / aspectRatio + offsetHeight)) * cardBorderRadiusInPx}%`;
};

/* border radius in % to be able to scale - only valid for 2022+ cards */
export const CARD_BORDER_RADIUS = getCardBorderRadiusWithOffsets();

export interface TokenWithUser extends Token {
  owner: {
    user: {
      sorareAddress: string;
      slug: string;
    };
  };
}

export function isTokenWithUser(card: {
  __typename: 'Token';
}): card is TokenWithUser {
  return (card as TokenWithUser).owner?.user?.sorareAddress !== null;
}

export const blockchainRarities = [
  'custom_series',
  'limited',
  'rare',
  'super_rare',
  'unique',
] as const;

export const playableBlockchainRarities = [
  'limited',
  'rare',
  'super_rare',
  'unique',
] as const;

export const nonPlayableBlockchainRarities = ['custom_series'] as const;

export const rarities = ['common', ...blockchainRarities] as const;
export const usSportRarities = [
  'common',
  ...playableBlockchainRarities,
] as const;

export const subscribableRarities = blockchainRarities.filter(
  scarcity => scarcity !== 'limited'
);
export const usSportSubscribableRarities = ['super_rare', 'unique'];

export type BlockchainScarcity = (typeof blockchainRarities)[number];
export type Scarcity = (typeof rarities)[number];

export const blockchainCamelCaseScarcities = [
  'customSeries',
  'limited',
  'rare',
  'superRare',
  'unique',
] as const;
export const camelCaseScarcities = [
  'common',
  ...blockchainCamelCaseScarcities,
] as const;

export type BlockchainCamelCaseScarcity =
  (typeof blockchainCamelCaseScarcities)[number];
export type CamelCaseScarcity = (typeof camelCaseScarcities)[number];

export const scarcityNames: { [name: string]: string } = {
  common: 'Common',
  custom_series: 'Custom Series',
  limited: 'Limited',
  rare: 'Rare',
  super_rare: 'Super Rare',
  superRare: 'Super Rare',
  unique: 'Unique',
};

export const isBlockchainScarcity = (
  scarcity: Nullable<string>
): scarcity is BlockchainScarcity => {
  return blockchainRarities.includes(scarcity as BlockchainScarcity);
};

export const editionsByRarity: {
  [sport in Sport]: { [scarcity: string]: number };
} = {
  [Sport.FOOTBALL]: {
    unique: 1,
    super_rare: 10,
    rare: 100,
    limited: 1000,
    custom_series: 2022,
  },
  [Sport.BASEBALL]: {
    unique: 1,
    super_rare: 100,
    rare: 1000,
    limited: 5000,
  },
  [Sport.NBA]: {
    unique: 1,
    super_rare: 100,
    rare: 1000,
    limited: 5000,
  },
};

export const formatScarcity = (
  rarity: Scarcity | string,
  cardEdition?: string | null
) => {
  if (rarity === 'custom_series' && cardEdition) {
    return cardEdition;
  }
  return scarcityNames[rarity] || formatWord(rarity);
};

const nonEnumerableScarcities = ['unique', 'common'];

export const highestAvailableScarcity = (
  cardCounts: Partial<Record<CamelCaseScarcity, number>> | undefined,
  criteria: (cardCount: number | undefined) => boolean
): Scarcity | undefined => {
  if (cardCounts) {
    for (let i = rarities.length - 1; i >= 0; i -= 1) {
      if (criteria(cardCounts[camelCaseScarcities[i]])) {
        return rarities[i];
      }
    }
  }
  return undefined;
};

export const getEditionsByRarity = (sport?: Sport) =>
  (sport && editionsByRarity[sport]) || editionsByRarity[Sport.FOOTBALL];

export const getHumanReadableScarcity = (card: {
  rarity: string;
  serialNumber: number;
  sport?: Sport;
}) => {
  if (nonEnumerableScarcities.includes(card.rarity))
    return formatScarcity(card.rarity);

  return `${card.serialNumber}/${getEditionsByRarity(card.sport)[card.rarity]}`;
};

export const getHumanReadableSerialNumber = ({
  rarity,
  displayRarity,
  serialNumber,
  sport,
  separator = ' ',
}: {
  rarity: string;
  displayRarity?: string;
  serialNumber: number;
  sport?: Sport;
  separator?: string;
}) => {
  const formattedRarity = displayRarity || formatScarcity(rarity);

  if (nonEnumerableScarcities.includes(rarity)) {
    return formattedRarity;
  }

  return `${formattedRarity}${separator}${serialNumber}/${
    getEditionsByRarity(sport)[rarity]
  }`;
};

export const sortHitByLabel = (items: RefinementListItem[]) =>
  items.sort((a, b) => a.label.localeCompare(b.label));

export const sortHitByLabelReverse = (items: RefinementListItem[]) =>
  items.sort((a, b) => b.label.localeCompare(a.label));

export const sortHitByIsRefinedThenLabel = (items: RefinementListItem[]) => {
  const splittedItems = items.reduce<{
    refined: RefinementListItem[];
    notRefined: RefinementListItem[];
  }>(
    (r, o) => {
      r[o.isRefined ? 'refined' : 'notRefined'].push(o);
      return r;
    },
    { refined: [], notRefined: [] }
  );
  return [
    ...sortHitByLabel(splittedItems.refined),
    ...sortHitByLabel(splittedItems.notRefined),
  ];
};

export const sortHitByRarity = (items: RefinementListItem[]) =>
  sortBy(
    item => {
      return (rarities as unknown as string[]).indexOf(item.label);
    },
    [...items]
  );

interface XpCard {
  xp: number;
  xpNeededForNextGrade: number | null;
  xpNeededForCurrentGrade: number;
}

export const percentageToNextLevel = ({
  xp,
  xpNeededForCurrentGrade,
  xpNeededForNextGrade,
}: XpCard) =>
  xpNeededForNextGrade
    ? ((xp - xpNeededForCurrentGrade) /
        (xpNeededForNextGrade - xpNeededForCurrentGrade)) *
      100
    : 100;

export const LEVEL_MIN = 0;
export const LEVEL_MAX = 20;

export const APPEARANCES_MIN = 0;
export const APPEARANCES_5_MAX = 5;
export const APPEARANCES_15_MAX = 15;

// export const isListedOnMarket = withFragments(
//   (card: isListedOnMarket_card) => {
//     return !!card.token?.sentInLiveOffers?.some(
//       offer =>
//         offer.type === OfferType.SINGLE_SALE_OFFER &&
//         // handle case when token listing ended but frontend hasn't
//         // refetched the data yet
//         isFuture(parseISO(offer.endDate))
//     );
//   },
//   {
//     card: gql`
//       fragment isListedOnMarket_card on Card {
//         slug
//         assetId
//         token {
//           slug
//           assetId
//           sentInLiveOffers {
//             id
//             type
//             endDate
//           }
//         }
//       }
//     `,
//   }
// );

// export const isSentInDirectOffer = withFragments(
//   (card: isSentInDirectOffer_card) => {
//     return !!card.token?.sentInLiveOffers?.some(
//       offer =>
//         offer.type === OfferType.DIRECT_OFFER &&
//         // handle case when token listing ended but frontend hasn't
//         // refetched the data yet
//         isFuture(parseISO(offer.endDate))
//     );
//   },
//   {
//     card: gql`
//       fragment isSentInDirectOffer_card on Card {
//         slug
//         assetId
//         token {
//           slug
//           assetId
//           sentInLiveOffers {
//             id
//             type
//             endDate
//           }
//         }
//       }
//     `,
//   }
// );
