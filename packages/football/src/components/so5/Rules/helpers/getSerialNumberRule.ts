import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

const defaultMessage = defineMessage({
  id: 'Rules.serialNumber',
  defaultMessage: 'Card with a serial number <b>{value}</b>',
});

const getSerialNumberRule = withFragments(
  (rule: string | null, error: string) => {
    if (!rule) {
      return [];
    }
    return {
      id: 'serialNumber',
      defaultMessage,
      error,
      values: {
        value: rule,
      },
    };
  },
  {
    rule: gql`
      fragment GetSerialNumberRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          serialNumber
        }
      }
    `,
  }
);

export default getSerialNumberRule;
