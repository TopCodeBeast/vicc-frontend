import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Bold from '@sorare/core/src/atoms/typography/Bold';

import { RuleRow } from '@football/components/competition/CompetitionRules/RuleRow';
import { Errors } from '@football/components/so5/ComposeTeam/Context';
import { ELIGIBILITY_RULES } from '@football/lib/so5';

import EligibilityIcon from './EligibilityIcon';
import { Eligibilities_vicc5Leaderboard } from './__generated__/index.graphql';
import { formatEligibilityRules } from './formatEligibilityRules';

const Wrapper = styled.div`
  padding-top: var(--double-unit);
`;
type Eligibilities_vicc5Leaderboard_rules =
  Eligibilities_vicc5Leaderboard['displayedRules'];
const hasEligibilities = (
  rules?: Eligibilities_vicc5Leaderboard_rules | null,
  excludeProps?: string[]
) => {
  if (!rules) {
    return false;
  }
  const eligibilityRules = Object.fromEntries(
    Object.entries(rules).filter(([rule, value]) => {
      return (
        ![...(excludeProps || []), '__typename', 'id']?.includes(rule) &&
        ELIGIBILITY_RULES?.includes(
          rule as keyof Eligibilities_vicc5Leaderboard_rules
        ) &&
        value !== null
      );
    })
  );
  return Object.keys(eligibilityRules).length === 0
    ? false
    : (eligibilityRules as Eligibilities_vicc5Leaderboard_rules);
};

type Props = {
  vicc5Leaderboard: Eligibilities_vicc5Leaderboard;
  errors?: Errors;
};

const Eligibilities = ({ vicc5Leaderboard, errors = [] }: Props) => {
  if (!hasEligibilities(vicc5Leaderboard.displayedRules)) {
    return null;
  }

  const formattedRules = formatEligibilityRules(
    vicc5Leaderboard.displayedRules,
    errors
  );
  return (
    <Wrapper>
      {formattedRules.map(rule => {
        if (rule?.defaultMessage) {
          return (
            <RuleRow
              key={rule.id}
              label={
                <FormattedMessage
                  {...rule.defaultMessage}
                  values={{
                    ...rule.values,
                    b: Bold,
                  }}
                />
              }
              icon={
                <EligibilityIcon
                  limit={rule.values?.numberCards}
                  scarcity={rule.scarcity || 'limited'}
                />
              }
            />
          );
        }
        return null;
      })}
    </Wrapper>
  );
};

Eligibilities.fragments = {
  vicc5Leaderboard: gql`
    fragment Eligibilities_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      ...formatEligibilityRules_vicc5Leaderboard
    }
    ${formatEligibilityRules.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<Eligibilities_vicc5Leaderboard>,
};

export default Eligibilities;
