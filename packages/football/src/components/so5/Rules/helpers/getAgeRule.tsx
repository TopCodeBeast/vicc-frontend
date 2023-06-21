import { gql } from '@apollo/client';
import { FormattedMessage, IntlShape, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { withFragments } from '@sorare/core/src/lib/gql';

import U23EligibleIcon from '@football/components/so5/CardProperties/U23EligibleIcon';

import { GetAgeRule } from './__generated__/getAgeRule.graphql';

type GetAgeRule_displayedRules_age = NonNullable<
  NonNullable<GetAgeRule['displayedRules']>['age']
>;

const messages = defineMessages({
  default: {
    id: 'Rules.age',
    defaultMessage:
      '{min, select, null {{max, select, null {} other {Maximum age: {max}} }} other {Minimum age: {min}{max, select, null {} other{, maximum: {max}}}}}, as of {cutOffDate}',
  },
  label: {
    id: 'Rules.age.label',
    defaultMessage:
      '{min, select, null {{max, select, null {} other {Maximum age of {max}} }} other {Minimum age of {min}{max, select, null {} other{, maximum: {max}}}}}',
  },
  description: {
    id: 'Rules.age.description',
    defaultMessage: 'as of {cutOffDate}',
  },
});

const IconWrapper = styled.span`
  & > * {
    width: 28px;
    height: 28px;
  }
`;

const getAgeRule = withFragments(
  (
    rule: GetAgeRule_displayedRules_age | null,
    error: string,
    intl: IntlShape
  ) => {
    if (!rule) {
      return [];
    }

    const minMaxValues = {
      min: rule?.min,
      max: rule?.max,
    };
    const cutOffDate = intl.formatDate(new Date(rule?.cutOffDate || ''), {
      dateStyle: 'long',
    });
    return {
      id: 'age',
      defaultMessage: messages.default,
      error,
      values: {
        ...minMaxValues,
        cutOffDate,
      },
      icon: (
        <IconWrapper>
          <U23EligibleIcon />
        </IconWrapper>
      ),
      label: <FormattedMessage {...messages.label} values={minMaxValues} />,
      description: (
        <FormattedMessage
          {...messages.description}
          values={{
            cutOffDate,
          }}
        />
      ),
    };
  },
  {
    rule: gql`
      fragment GetAgeRule on So5Leaderboard {
        slug
        displayedRules {
          id
          age {
            min
            max
            cutOffDate
          }
        }
      }
    `,
  }
);

export default getAgeRule;
