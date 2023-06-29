import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Bold from '@sorare/core/src/atoms/typography/Bold';

import { Errors } from '@football/components/so5/ComposeTeam/Context';
import { ELIGIBILITY_RULES } from '@football/lib/so5';
import { RuleRow } from '@football/pages/Lobby/CompetitionDetails/Details/CompetitionRules/RuleRow';

import EligibilityIcon from './EligibilityIcon';
import { Eligibilities_so5Leaderboard } from './__generated__/index.graphql';
import { formatEligibilityRules } from './formatEligibilityRules';

const Wrapper = styled.div`
  padding-top: var(--double-unit);
`;
type Eligibilities_so5Leaderboard_rules =
  Eligibilities_so5Leaderboard['displayedRules'];
const hasEligibilities = (
  rules?: Eligibilities_so5Leaderboard_rules | null,
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
          rule as keyof Eligibilities_so5Leaderboard_rules
        ) &&
        value !== null
      );
    })
  );
  return Object.keys(eligibilityRules).length === 0
    ? false
    : (eligibilityRules as Eligibilities_so5Leaderboard_rules);
};

type Props = {
  so5Leaderboard: Eligibilities_so5Leaderboard;
  errors?: Errors;
};

const Eligibilities = ({ so5Leaderboard, errors = [] }: Props) => {
  if (!hasEligibilities(so5Leaderboard.displayedRules)) {
    return null;
  }

  const formattedRules = formatEligibilityRules(
    so5Leaderboard.displayedRules,
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
  so5Leaderboard: gql`
    fragment Eligibilities_so5Leaderboard on So5Leaderboard {
      slug
      ...formatEligibilityRules_so5Leaderboard
    }
    ${formatEligibilityRules.fragments.so5Leaderboard}
  `,
};

export default Eligibilities;
