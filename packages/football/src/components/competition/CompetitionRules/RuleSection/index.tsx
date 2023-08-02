import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';

import {
  RarityLimitRuleRow,
  Props as RarityLimitRuleRowProps,
} from '@football/components/competition/CompetitionRules/RarityLimitRuleRow';
import { RuleRow } from '@football/components/competition/CompetitionRules/RuleRow';
import { FormatRule } from '@football/components/so5/Rules/types';

import { RuleSection_so5Leaderboard } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--unit);
`;

const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  & > *:not(:last-child) {
    position: relative;
    & > *:after {
      content: '';
      height: 1px;
      background: var(--c-neutral-400);
      position: absolute;
      bottom: calc(-2 * var(--unit));
      left: 0;
      right: 0;
    }
  }
`;

type Props = {
  rules: FormatRule[];
  so5Leaderboard: RuleSection_so5Leaderboard;
};

const RARITY_LIMIT_PREFIX = 'rarityLimits_';
const RuleSection = ({ rules, so5Leaderboard }: Props) => {
  return (
    <Wrapper>
      {rules[0].title && (
        <Text16 color="var(--c-neutral-1000)" bold>
          <FormattedMessage {...rules[0].title} />
        </Text16>
      )}
      <RulesList>
        {rules?.map(item => {
          if (item.id.startsWith(RARITY_LIMIT_PREFIX)) {
            return (
              <RarityLimitRuleRow
                key={item.id}
                icon={item.icon}
                label={item.label}
                description={item.description}
                requirement={item.requirement}
                so5Leaderboard={so5Leaderboard}
                rarity={
                  item.id.slice(
                    RARITY_LIMIT_PREFIX.length
                  ) as RarityLimitRuleRowProps['rarity']
                }
              />
            );
          }
          if (item.label) {
            return (
              <RuleRow
                key={item.id}
                icon={item.icon}
                label={item.label}
                description={item.description}
                requirement={item.requirement}
              />
            );
          }
          if (item.defaultMessage) {
            return (
              <RuleRow
                key={item.id}
                label={
                  <FormattedMessage
                    {...item.defaultMessage}
                    values={{
                      ...item.values,
                      b: Bold,
                    }}
                  />
                }
              />
            );
          }
          return null;
        })}
      </RulesList>
    </Wrapper>
  );
};

RuleSection.fragments = {
  so5Leaderboard: gql`
    fragment RuleSection_so5Leaderboard on So5Leaderboard {
      slug
      ...RarityLimitRuleRow_so5Leaderboard
    }
    ${RarityLimitRuleRow.fragments.so5Leaderboard}
  ` as TypedDocumentNode<RuleSection_so5Leaderboard>,
};

export default RuleSection;
