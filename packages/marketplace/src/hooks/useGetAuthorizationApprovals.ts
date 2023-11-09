import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';

import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { isType } from '@sorare/core/src/gql';

import { useGetAuthorizationApprovals_authorizationRequest } from './__generated__/useGetAuthorizationApprovals.graphql';

export const useGetAuthorizationApprovals = () => {
  const { approveAuthorizationRequests } = useWalletContext();

  return useCallback(
    async (
      authorizations: useGetAuthorizationApprovals_authorizationRequest[]
    ) => {
      const walletAuthorizationRequests = authorizations
        .map(({ fingerprint, request }) =>
          isType(request, 'StripeCreditCardAuthorizationRequest') ||
          isType(request, 'MangopayCreditCardAuthorizationRequest')
            ? null
            : {
                ...request,
                fingerprint,
              }
        )
        .filter(Boolean)
        .map(request =>
          isType(request, 'StarkexTransferAuthorizationRequest')
            ? { ...request, amount: request.weiAmount }
            : request
        );
      return approveAuthorizationRequests(walletAuthorizationRequests);
    },
    [approveAuthorizationRequests]
  );
};

useGetAuthorizationApprovals.fragments = {
  authorizationRequest: gql`
    fragment useGetAuthorizationApprovals_authorizationRequest on AuthorizationRequest {
      id
      fingerprint
      request {
        ... on StarkexLimitOrderAuthorizationRequest {
          # vaultIdSell
          # vaultIdBuy
          amountSell
          amountBuy
          tokenSell
          tokenBuy
          nonce
          expirationTimestamp
          feeInfo {
            feeLimit
            # sourceVaultId
            tokenId
          }
        }
        ... on StarkexTransferAuthorizationRequest {
          weiAmount: amount
          condition
          expirationTimestamp
          feeInfoUser {
            feeLimit
            # sourceVaultId
            tokenId
          }
          nonce
          receiverPublicKey
          # receiverVaultId
          # senderVaultId
          token
        }
        ... on MangopayWalletTransferAuthorizationRequest {
          nonce
          amount
          currency
          operationHash
          mangopayWalletId
        }
        ... on StripeCreditCardAuthorizationRequest {
          id
          clientSecret
          amount
          paymentMethod
        }
        ... on MangopayCreditCardAuthorizationRequest {
          id
        }
      }
    }
  ` as TypedDocumentNode<useGetAuthorizationApprovals_authorizationRequest>,
};
