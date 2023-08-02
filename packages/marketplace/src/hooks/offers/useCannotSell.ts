import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages } from 'react-intl';

import useTokenBelongsToUser from '@sorare/core/src/hooks/useTokenBelongsToUser';

import { useCannotSell_token } from './__generated__/useCannotSell.graphql';
import useCannotTrade from './useCannotTrade';
import useCannotTransfer from './useCannotTransfer';

const messages = defineMessages({
  doesnotBelongToYou: {
    id: 'useCannotSell.doesnotBelongToYou',
    defaultMessage: 'This Card does not belong to you',
  },
});

const useCannotSell = () => {
  const belongsToUser = useTokenBelongsToUser();
  const cannotTrade = useCannotTrade();
  const cannotTransfer = useCannotTransfer();

  return (token: useCannotSell_token) => {
    if (cannotTrade()) return cannotTrade();
    if (cannotTransfer(token)) return cannotTransfer(token);
    if (!belongsToUser(token)) return messages.doesnotBelongToYou;

    return null;
  };
};

useCannotSell.fragments = {
  token: gql`
    fragment useCannotSell_token on Token {
      assetId
      slug
      tradeableStatus
      ...useTokenBelongsToUser_token
    }
    ${useTokenBelongsToUser.fragments.token}
  ` as TypedDocumentNode<useCannotSell_token>,
};

export default useCannotSell;
