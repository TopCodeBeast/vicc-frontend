import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import {
  OfferType,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { generateDealId, isHandledError } from '@sorare/core/src/lib/deal';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

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
` as TypedDocumentNode<
  CreateDirectOfferMutation,
  CreateDirectOfferMutationVariables
>;

type CreateDirectOfferArgs = {
  receiverSlug: string;
  sendMonetaryAmount: MonetaryAmountOutput;
  receiveMonetaryAmount: MonetaryAmountOutput;
  sendTokens: useCreateDirectOffer_token[];
  receiveTokens: useCreateDirectOffer_token[];
  duration?: number;
  counteredOfferId?: string;
  sendAmountCurrency: SupportedCurrency;
  receiveAmountCurrency: SupportedCurrency;
};

const useCreateDirectOffer = () => {
  const [createOffer] = useMutation(CREATE_DIRECT_OFFER_MUTATION);
  const { showNotification } = useSnackNotificationContext();
  const approveMigrator = useApproveMigrator();
  const migrateCards = useMigrateCards();
  const createEthMigration = useCreateEthMigration();
  const prepareOffer = usePrepareOffer();

  return useCallback(
    async (args: CreateDirectOfferArgs) => {
      const {
        receiverSlug,
        sendMonetaryAmount,
        receiveMonetaryAmount,
        sendTokens,
        receiveTokens,
        duration,
        counteredOfferId,
        sendAmountCurrency,
        receiveAmountCurrency,
      } = args;
      try {
        await approveMigrator(sendTokens);
        await createEthMigration();
        const migrationData = await migrateCards(sendTokens);

        const sendMonetaryAmountIndex =
          getMonetaryAmountIndex(sendAmountCurrency);
        const receiveMonetaryAmountIndex = getMonetaryAmountIndex(
          receiveAmountCurrency
        );
        const sendAmount = {
          amount: sendMonetaryAmount[sendMonetaryAmountIndex]?.toString(),
          currency: sendAmountCurrency,
        };
        const receiveAmount = {
          amount: receiveMonetaryAmount[receiveMonetaryAmountIndex]?.toString(),
          currency: receiveAmountCurrency,
        };

        const settlementCurrencies =
          sendMonetaryAmount.eur > 0
            ? [sendAmountCurrency]
            : [receiveAmountCurrency];

        const {
          approvals,
          useAuthorizations,
          legacySignedLimitOrders,
          errors,
        } = await prepareOffer({
          type: OfferType.DIRECT_OFFER,
          sendAssetIds: sendTokens.map(t => t.assetId!),
          receiveAssetIds: receiveTokens.map(t => t.assetId!),
          sendWeiAmount: sendMonetaryAmount.wei,
          receiveWeiAmount: receiveMonetaryAmount.wei,
          receiverSlug,
          sendAmount,
          receiveAmount,
          settlementCurrencies,
        });

        if (errors?.length) return errors;

        const result = await createOffer({
          variables: {
            input: {
              dealId: generateDealId(),
              receiveAssetIds: receiveTokens.map(t => t.assetId!),
              sendAssetIds: sendTokens.map(t => t.assetId!),
              receiverSlug,
              migrationData,
              duration,
              counteredOfferId,
              ...(useAuthorizations
                ? {
                    ...(counteredOfferId && { receiveAmount }),
                    sendAmount,
                    approvals,
                  }
                : {
                    starkSignatures: legacySignedLimitOrders,
                    sendWeiAmount: sendMonetaryAmount.wei,
                    ...(counteredOfferId && {
                      receiveWeiAmount: receiveMonetaryAmount.wei,
                    }),
                  }),
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
  ` as TypedDocumentNode<useCreateDirectOffer_token>,
};

export default useCreateDirectOffer;
