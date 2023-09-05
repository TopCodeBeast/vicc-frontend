import { TypedDocumentNode, gql } from '@apollo/client';

import { vicc5UserGroup } from './__generated__/fragments.graphql';

export const fragments = {
  vicc5UserGroup: gql`
    fragment vicc5UserGroup on Vicc5UserGroup {
      id
      slug
      displayName
      joinSecret
      logo {
        id
        pictureUrl
      }
    }
  ` as TypedDocumentNode<vicc5UserGroup>,
};
