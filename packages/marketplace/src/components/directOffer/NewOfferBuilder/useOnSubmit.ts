import { TypedDocumentNode, gql } from '@apollo/client';
import { Dispatch, useCallback } from 'react';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { errorCodes } from '@sorare/core/src/hooks/graphql/useMutation';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';

import useCreateDirectOffer from '@marketplace/hooks/offers/useCreateDirectOffer';

import { useOnSubmit_token } from './__generated__/useOnSubmit.graphql';
import { switchToBuilding, switchToSubmitting } from './actions';
import { Actions, State } from './types';

const useOnSubmit = <D extends useOnSubmit_token>(
  to: { slug: string },
  onDone: () => void,
  counteredOfferId?: string
) => {
  const {
    flags: { useNewWallet },
  } = useFeatureFlags();
  const createOffer = useCreateDirectOffer();
  const { canListAndTrade } = useFiatBalance();
  const { showNotification } = useSnackNotificationContext();

  return useCallback(
    async (dispatch: Dispatch<Actions<D>>, state: State<D>) => {
      dispatch(switchToSubmitting);
      try {
        const {
          sendCards,
          receiveCards,
          cardsData,
          sendAmount: sendMonetaryAmount,
          receiveAmount: receiveMonetaryAmount,
          sendAmountCurrency: stateSendAmountCurrency,
          receiveAmountCurrency: stateReceiveAmountCurrency,
        } = state;

        const sendAmountCurrency =
          canListAndTrade && useNewWallet
            ? stateSendAmountCurrency
            : SupportedCurrency.WEI;
        const receiveAmountCurrency =
          canListAndTrade && useNewWallet
            ? stateReceiveAmountCurrency
            : SupportedCurrency.WEI;

        if (![...sendCards, ...receiveCards].every(c => cardsData[c.objectID]))
          throw new Error('Please retry later [Missing Card data]');

        const errors = await createOffer({
          receiverSlug: to.slug,
          sendMonetaryAmount,
          receiveMonetaryAmount,
          sendTokens: sendCards.map(c => cardsData[c.objectID]),
          receiveTokens: receiveCards.map(c => cardsData[c.objectID]),
          duration: state.duration * 24 * 60 * 60,
          counteredOfferId,
          sendAmountCurrency,
          receiveAmountCurrency,
        });
        if (errors) {
          if (
            errors.some(
              error =>
                typeof error === 'object' &&
                'code' in error &&
                error?.code === errorCodes.unverifiedEmail
            )
          ) {
            onDone();
          }
          dispatch(switchToBuilding);
        } else {
          onDone();
          showNotification('offerSent');
        }
      } catch (e: any) {
        showNotification('errors', { errors: e.message });
        dispatch(switchToBuilding);
      }
    },
    [
      canListAndTrade,
      useNewWallet,
      createOffer,
      to.slug,
      counteredOfferId,
      onDone,
      showNotification,
    ]
  );
};

useOnSubmit.fragments = {
  token: gql`
    fragment useOnSubmit_token on Token {
      assetId
      slug
      ...useCreateDirectOffer_token
    }
    ${useCreateDirectOffer.fragments.token}
  ` as TypedDocumentNode<useOnSubmit_token>,
};

export default useOnSubmit;
