import { TypedDocumentNode, gql } from '@apollo/client';

import { so5UserGroup } from './__generated__/fragments.graphql';

export const fragments = {
  so5UserGroup: gql`
    fragment so5UserGroup on So5UserGroup {
      id
      slug
      displayName
      joinSecret
      logo {
        id
        pictureUrl
      }
    }
  ` as TypedDocumentNode<so5UserGroup>,
};
