import { gql } from '@apollo/client';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { getMissingCards_validity } from './__generated__/getMissingCards.graphql';

export const getMissingCards = withFragments(
  (validity: getMissingCards_validity) => {
    const {
      missingCards,
      missingAnyRarities,
      common,
      limited,
      rare,
      super_rare,
      unique,
    } = validity;

    /*  
        There are 2 types of missing cards: either those cards have to be of a specific rarity, or they can be of several rarities.
        The ones that have to be of a specific rarity are in the missingPerRarity field.
        The rarities of the other ones are in the missingAnyRarities field.
        The number of the other ones is the total number of missing cards minus the number of cards that have to be of a specific rarity.
        To simplify the message to the user, when a card can be of several rarities we suggest buying the lowest rarity.
    */
    const missingWithNoChoiceOnRarity = {
      common,
      limited,
      rare,
      super_rare,
      unique,
    };
    const numberWithNoChoiceOnRarity = Object.values(
      missingWithNoChoiceOnRarity
    ).reduce((sum, current) => sum + current, 0);
    const numberWithChoiceOnRarity = missingCards - numberWithNoChoiceOnRarity;
    const orderedRarities = [
      'common',
      'limited',
      'rare',
      'super_rare',
      'unique',
    ] as const;
    const lowestRarityWithChoice = orderedRarities.find(rarity =>
      missingAnyRarities.includes(rarity as Rarity)
    );

    const globalMissing = { ...missingWithNoChoiceOnRarity };

    if (lowestRarityWithChoice) {
      globalMissing[lowestRarityWithChoice] += numberWithChoiceOnRarity;
    }

    return globalMissing;
  },
  {
    validity: gql`
      fragment getMissingCards_validity on Validity {
        notEnoughEligibleCards
        missingCards
        missingAnyRarities
        common: missingRarity(rarity: common)
        limited: missingRarity(rarity: limited)
        rare: missingRarity(rarity: rare)
        super_rare: missingRarity(rarity: super_rare)
        unique: missingRarity(rarity: unique)
      }
    `,
  }
);
