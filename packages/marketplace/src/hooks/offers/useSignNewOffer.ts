import { gql } from '@apollo/client';

import { OfferType } from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { LimitOrder, useWalletContext } from '@sorare/core/src/contexts/wallet';
import useMutation, { Error } from '@sorare/core/src/hooks/graphql/useMutation';

import {
  NewOfferLimitOrdersMutation,
  NewOfferLimitOrdersMutationVariables,
} from './__generated__/useSignNewOffer.graphql';

const NEW_OFFER_LIMIT_ORDERS_MUTATION = gql`
  mutation NewOfferLimitOrdersMutation($input: prepareOfferInput!) {
    prepareOffer(input: $input) {
      limitOrders {
        vaultIdSell
        vaultIdBuy
        amountSell
        amountBuy
        tokenSell
        tokenBuy
        nonce
        expirationTimestamp
        feeInfo {
          sourceVaultId
          tokenId
          feeLimit
        }
      }
      errors {
        message
        code
      }
    }
  }
`;

type SignedLimitOrder = {
  nonce: number;
  expirationTimestamp: number;
  data: string;
  starkKey: string | undefined;
};

const NO_SIGNATURE = Symbol('No signature returned');

type SuccessfulResponse = {
  signedLimitOrders: SignedLimitOrder[];
  errors?: never;
};

type ErrorResponse = {
  signedLimitOrders: never[];
  errors: (Error | symbol)[];
};

export default () => {
  const { signLimitOrders } = useWalletContext();
  const [prepareOffer] = useMutation<
    NewOfferLimitOrdersMutation,
    NewOfferLimitOrdersMutationVariables
  >(NEW_OFFER_LIMIT_ORDERS_MUTATION, { showErrorsWithSnackNotification: true });
  const { showNotification } = useSnackNotificationContext();

  return async (
    type: OfferType,
    sendAssetIds: string[],
    receiveAssetIds: string[],
    sendWeiAmount: string,
    receiveWeiAmount: string,
    receiverSlug?: string
  ): Promise<SuccessfulResponse | ErrorResponse> => {
    const { data, success, errors } = await prepareOffer({
      variables: {
        input: {
          type,
          sendAssetIds,
          receiveAssetIds,
          sendWeiAmount,
          receiveWeiAmount,
          receiverSlug,
        },
      },
    });

    if (!success) return { errors, signedLimitOrders: [] };

    const limitOrders = data!.prepareOffer!.limitOrders!;

    const { signatures: starkSignatures, starkKey } = await signLimitOrders(
      limitOrders as LimitOrder[]
    );

    if (!starkSignatures) {
      showNotification('unlockWallet');
      return { errors: [NO_SIGNATURE], signedLimitOrders: [] };
    }

    return {
      signedLimitOrders: limitOrders.map((o, i) => ({
        nonce: o.nonce,
        expirationTimestamp: o.expirationTimestamp,
        data: starkSignatures[i],
        starkKey,
      })),
    };
  };
};
