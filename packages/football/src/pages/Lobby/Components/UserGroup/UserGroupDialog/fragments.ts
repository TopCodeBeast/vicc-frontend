import { gql } from '@apollo/client';

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
  `,
};
