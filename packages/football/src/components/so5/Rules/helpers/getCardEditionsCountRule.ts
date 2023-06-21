import { gql } from '@apollo/client';
import { defineMessages } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetCardEditionsCountRule } from './__generated__/getCardEditionsCountRule.graphql';

type GetCardEditionsCountRule_displayedRules_cardEditionsCount = NonNullable<
  NonNullable<GetCardEditionsCountRule['displayedRules']>['cardEditionsCount']
>;

const { globalRule, exactlyRule, none } = defineMessages({
  globalRule: {
    id: 'Rules.cardEditionsCountRule.global',
    defaultMessage:
      '<b>{min, select, 0 { At most {max} } other { At least {min}{max, select, null {} other { and at most {max} } }}} {cardEditions}</b> {max_min_max, plural, one {card} other {cards}}',
  },
  exactlyRule: {
    id: 'Rules.cardEditionsCountRule.exactly',
    defaultMessage:
      'Exactly <b>{value} {cardEditions} {value, plural, one {card} other {cards}}</b>',
  },
  none: {
    id: 'Rules.cardEditionsCountRule.no',
    defaultMessage: 'No <b>{cardEditions}</b> Card',
  },
});

const join = (arr: any[], prop: string) =>
  [...new Set(arr.map(item => item[prop]))].join(', ');

const getCardEditionsCountRule = withFragments(
  (
    rule: GetCardEditionsCountRule_displayedRules_cardEditionsCount | null,
    error: string
  ) => {
    if (!rule) {
      return [];
    }
    const { min: globalMin, max: globalMax, editions } = rule || {};
    const cardEditionsCount = [];
    const id = JSON.stringify(rule);
    if (editions?.length) {
      if (globalMax === 0) {
        cardEditionsCount.push({
          id,
          messageId: none,
          error,
          values: {
            cardEditions: join(editions, 'displayName'),
          },
        });
      } else {
        const allowedEditions = editions.filter(
          ({ max }) => max === null || max > 0
        );
        if (allowedEditions.length) {
          if (globalMin !== null || globalMax !== null) {
            cardEditionsCount.push({
              id,
              defaultMessage:
                globalMin === globalMax ? exactlyRule : globalRule,
              error,
              values: {
                value: globalMin,
                cardEditions: join(allowedEditions, 'displayName'),
                min: globalMin || 0,
                max: globalMax,
                max_min_max: Math.max(globalMin || 0, globalMax || 0),
              },
            });
          }
          allowedEditions.forEach(({ min, max, displayName }) => {
            if (min !== null || max !== null) {
              cardEditionsCount.push({
                id,
                defaultMessage: min === max ? exactlyRule : globalRule,
                error,
                values: {
                  value: min,
                  min: min || 0,
                  max,
                  cardEditions: displayName,
                  max_min_max: Math.max(min || 0, max || 0),
                },
              });
            }
          });
        }
        const forbiddenEditions = editions.filter(
          ({ max }) => max !== null && max === 0
        );
        if (forbiddenEditions.length) {
          cardEditionsCount.push({
            id,
            messageId: 'cardEditionsCount_none',
            error,
            values: {
              cardEditions: join(forbiddenEditions, 'displayName'),
            },
          });
        }
      }
    }
    return cardEditionsCount;
  },
  {
    rule: gql`
      fragment GetCardEditionsCountRule on So5Leaderboard {
        slug
        displayedRules {
          id
          cardEditionsCount {
            min
            max
            editions {
              min
              max
              name
              displayName
            }
          }
        }
      }
    `,
  }
);

export default getCardEditionsCountRule;
