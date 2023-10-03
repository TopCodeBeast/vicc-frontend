import { TypedDocumentNode, gql } from '@apollo/client';

import {
  SupportedCurrency,
  TokenPaymentMethod,
} from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { errorWrapper } from '@sorare/core/src/errors';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

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
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
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
            amounts {
              ...MonetaryAmountFragment_monetaryAmount
            }
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
            maximumAmounts {
              ...MonetaryAmountFragment_monetaryAmount
            }
            conversionCredit {
              id
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
  ${monetaryAmountFragment}
` as TypedDocumentNode<BidWithWalletMutation, BidWithWalletMutationVariables>;

type BidWithWalletArgs = {
  supportedCurrency: SupportedCurrency;
  bidAmountWei: string;
  amount: string;
  conversionCreditId?: string;
};

const useBidWithWallet = (auction: useBidWithWallet_auction) => {
  const [bid] = useMutation(BID_WITH_WALLET_MUTATION);

  const { showNotification } = useSnackNotificationContext();
  const createEthMigration = useCreateEthMigration();

  const { prepareBid } = usePrepareBid({ signAuthorizations: true });

  const prepareAndBid = async ({
    supportedCurrency,
    bidAmountWei,
    conversionCreditId,
    amount,
  }: BidWithWalletArgs) => {
    const { settlementInfo, approvals } = await prepareBid({
      supportedCurrency,
      tokenPaymentMethod: TokenPaymentMethod.WALLET,
      englishAuctionId: auction.blockchainId,
      amount,
      conversionCreditId,
    });

    if (!approvals) {
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
          settlementInfo,
          approvals,
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
    fragment useBidWithWallet_auction on Auction {
      id
      blockchainId
    }
  ` as TypedDocumentNode<useBidWithWallet_auction>,
};

export default useBidWithWallet;
