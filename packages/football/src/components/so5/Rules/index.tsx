import { TypedDocumentNode, gql } from '@apollo/client';
import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ElementType, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';

import { Errors } from '@football/components/so5/ComposeTeam/Context';
import { ELIGIBILITY_RULES } from '@football/lib/so5';

import { Rules_so5Leaderboard } from './__generated__/index.graphql';
import { formatRules } from './formatRules';
import { FormatRule } from './types';

type Rules_so5Leaderboard_displayedRules = NonNullable<
  Rules_so5Leaderboard['displayedRules']
>;

export type RuleLineProps = { content: ReactNode; idx: number };

const Rule = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--double-unit);
`;
const Status = styled.span`
  min-width: 20px;
  text-align: center;
  color: var(--c-green-600);
  margin-left: auto;
  &.error {
    color: var(--c-red-600);
  }
`;

type Props = {
  so5Leaderboard: Rules_so5Leaderboard;
  hideCompetitions?: boolean;
  displayStatus?: boolean;
  errors?: Errors;
  Line?: ElementType<{
    content: React.JSX.Element;
    rule: FormatRule;
  }>;
};

export const hasRules = (
  rules?: Rules_so5Leaderboard_displayedRules | null,
  excludeProps?: string[]
) => {
  if (!rules) {
    return false;
  }
  return Object.keys(rules)
    .filter(
      rule =>
        ![
          ...(excludeProps || []),
          ...ELIGIBILITY_RULES,
          '__typename',
          'id',
        ]?.includes(rule) && !(rule === 'captainRarities' && rules[rule])
    )
    .find(rule => {
      const r = rule as keyof Rules_so5Leaderboard_displayedRules;
      return Array.isArray(rules[r]) ? !!(rules[r] as [])?.length : !!rules[r];
    });
};

export const Rules = ({
  so5Leaderboard,
  hideCompetitions = false,
  errors = [],
  Line = ({ content, rule, ...props }) => <Text16 {...props}>{content}</Text16>,
}: Props) => {
  const intl = useIntl();
  const formattedRules = formatRules(so5Leaderboard, errors, intl);
  if (!formattedRules.length) return null;

  return (
    <>
      {formattedRules
        .filter(({ id }) => !(hideCompetitions && id === 'competitions'))
        .map(rule => {
          if (rule.defaultMessage) {
            return (
              <Line
                key={rule.id}
                rule={rule}
                content={
                  <Rule>
                    <span>
                      <FormattedMessage
                        {...rule.defaultMessage}
                        values={{
                          ...rule.values,
                          b: Bold,
                        }}
                      />
                    </span>
                    {!!errors?.length && (
                      <Status className={classnames({ error: !!rule.error })}>
                        {rule.error ? (
                          <FontAwesomeIcon icon={faTimes} />
                        ) : (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                      </Status>
                    )}
                  </Rule>
                }
              />
            );
          }
          return null;
        })}
    </>
  );
};

Rules.fragments = {
  so5Leaderboard: gql`
    fragment Rules_so5Leaderboard on So5Leaderboard {
      slug
      ...formatRules_so5Leaderboard
    }
    ${formatRules.fragments.so5Leaderboard}
  ` as TypedDocumentNode<Rules_so5Leaderboard>,
};

export default Rules;
