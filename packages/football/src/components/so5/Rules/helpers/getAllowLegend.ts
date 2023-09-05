import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessage } from 'react-intl';

import { withFragments } from '@sorare/core/src/lib/gql';

import { GetAllowLegendRule } from './__generated__/getAllowLegend.graphql';

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
      fragment GetAllowLegendRule on Vicc5Leaderboard {
        slug
        displayedRules {
          id
          allowLegend
        }
      }
    ` as TypedDocumentNode<GetAllowLegendRule>,
  }
);

export default getAllowLegendRule;
