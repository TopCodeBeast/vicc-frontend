import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { scarcityNames } from '@sorare/core/src/lib/cards';
import { withFragments } from '@sorare/core/src/lib/gql';
import { ScarcityType } from '@sorare/core/src/lib/scarcity';

import arrow from '@football/assets/lobby/arrow.png';
import Captain from '@football/components/so5/Captain';
import { RuleHelperFnReturnType } from '@football/components/so5/Rules/types';
import { getScoreModifiers } from '@football/lib/so5';

import { GetCaptainRule } from './__generated__/getCaptainRule.graphql';

type GetCaptainRule_engineConfiguration = GetCaptainRule['engineConfiguration'];

const messages = defineMessages({
  default: {
    id: 'CaptainRule.captainRarities',
    defaultMessage: `Captain: <b>{value, select, none {None} other {{value}}}</b>
        {score, select,
            noPoints {(Card scores 0 points)}
            less {(Card score decreased by {scoreModifier, number, percent})}
            more {(Card score increased by {scoreModifier, number, percent})}
            other {}
        }
    `,
  },
  title: {
    id: 'Rules.captain.title',
    defaultMessage: 'Captain',
  },
  description: {
    id: 'CaptainRule.captainRarities.description',
    defaultMessage: `{score, select,
            noPoints {Card scores 0 points}
            less {Card score decreased by {scoreModifier, number, percent}}
            more {Card score increased by {scoreModifier, number, percent}}
            other {}
        }`,
  },
  label: {
    id: 'Rules.captain.label',
    defaultMessage: '{rarity} captain',
  },
});

const IconWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const CaptainWrapper = styled.div`
  --size: 16px;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
`;

const Arrow = styled.div`
  position: absolute;
  bottom: -8px;
  right: -8px;
`;

const getCaptainRule = withFragments(
  (
    rule: string[] | null,
    error: string,
    engineConfiguration: GetCaptainRule_engineConfiguration | null
  ): RuleHelperFnReturnType => {
    const scarcities = rule?.map(scarcity =>
      scarcity.replace(/^./, (str: string) => str.toUpperCase())
    );

    const { score, scoreModifier } = getScoreModifiers(
      engineConfiguration?.captain || 0
    );

    const needCaptain = scarcities && scarcities?.length > 0;
    if (!needCaptain) {
      return [];
    }
    return {
      id: 'captainRarities',
      defaultMessage: messages.default,
      error,
      values: {
        value: scarcities
          .map(scarcity => scarcityNames[scarcity.toLowerCase()])
          .join(', '),
        score,
        scoreModifier,
      },
      title: messages.title,
      icon: (
        <IconWrapper>
          <ScarcityIcon
            scarcity={
              (scarcities?.[0]?.toLowerCase() as ScarcityType) || 'common'
            }
            size="lg"
          />
          <CaptainWrapper>
            <Captain active />
          </CaptainWrapper>
          <Arrow>
            <img src={arrow} width={16} height={16} alt="Up" />
          </Arrow>
        </IconWrapper>
      ),
      label: (
        <FormattedMessage
          {...messages.label}
          values={{
            rarity: scarcityNames[scarcities?.[0].toLowerCase()],
          }}
        />
      ),
      description: (
        <FormattedMessage
          {...messages.description}
          values={{
            score,
            scoreModifier,
          }}
        />
      ),
    };
  },
  {
    rule: gql`
      fragment GetCaptainRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          captainRarities
        }
        engineConfiguration {
          captain
        }
      }
    ` as TypedDocumentNode<GetCaptainRule>,
  }
);

export default getCaptainRule;
