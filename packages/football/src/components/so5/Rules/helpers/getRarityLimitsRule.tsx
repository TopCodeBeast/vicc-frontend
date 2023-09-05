import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { CamelCaseScarcity, scarcityNames } from '@sorare/core/src/lib/cards';
import { withFragments } from '@sorare/core/src/lib/gql';
import toSnakeCase from '@sorare/core/src/lib/toSnakeCase';

import arrow from '@football/assets/lobby/arrow.png';
import { RuleHelperFnReturnType } from '@football/components/so5/Rules/types';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  EngineConfiguration,
  ScoreModifier,
  getEngineConfigurationScarcities,
  getScoreModifiers,
} from '@football/lib/so5';

import { GetRarityLimitsRule } from './__generated__/getRarityLimitsRule.graphql';

type GetRarityLimitsRule_displayedRules_rarityLimits = NonNullable<
  NonNullable<GetRarityLimitsRule['displayedRules']>['rarityLimits']
>;

type GetRarityLimitsRule_engineConfiguration =
  GetRarityLimitsRule['engineConfiguration'];

const messages = defineMessages({
  default: {
    id: 'Rules.rarityLimits',
    defaultMessage: `{display, select,
        isOnly {<b>{rarity}</b> only}
        isAny {Any number of <b>{rarity}</b>}
        isExact {{max} <b>{rarity}</b>}
        isMax {Maximum {max} <b>{rarity}</b>}
        isMin {Minimum {min} <b>{rarity}</b>}
        other {Between {min} and {max} <b>{rarity}</b>}
    }{score, select,
        noPoints { Card scores 0 points)}
        less { (Card score decreased by {scoreModifier, number, percent})}
        more { (Card score increased by {scoreModifier, number, percent})}
        other {}
    }`,
  },
  title: {
    id: 'Rules.rarityLimits.title',
    defaultMessage: 'Card Requirements',
  },
  min: {
    id: 'Rules.rarityLimits.min',
    defaultMessage: 'Min {value}',
  },
  max: {
    id: 'Rules.rarityLimits.max',
    defaultMessage: 'Max {value}',
  },
  exact: {
    id: 'Rules.rarityLimits.exactRequirement',
    defaultMessage: '{value, plural, one {# required} other {# required}}',
  },
  card: {
    id: 'Rules.rarityLimits.card',
    defaultMessage: '{scarcity} Card',
  },
  description: {
    id: 'Rules.rarityLimits.description',
    defaultMessage: `{score, select,
      noPoints { Card scores 0 points}
      less { Card score decreased by {scoreModifier, number, percent}}
      more { Card score increased by {scoreModifier, number, percent}}
      other {}
    }`,
  },
});

const IconWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const Arrow = styled.div`
  position: absolute;
  bottom: calc(-1 * var(--unit));
  right: calc(-1 * var(--unit));
`;

const getRarityLimitsRule = withFragments(
  (
    rule: GetRarityLimitsRule_displayedRules_rarityLimits | null,
    error: string,
    engineConfiguration: GetRarityLimitsRule_engineConfiguration | null
  ): RuleHelperFnReturnType => {
    const limits = Object.entries(rule || {})
      .filter<
        [string, { __typename: 'ValueBoundaries'; min: number; max: number }]
      >(
        (
          entry
        ): entry is [
          string,
          { __typename: 'ValueBoundaries'; min: number; max: number }
        ] => entry[0] !== '__typename'
      )
      .filter(entry => entry[1].max > 0);
    return limits.map(limit => {
      const rarity = limit[0] as CamelCaseScarcity;
      const boundaries = limit[1];
      const { min, max } = boundaries;

      let requirement;
      let display = '';
      if (limits.length === 1) {
        display = 'isOnly';
        requirement = (
          <FormattedMessage
            {...messages.exact}
            values={{
              value: max,
            }}
          />
        );
      } else if (min === 0 && max === 5) {
        display = 'isAny';
        requirement = (
          <FormattedMessage
            {...messages.max}
            values={{
              value: max,
            }}
          />
        );
      } else if (min === max) {
        display = 'isExact';
        requirement = (
          <FormattedMessage
            {...messages.exact}
            values={{
              value: min,
            }}
          />
        );
      } else if (min === 0) {
        display = 'isMax';
        requirement = (
          <FormattedMessage
            {...messages.max}
            values={{
              value: max,
            }}
          />
        );
      } else if (max === 5) {
        display = 'isMin';
        requirement = (
          <FormattedMessage
            {...messages.min}
            values={{
              value: min,
            }}
          />
        );
      }

      const scarcities = getEngineConfigurationScarcities(
        engineConfiguration?.scarcity as EngineConfiguration['scarcity']
      );
      const { score, scoreModifier } = getScoreModifiers(scarcities[rarity]);

      return {
        id: `rarityLimits_${rarity}`,
        defaultMessage: messages.default,
        error,
        values: {
          display,
          min,
          max,
          rarity: scarcityNames[rarity],
          score,
          scoreModifier: Math.abs(scoreModifier),
        },
        title: messages.title,
        icon: (
          <IconWrapper>
            <ScarcityIcon scarcity={toSnakeCase(rarity) as any} size="lg" />
            {score === ScoreModifier.More ? (
              <Arrow>
                <img src={arrow} width={16} height={16} alt="Up" />
              </Arrow>
            ) : null}
          </IconWrapper>
        ),
        label: (
          <FormattedMessage
            {...messages.card}
            values={{
              scarcity: scarcityNames[rarity],
            }}
          />
        ),
        requirement,
        description: (
          <FormattedMessage
            {...messages.description}
            values={{
              score,
              scoreModifier: Math.abs(scoreModifier),
            }}
          />
        ),
      };
    });
  },
  {
    rule: gql`
      fragment GetRarityLimitsRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          rarityLimits {
            common {
              min
              max
            }
            limited {
              min
              max
            }
            rare {
              min
              max
            }
            superRare {
              min
              max
            }
            unique {
              min
              max
            }
          }
        }
        engineConfiguration {
          scarcity
        }
      }
    ` as TypedDocumentNode<GetRarityLimitsRule>,
  }
);

export default getRarityLimitsRule;
