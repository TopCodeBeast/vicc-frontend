import { TypedDocumentNode, gql } from '@apollo/client';

import {
  Nickname_usSportsUser,
} from './__generated__/queries.graphql';

export const US_SPORTS_USER_FRAGMENTS = {
  nickname: gql`
    fragment Nickname_usSportsUser on User {
      nickname
      suspended
      slug
    }
  ` as TypedDocumentNode<Nickname_usSportsUser>,
};
