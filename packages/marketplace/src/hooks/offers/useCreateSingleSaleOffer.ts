import { TypedDocumentNode, gql } from '@apollo/client';

import {
  AmountInput,
  OfferType,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';
import { useSettlementCurrencies } from '@sorare/core/src/hooks/useSettlementCurrencies';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { generateDealId } from '@sorare/core/src/lib/deal';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { useSingleSaleOfferContext } from '@marketplace/contexts/singleSaleOffer';

import {
  CreateSingleSaleOfferMutation,
  CreateSingleSaleOfferMutationVariables,
  useCreateSingleSaleOffer_token,
} from './__generated__/useCreateSingleSaleOffer.graphql';
import useApproveMigrator from './useApproveMigrator';
import useMigrateCards from './useMigrateCards';
import usePrepareOffer from './usePrepareOffer';

const CREATE_SINGLE_SALE_OFFER_MUTATION = gql`
  mutation CreateSingleSaleOfferMutation($input: createSingleSaleOfferInput!) {
    createSingleSaleOffer(input: $input) {
      offer {
        id
        sender {
          ... on User {
            slug
          }
        }
        createdAt
        startDate
        endDate
        blockchainId
        marketFeeAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        senderSide {
          id
          nfts {
            assetId
            slug
            tradeableStatus
            myMintedSingleSaleOffer {
              id
            }
            liveSingleSaleOffer {
              id
            }
          }
        }
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
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
` as TypedDocumentNode<
  CreateSingleSaleOfferMutation,
  CreateSingleSaleOfferMutationVariables
>;

type CreateSingleSaleOfferArgs = {
  amountInput: AmountInput;
  legacyWeiAmount: string;
  token: useCreateSingleSaleOffer_token;
  duration?: number;
};

const useCreateSingleSaleOffer = () => {
  const [createOffer] = useMutation(CREATE_SINGLE_SALE_OFFER_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
  const { canListAndTrade: canListAndTradeInFiat } = useFiatBalance();
  const settlementCurrencies = useSettlementCurrencies();
  const { showPopin } = useSingleSaleOfferContext();
  const approveMigrator = useApproveMigrator();
  const migrateCards = useMigrateCards();
  const createEthMigration = useCreateEthMigration();
  const prepareOffer = usePrepareOffer();

  return async ({
    amountInput,
    legacyWeiAmount,
    token,
    duration,
  }: CreateSingleSaleOfferArgs) => {
    await approveMigrator([token]);
    await createEthMigration();
    const migrationData = await migrateCards([token]);
    const receiveAmount = canListAndTradeInFiat
      ? amountInput
      : {
          amount: legacyWeiAmount,
          currency: SupportedCurrency.WEI,
        };

    const {
      useAuthorizations,
      approvals,
      legacySignedLimitOrders,
      errors: signingErrors,
    } = await prepareOffer({
      type: OfferType.SINGLE_SALE_OFFER,
      sendAssetIds: [token.assetId],
      receiveAssetIds: [],
      sendWeiAmount: '0',
      receiveWeiAmount: legacyWeiAmount,
      receiveAmount,
      settlementCurrencies,
    });

    if (signingErrors?.length) return signingErrors;

    const result = await createOffer({
      variables: {
        input: {
          dealId: generateDealId(),
          assetId: token.assetId,
          // migrationData,
          duration,
          ...(useAuthorizations
            ? {
                receiveAmount,
                settlementCurrencies,
                approvals,
              }
            : {
                starkSignatures: legacySignedLimitOrders,
                price: legacyWeiAmount,
              }),
        },
      },
    });

    const updatedToken =
      result.data?.createSingleSaleOffer?.offer?.senderSide?.nfts[0];

    if (updatedToken?.myMintedSingleSaleOffer) {
      showPopin({ assetId: updatedToken?.assetId });
    }

    return null;
  };
};

useCreateSingleSaleOffer.fragments = {
  token: gql`
    fragment useCreateSingleSaleOffer_token on Token {
      assetId
      slug
      ...useApproveMigrator_token
      ...useMigrateCards_token
    }
    ${useApproveMigrator.fragments.token}
    ${useMigrateCards.fragments.token}
  ` as TypedDocumentNode<useCreateSingleSaleOffer_token>,
};

export default useCreateSingleSaleOffer;
