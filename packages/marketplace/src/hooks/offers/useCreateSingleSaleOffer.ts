import { gql } from '@apollo/client';

import {
  AmountInput,
  OfferType,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';
import { generateDealId } from '@sorare/core/src/lib/deal';

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
      tokenOffer {
        id
        sender {
          ... on User {
            slug
          }
        }
        priceWei: price
        createdAt
        startDate
        endDate
        blockchainId
        marketFeeAmountWei: marketFeeAmount
        marketFeeAmountFiat: marketFeeAmountInFiat {
          eur
          usd
          gbp
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
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

type CreateSingleSaleOfferArgs = {
  amountInput: AmountInput;
  legacyWeiAmount: string;
  token: useCreateSingleSaleOffer_token;
  duration?: number;
};

const useCreateSingleSaleOffer = () => {
  const [createOffer] = useMutation<
    CreateSingleSaleOfferMutation,
    CreateSingleSaleOfferMutationVariables
  >(CREATE_SINGLE_SALE_OFFER_MUTATION);
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
      receiveAmount: {
        ...amountInput,
      },
      // TODO: PLUG TO USER SETTINGS WHEN AVAILABLE
      settlementCurrencies: [SupportedCurrency.WEI],
    });

    if (signingErrors?.length) return signingErrors;

    const result = await createOffer({
      variables: {
        input: {
          dealId: generateDealId(),
          assetId: token.assetId,
          price: legacyWeiAmount,
          migrationData,
          starkSignatures: legacySignedLimitOrders,
          duration,
          ...(useAuthorizations && {
            receiveAmount: {
              ...amountInput,
            },
            settlementCurrencies: [SupportedCurrency.WEI],
            approvals,
          }),
        },
      },
    });

    const updatedToken =
      result.data?.createSingleSaleOffer?.tokenOffer?.senderSide?.nfts[0];

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
  `,
};

export default useCreateSingleSaleOffer;
