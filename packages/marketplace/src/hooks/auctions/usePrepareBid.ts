import { TypedDocumentNode, gql } from '@apollo/client';

import {
  StarkwareSignatureInput,
  SupportedCurrency,
  TokenPaymentMethod,
} from '@sorare/core/src/__generated__/globalTypes';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import { useGetAuthorizationApprovals } from '@marketplace/hooks/useGetAuthorizationApprovals';

import {
  PrepareBidMutation,
  PrepareBidMutationVariables,
} from './__generated__/usePrepareBid.graphql';

export type AuthorizationRequest = NonNullable<
  NonNullable<PrepareBidMutation['prepareBid']>['authorizations']
>[number];

const PREPARE_BID_MUTATION = gql`
  mutation PrepareBidMutation($input: prepareBidInput!) {
    prepareBid(input: $input) {
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
` as TypedDocumentNode<PrepareBidMutation, PrepareBidMutationVariables>;

type PrepareBidArgs = {
  supportedCurrency: SupportedCurrency;
  tokenPaymentMethod: TokenPaymentMethod;
  englishAuctionId: string;
  amount: string;
  conversionCreditId?: string;
  savePaymentMethod?: boolean;
  walletChallengeSignature?: StarkwareSignatureInput | null;
};
type Props = {
  signAuthorizations: boolean;
};

const usePrepareBid = ({ signAuthorizations }: Props) => {
  const getAuthorizationApprovals = useGetAuthorizationApprovals();

  const [prepareBidMutation, { loading }] = useMutation(PREPARE_BID_MUTATION);

  const { exchangeRate } = useConfigContext();

  const prepareBid = async ({
    supportedCurrency,
    tokenPaymentMethod,
    englishAuctionId,
    amount,
    conversionCreditId,
    savePaymentMethod,
    walletChallengeSignature,
  }: PrepareBidArgs) => {
    const settlementInfo = {
      currency: supportedCurrency,
      exchangeRateId: idFromObject(exchangeRate.id),
      paymentMethod: tokenPaymentMethod,
      ...(conversionCreditId && { conversionCreditId }),
      savePaymentMethod,
      walletChallengeSignature,
    };

    const { data } = await prepareBidMutation({
      variables: {
        input: {
          englishAuctionId,
          settlementInfo,
          amount,
        },
      },
    });

    const authorizations = data?.prepareBid?.authorizations || [];

    const signedAuthorizations =
      (signAuthorizations &&
        (await getAuthorizationApprovals(authorizations))) ||
      undefined;

    return {
      settlementInfo,
      authorizations,
      approvals: signedAuthorizations?.authorizationApprovals,
    };
  };

  return {
    prepareBid,
    loading,
  };
};

export default usePrepareBid;
