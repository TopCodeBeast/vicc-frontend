import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { OfferType } from '@sorare/core/src/__generated__/globalTypes';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';
import { generateDealId, isHandledError } from '@sorare/core/src/lib/deal';
import { toWei } from '@sorare/core/src/lib/wei';

import {
  CreateDirectOfferMutation,
  CreateDirectOfferMutationVariables,
  useCreateDirectOffer_token,
} from './__generated__/useCreateDirectOffer.graphql';
import useApproveMigrator from './useApproveMigrator';
import useMigrateCards from './useMigrateCards';
import usePrepareOffer from './usePrepareOffer';

const CREATE_DIRECT_OFFER_MUTATION = gql`
  mutation CreateDirectOfferMutation($input: createDirectOfferInput!) {
    createDirectOffer(input: $input) {
      tokenOffer {
        id
        counteredOffer {
          id
          status
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

const useCreateDirectOffer = () => {
  const [createOffer] = useMutation<
    CreateDirectOfferMutation,
    CreateDirectOfferMutationVariables
  >(CREATE_DIRECT_OFFER_MUTATION);
  const { showNotification } = useSnackNotificationContext();
  const approveMigrator = useApproveMigrator();
  const migrateCards = useMigrateCards();
  const createEthMigration = useCreateEthMigration();
  const prepareOffer = usePrepareOffer();

  return useCallback(
    async (
      receiver: { slug: string },
      sendAmountInEth: string,
      receiveAmountInEth: string,
      sendTokens: useCreateDirectOffer_token[],
      receiveTokens: useCreateDirectOffer_token[],
      duration?: number,
      counteredOfferId?: string
    ) => {
      try {
        const receiveWeiAmount = toWei(receiveAmountInEth);
        const sendWeiAmount = toWei(sendAmountInEth);
        await approveMigrator(sendTokens);
        await createEthMigration();
        const migrationData = await migrateCards(sendTokens);

        const { legacySignedLimitOrders, errors } = await prepareOffer({
          type: OfferType.DIRECT_OFFER,
          sendAssetIds: sendTokens.map(t => t.assetId!),
          receiveAssetIds: receiveTokens.map(t => t.assetId!),
          sendWeiAmount,
          receiveWeiAmount,
          receiverSlug: receiver.slug,
        });

        if (errors?.length) return errors;

        const result = await createOffer({
          variables: {
            input: {
              dealId: generateDealId(),
              receiveAssetIds: receiveTokens.map(t => t.assetId!),
              sendAssetIds: sendTokens.map(t => t.assetId!),
              receiverSlug: receiver.slug,
              sendWeiAmount,
              ...(counteredOfferId && { receiveWeiAmount }),
              starkSignatures: legacySignedLimitOrders,
              migrationData,
              duration,
              counteredOfferId,
            },
          },
          refetchQueries: [
            'MyOffersAllOffersSentQuery',
            'MyOffersLiveOffersSentQuery',
          ],
        });

        const createErrors = result.data?.createDirectOffer?.errors || [];

        if (createErrors.length) {
          showNotification(
            'errors',
            { errors: formatGqlErrors(createErrors) },
            { level: Level.WARN }
          );
          return createErrors;
        }
        return null;
      } catch (e: any) {
        if (isHandledError(e)) {
          return [{ message: e.message }];
        }

        throw e;
      }
    },
    [
      approveMigrator,
      createEthMigration,
      createOffer,
      migrateCards,
      prepareOffer,
      showNotification,
    ]
  );
};

useCreateDirectOffer.fragments = {
  token: gql`
    fragment useCreateDirectOffer_token on Token {
      assetId
      slug
      ...useApproveMigrator_token
      ...useMigrateCards_token
    }
    ${useApproveMigrator.fragments.token}
    ${useMigrateCards.fragments.token}
  `,
};

export default useCreateDirectOffer;
