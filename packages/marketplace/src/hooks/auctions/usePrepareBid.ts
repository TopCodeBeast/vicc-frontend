import { gql } from '@apollo/client';

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
      limitOrders {
        vaultIdSell
        vaultIdBuy
        amountSell
        amountBuy
        tokenSell
        tokenBuy
        nonce
        expirationTimestamp
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
`;

type PrepareBidArgs = {
  supportedCurrency: SupportedCurrency;
  tokenPaymentMethod: TokenPaymentMethod;
  bidAmountWei: string;
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

  const [prepareBidMutation, { loading }] = useMutation<
    PrepareBidMutation,
    PrepareBidMutationVariables
  >(PREPARE_BID_MUTATION);

  const { exchangeRate } = useConfigContext();

  const prepareBid = async ({
    supportedCurrency,
    tokenPaymentMethod,
    bidAmountWei,
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
          bidAmountWei,
          settlementInfo,
          amount,
          ...(conversionCreditId && { conversionCreditId }),
        },
      },
    });

    const authorizations = data?.prepareBid?.authorizations || [];

    const useAuthorizations = authorizations?.length > 0;

    const legacyLimitOrders = data?.prepareBid?.limitOrders;

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
    prepareBid,
    loading,
  };
};

export default usePrepareBid;
