import { gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

const defaultMessage = defineMessage({
  id: 'Rules.allowLegend',
  defaultMessage: 'Legend are not allowed',
});

// We only want to display an error if any. This rule is implicit
// and shouldn't be display all the time hence the undefined defaultMessage
const getAllowLegendRule = withFragments(
  (rule: boolean, error: string) => {
    return {
      id: 'allowLegend',
      defaultMessage: !rule && error ? defaultMessage : undefined,
      error,
    };
  },
  {
    rule: gql`
      fragment GetAllowLegendRule on So5Leaderboard {
        slug
        displayedRules {
          id
          allowLegend
        }
      }
    `,
  }
);

export default getAllowLegendRule;
