import { gql } from '@apollo/client';

import {
  SupportedCurrency,
  TokenPaymentMethod,
} from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { errorWrapper } from '@sorare/core/src/errors';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';

import {
  BidWithWalletMutation,
  BidWithWalletMutationVariables,
  useBidWithWallet_auction,
} from './__generated__/useBidWithWallet.graphql';
import usePrepareBid from './usePrepareBid';

const BID_WITH_WALLET_MUTATION = gql`
  mutation BidWithWalletMutation($input: bidInput!) {
    bid(input: $input) {
      tokenBid {
        id
        amount
        amountInFiat {
          eur
          gbp
          usd
        }
        auction {
          id
          currentPrice
          privateCurrentPrice
          bidsCount
          endDate
          minNextBid
          privateMinNextBid
          currency
          bestBid {
            id
            bidder {
              ... on User {
                slug
              }
            }
          }
          myLastBid {
            id
          }
          myBestBid {
            id
            fiatPayment
            maximumAmount
            maximumAmounts {
              eur
              gbp
              referenceCurrency
              usd
              wei
            }
          }
        }
      }
      currentUser {
        slug
        onboardingStatus {
          id
          tasks {
            id
            state
          }
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

type BidWithWalletArgs = {
  supportedCurrency: SupportedCurrency;
  bidAmountWei: string;
  amount: string;
  conversionCreditId?: string;
};

const useBidWithWallet = (auction: useBidWithWallet_auction) => {
  const [bid] = useMutation<
    BidWithWalletMutation,
    BidWithWalletMutationVariables
  >(BID_WITH_WALLET_MUTATION);

  const { showNotification } = useSnackNotificationContext();
  const { signLimitOrders } = useWalletContext();
  const createEthMigration = useCreateEthMigration();

  const { prepareBid } = usePrepareBid({ signAuthorizations: true });

  const prepareAndBid = async ({
    supportedCurrency,
    bidAmountWei,
    conversionCreditId,
    amount,
  }: BidWithWalletArgs) => {
    const { settlementInfo, useAuthorizations, legacyLimitOrders, approvals } =
      await prepareBid({
        supportedCurrency,
        tokenPaymentMethod: TokenPaymentMethod.WALLET,
        englishAuctionId: auction.blockchainId,
        bidAmountWei,
        amount,
        conversionCreditId,
      });

    if (!legacyLimitOrders && !useAuthorizations) return null;

    const { signatures: legacyStarkSignatures, starkKey: legacyStarkKey } =
      await signLimitOrders(legacyLimitOrders!);

    if (!legacyStarkSignatures && !useAuthorizations) {
      showNotification('unlockWallet');
      throw new Error('Missing password');
    }

    if (!approvals && useAuthorizations) {
      showNotification('unlockWallet');
      throw new Error('Missing password');
    }

    await createEthMigration();

    const { data: dataBid } = await bid({
      variables: {
        input: {
          auctionId: auction.id,
          amount:
            supportedCurrency === SupportedCurrency.WEI ? bidAmountWei : amount,
          starkSignatures: legacyLimitOrders!.map((a, i) => ({
            nonce: a.nonce,
            expirationTimestamp: a.expirationTimestamp,
            data: legacyStarkSignatures?.[i] || '',
            starkKey: legacyStarkKey,
          })),
          conversionCreditId,
          ...(useAuthorizations && { settlementInfo }),
          ...(useAuthorizations && approvals && { approvals }),
        },
      },
    });

    return dataBid?.bid?.tokenBid;
  };

  return async (args: BidWithWalletArgs) => {
    const { result, error } = await errorWrapper(prepareAndBid)(args);
    if (error) return [{ message: `${error.name} - ${error.message}` }];
    return result;
  };
};

useBidWithWallet.fragments = {
  auction: gql`
    fragment useBidWithWallet_auction on TokenAuction {
      id
      blockchainId
    }
  `,
};

export default useBidWithWallet;
