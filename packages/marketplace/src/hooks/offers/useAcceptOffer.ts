import { gql } from '@apollo/client';

import {
  SupportedCurrency,
  TokenPaymentMethod,
} from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { formatGqlErrors } from '@sorare/core/src/gql';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useCreateEthMigration from '@sorare/core/src/hooks/starkware/useCreateEthMigration';

import SmallUser from '@marketplace/components/user/SmallUser';

import {
  AcceptOfferMutation,
  AcceptOfferMutationVariables,
  useAcceptOffer_token,
} from './__generated__/useAcceptOffer.graphql';
import useApproveMigrator from './useApproveMigrator';
import useMigrateCards from './useMigrateCards';
import usePrepareAcceptOffer from './usePrepareAcceptOffer';

const ACCEPT_OFFER_MUTATION = gql`
  mutation AcceptOfferMutation($input: acceptOfferInput!) {
    acceptOffer(input: $input) {
      deal {
        ... on TokenPrimaryOffer {
          id
          status
          endDate
          buyer {
            slug
            ...SmallUser_user
          }
        }
        ... on TokenOffer {
          id
          status
          senderSide {
            id
            wei
            nfts {
              slug
              assetId
              liveSingleSaleOffer {
                id
              }
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
  ${SmallUser.fragments.user}
`;

type AcceptOfferArgs = {
  supportedCurrency: SupportedCurrency;
  offerId: string;
  conversionCreditId?: string;
  receiveTokens: useAcceptOffer_token[];
};

const useAcceptOffer = () => {
  const [acceptOffer] = useMutation<
    AcceptOfferMutation,
    AcceptOfferMutationVariables
  >(ACCEPT_OFFER_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
  const { showNotification } = useSnackNotificationContext();
  const { signLimitOrders } = useWalletContext();
  const approveMigrator = useApproveMigrator();
  const migrateCards = useMigrateCards();
  const createEthMigration = useCreateEthMigration();
  const { prepareAcceptOffer } = usePrepareAcceptOffer({
    signAuthorizations: true,
  });

  const prepareAndAcceptOffer = async ({
    offerId,
    receiveTokens,
    conversionCreditId,
    supportedCurrency,
  }: AcceptOfferArgs) => {
    const { settlementInfo, useAuthorizations, legacyLimitOrders, approvals } =
      await prepareAcceptOffer({
        offerId,
        supportedCurrency,
        tokenPaymentMethod: TokenPaymentMethod.WALLET,
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

    await approveMigrator(receiveTokens);
    await createEthMigration();

    const migrationData = await migrateCards(receiveTokens);

    const result = await acceptOffer({
      variables: {
        input: {
          offerId,
          migrationData,
          starkSignatures: legacyLimitOrders!.map((o, i) => ({
            nonce: o.nonce,
            expirationTimestamp: o.expirationTimestamp,
            data: legacyStarkSignatures?.[i] || '',
            starkKey: legacyStarkKey,
          })),
          conversionCreditId,
          ...(useAuthorizations && { settlementInfo }),
          ...(useAuthorizations && approvals && { approvals }),
        },
      },
    });
    return result;
  };

  return async (props: AcceptOfferArgs) => {
    const result = await prepareAndAcceptOffer(props);
    if (result?.errors) return formatGqlErrors(result.errors);
    return null;
  };
};

useAcceptOffer.fragments = {
  token: gql`
    fragment useAcceptOffer_token on Token {
      assetId
      slug
      ...useApproveMigrator_token
      ...useMigrateCards_token
    }
    ${useApproveMigrator.fragments.token}
    ${useMigrateCards.fragments.token}
  `,
};

export default useAcceptOffer;
