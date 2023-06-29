import { gql } from '@apollo/client';
import { defineMessage, useIntl } from 'react-intl';

import { isBlockchainScarcity } from '@sorare/core/src/lib/cards';
import { glossary } from '@sorare/core/src/lib/glossary';
import { withFragments } from '@sorare/core/src/lib/gql';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import { GetCardsCountOfCurrentUserRule } from './__generated__/getCardsCountOfCurrentUserRule.graphql';

type GetCardsCountOfCurrentUserRule_rules_cardsCountOfCurrentUser = NonNullable<
  NonNullable<
    GetCardsCountOfCurrentUserRule['displayedRules']
  >['cardsCountOfCurrentUser']
>;

const scarcityMessage = defineMessage({
  id: 'Rules.cardsCountOfCurrentUser.scarcity',
  defaultMessage: 'Limited, Rare, Super Rare and Unique',
});

const defaultMessage = defineMessage({
  id: 'Rules.cardsCountOfCurrentUser',
  defaultMessage:
    'You must have less than <b>{numberCards}</b> <b>{scarcity}</b> {numberCards, plural, one {card} other {cards}} to register',
});

const getCardsCountOfCurrentUserRule = withFragments(
  (
    rule: GetCardsCountOfCurrentUserRule_rules_cardsCountOfCurrentUser | null,
    error: string
  ) => {
    if (!rule) {
      return [];
    }
    const { formatMessage } = useIntl();
    const getScarcityLabel = () => {
      if (rule.scarcity === 'blockchain') {
        return formatMessage(scarcityMessage);
      }
      if (isBlockchainScarcity(rule.scarcity)) {
        return formatMessage(scarcityMessages[rule.scarcity]);
      }
      return formatMessage(glossary.cards);
    };
    return {
      id: 'cardsCountOfCurrentUser',
      defaultMessage,
      error,
      values: {
        numberCards: rule.maximumCards,
        scarcity: getScarcityLabel(),
      },
      scarcity: isBlockchainScarcity(rule.scarcity) ? rule.scarcity : undefined,
    };
  },
  {
    rule: gql`
      fragment GetCardsCountOfCurrentUserRule on So5Leaderboard {
        slug
        displayedRules {
          id
          cardsCountOfCurrentUser {
            maximumCards
            scarcity
          }
        }
      }
    `,
  }
);

export default getCardsCountOfCurrentUserRule;
