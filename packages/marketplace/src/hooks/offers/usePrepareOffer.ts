import { gql } from '@apollo/client';

import {
  AmountInput,
  OfferType,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import useMutation, { Error } from '@sorare/core/src/hooks/graphql/useMutation';

// import { useGetAuthorizationApprovals } from '@marketplace/hooks/useGetAuthorizationApprovals';

import {
  PrepareOfferMutation,
  PrepareOfferMutationVariables,
} from './__generated__/usePrepareOffer.graphql';

type AuthorizationRequest = NonNullable<
  NonNullable<PrepareOfferMutation['prepareOffer']>['authorizations']
>[number];

const PREPARE_OFFER_MUTATION = gql`
  mutation PrepareOfferMutation($input: prepareOfferInput!) {
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
      #authorizations {
      #  ...useGetAuthorizationApprovals_authorizationRequest
      #}
      errors {
        message
        code
      }
    }
  }
  #{useGetAuthorizationApprovals.fragments.authorizationRequest}
`;

const NO_SIGNATURE = Symbol('No signature returned');

type PrepareOfferArgs = {
  type: OfferType;
  sendAssetIds: string[];
  receiveAssetIds: string[];
  sendWeiAmount: string;
  receiveWeiAmount: string;
  settlementCurrencies?: SupportedCurrency[];
  sendAmount?: AmountInput;
  receiveAmount?: AmountInput;
  receiverSlug?: string;
};

type PrepareOfferOutput = {
  errors?: (Error | symbol)[];
  authorizations: AuthorizationRequest[];
  useAuthorizations: boolean;
  legacySignedLimitOrders: any;
  approvals: any;
};

export default () => {
  const getAuthorizationApprovals = useGetAuthorizationApprovals();
  const { signLimitOrders } = useWalletContext();
  const [prepareOffer] = useMutation<
    PrepareOfferMutation,
    PrepareOfferMutationVariables
  >(PREPARE_OFFER_MUTATION, { showErrorsWithSnackNotification: true });
  const { showNotification } = useSnackNotificationContext();

  const errorOutput = {
    useAuthorizations: false,
    legacySignedLimitOrders: [],
    authorizations: [],
    approvals: [],
  };

  return async ({
    type,
    sendAssetIds,
    receiveAssetIds,
    sendWeiAmount,
    receiveWeiAmount,
    sendAmount,
    receiveAmount,
    receiverSlug,
    settlementCurrencies,
  }: PrepareOfferArgs): Promise<PrepareOfferOutput> => {
    const { data, success, errors } = await prepareOffer({
      variables: {
        input: {
          type,
          sendAssetIds,
          receiveAssetIds,
          sendWeiAmount,
          receiveWeiAmount,
          receiverSlug,
          sendAmount,
          receiveAmount,
          settlementCurrencies,
        },
      },
    });
    if (!success)
      return {
        errors,
        ...errorOutput,
      };

    const authorizations = data?.prepareOffer?.authorizations || [];

    const useAuthorizations = authorizations?.length > 0;

    const legacyLimitOrders = data?.prepareOffer?.limitOrders;

    const signedAuthorizations =
      (useAuthorizations &&
        (await getAuthorizationApprovals(authorizations))) ||
      undefined;

    const { signatures: legacyStarkSignatures, starkKey: legacyStarkKey } =
      await signLimitOrders(legacyLimitOrders!);

    if (!legacyStarkSignatures && !useAuthorizations) {
      showNotification('unlockWallet');
      return {
        errors: [NO_SIGNATURE],
        ...errorOutput,
      };
    }

    return {
      useAuthorizations,
      legacySignedLimitOrders: legacyLimitOrders?.map((o, i) => ({
        nonce: o.nonce,
        expirationTimestamp: o.expirationTimestamp,
        data: legacyStarkSignatures?.[i],
        starkKey: legacyStarkKey,
      })),
      authorizations,
      approvals: signedAuthorizations?.authorizationApprovals,
    };
  };
};
