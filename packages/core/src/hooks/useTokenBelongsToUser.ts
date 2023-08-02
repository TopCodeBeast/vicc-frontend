import { TypedDocumentNode, gql } from '@apollo/client';

import { useCurrentUserContext } from '@core/contexts/currentUser';

import { useTokenBelongsToUser_token } from './__generated__/useTokenBelongsToUser.graphql';

const useTokenBelongsToUser = () => {
  const { currentUser } = useCurrentUserContext();

  return (token: useTokenBelongsToUser_token) => {
    return (
      currentUser &&
      token?.owner?.user &&
      token?.owner?.user.slug === currentUser.slug
    );
  };
};

useTokenBelongsToUser.fragments = {
  token: gql`
    fragment useTokenBelongsToUser_token on Token {
      slug
      assetId
      owner {
        id
        user {
          slug
        }
      }
    }
  ` as TypedDocumentNode<useTokenBelongsToUser_token>,
};

export default useTokenBelongsToUser;
