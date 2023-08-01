import { gql } from '@apollo/client';

export const fragments = {
  so5UserGroup: gql`
    fragment so5UserGroup on Vicc5UserGroup {
      id
      slug
      displayName
      joinSecret
      logo {
        id
        pictureUrl
      }
    }
  `,
};
