import { gql } from '@apollo/client';

import { OfferType } from '@sorare/core/src/__generated__/globalTypes';
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
import useSignNewOffer from './useSignNewOffer';

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
        priceWei
        createdAt
        startDate
        endDate
        blockchainId
        marketFeeAmountWei
        marketFeeAmountFiat {
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

const useCreateSingleSaleOffer = () => {
  const [createOffer] = useMutation<
    CreateSingleSaleOfferMutation,
    CreateSingleSaleOfferMutationVariables
  >(CREATE_SINGLE_SALE_OFFER_MUTATION);
  const { showPopin } = useSingleSaleOfferContext();
  const approveMigrator = useApproveMigrator();
  const migrateCards = useMigrateCards();
  const createEthMigration = useCreateEthMigration();
  const signNewOffer = useSignNewOffer();

  return async (
    receiveWeiAmount: string,
    token: useCreateSingleSaleOffer_token,
    duration?: number
  ) => {
    await approveMigrator([token]);
    await createEthMigration();
    const migrationData = await migrateCards([token]);

    const { signedLimitOrders, errors: signingErrors } = await signNewOffer(
      OfferType.SINGLE_SALE_OFFER,
      [token.assetId],
      [],
      '0',
      receiveWeiAmount
    );

    if (signingErrors?.length) return signingErrors;

    const result = await createOffer({
      variables: {
        input: {
          dealId: generateDealId(),
          assetId: token.assetId,
          price: receiveWeiAmount,
          migrationData,
          starkSignatures: signedLimitOrders,
          duration,
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
