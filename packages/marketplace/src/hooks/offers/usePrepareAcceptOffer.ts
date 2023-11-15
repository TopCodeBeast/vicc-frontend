import { TypedDocumentNode, gql } from '@apollo/client';

import {
  // StarkwareSignatureInput,
  SupportedCurrency,
  TokenPaymentMethod,
} from '@sorare/core/src/__generated__/globalTypes';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import { useGetAuthorizationApprovals } from '@marketplace/hooks/useGetAuthorizationApprovals';

import {
  PrepareAcceptOfferMutation,
  PrepareAcceptOfferMutationVariables,
} from './__generated__/usePrepareAcceptOffer.graphql';

const PREPARE_ACCEPT_OFFER_MUTATION = gql`
  mutation PrepareAcceptOfferMutation($input: prepareAcceptOfferInput!) {
    prepareAcceptOffer(input: $input) {
      limitOrders {
        # vaultIdSell
        # vaultIdBuy
        amountSell
        amountBuy
        tokenSell
        tokenBuy
        nonce
        expirationTimestamp
        feeInfo {
          tokenId
          # sourceVaultId
          feeLimit
        }
      }
      authorizations {
        ...useGetAuthorizationApprovals_authorizationRequest
      }
      errors {
        message
        code
      }
    }
  }
  ${useGetAuthorizationApprovals.fragments.authorizationRequest}
` as TypedDocumentNode<
  PrepareAcceptOfferMutation,
  PrepareAcceptOfferMutationVariables
>;

type StarkwareSignatureInput = any;

type PrepareAcceptOfferArgs = {
  offerId: string;
  supportedCurrency: SupportedCurrency;
  tokenPaymentMethod: TokenPaymentMethod;
  conversionCreditId?: string;
  savePaymentMethod?: boolean;
  walletChallengeSignature?: StarkwareSignatureInput | null;
};
type Props = {
  signAuthorizations: boolean;
};

const usePrepareAcceptOffer = ({ signAuthorizations }: Props) => {
  const getAuthorizationApprovals = useGetAuthorizationApprovals();

  const [prepareAcceptOfferMutation, { loading }] = useMutation(
    PREPARE_ACCEPT_OFFER_MUTATION
  );

  const { exchangeRate } = useConfigContext();

  const prepareAcceptOffer = async ({
    offerId,
    supportedCurrency,
    tokenPaymentMethod,
    conversionCreditId,
    savePaymentMethod,
    walletChallengeSignature,
  }: PrepareAcceptOfferArgs) => {
    const settlementInfo = {
      currency: supportedCurrency,
      exchangeRateId: idFromObject(exchangeRate.id),
      paymentMethod: tokenPaymentMethod,
      ...(conversionCreditId && { conversionCreditId }),
      savePaymentMethod,
      walletChallengeSignature,
    };

    const { data } = await prepareAcceptOfferMutation({
      variables: {
        input: {
          offerId,
          // settlementInfo,
        },
      },
    });

    const authorizations = data?.prepareAcceptOffer?.authorizations || [];

    const useAuthorizations = authorizations?.length > 0;

    const legacyLimitOrders = data?.prepareAcceptOffer?.limitOrders;

    const signedAuthorizations =
      (signAuthorizations &&
        (await getAuthorizationApprovals(authorizations))) ||
      undefined;

    return {
      settlementInfo,
      useAuthorizations,
      legacyLimitOrders,
      authorizations,
      approvals: signedAuthorizations?.authorizationApprovals,
    };
  };

  return {
    prepareAcceptOffer,
    loading,
  };
};

export default usePrepareAcceptOffer;
