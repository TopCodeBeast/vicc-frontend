import { gql } from '@apollo/client';
import { defineMessages } from 'react-intl';

import useTokenBelongsToUser from '@sorare/core/src/hooks/useTokenBelongsToUser';

import { useCannotBuy_token } from './__generated__/useCannotBuy.graphql';
import useCannotTrade from './useCannotTrade';
import useCannotTransfer from './useCannotTransfer';

const messages = defineMessages({
  doesBelongToYou: {
    id: 'useCannotSell.doesBelongToYou',
    defaultMessage: 'This Card belongs to you',
  },
});

const useCannotBuy = () => {
  const belongsToUser = useTokenBelongsToUser();
  const cannotTrade = useCannotTrade();
  const cannotTransfer = useCannotTransfer();

  return (token: useCannotBuy_token) => {
    if (cannotTrade()) return cannotTrade();
    if (cannotTransfer(token)) return cannotTransfer(token);
    if (belongsToUser(token)) return messages.doesBelongToYou;

    return null;
  };
};

useCannotBuy.fragments = {
  token: gql`
    fragment useCannotBuy_token on Token {
      assetId
      slug
      tradeableStatus
      ...useTokenBelongsToUser_token
    }
    ${useTokenBelongsToUser.fragments.token}
  `,
};

export default useCannotBuy;
