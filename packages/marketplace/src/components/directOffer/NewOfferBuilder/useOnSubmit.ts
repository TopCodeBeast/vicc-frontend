import { gql } from '@apollo/client';
import { Dispatch, useCallback } from 'react';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { errorCodes } from '@sorare/core/src/hooks/graphql/useMutation';

import useCreateDirectOffer from '@marketplace/hooks/offers/useCreateDirectOffer';

import { useOnSubmit_token } from './__generated__/useOnSubmit.graphql';
import { switchToBuilding, switchToSubmitting } from './actions';
import { Actions, State } from './types';

const useOnSubmit = <D extends useOnSubmit_token>(
  to: { slug: string },
  onDone: () => void,
  counteredOfferId?: string
) => {
  const createOffer = useCreateDirectOffer();
  const { showNotification } = useSnackNotificationContext();

  return useCallback(
    async (dispatch: Dispatch<Actions<D>>, state: State<D>) => {
      dispatch(switchToSubmitting);
      try {
        const { sendCards, receiveCards, cardsData } = state;
        if (![...sendCards, ...receiveCards].every(c => cardsData[c.objectID]))
          throw new Error('Please retry later [Missing Card data]');

        const errors = await createOffer(
          to,
          state.sendEth.toString(),
          state.receiveEth.toString(),
          sendCards.map(c => cardsData[c.objectID]),
          receiveCards.map(c => cardsData[c.objectID]),
          state.duration * 24 * 60 * 60,
          counteredOfferId
        );
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
    [counteredOfferId, createOffer, onDone, showNotification, to]
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
  `,
};

export default useOnSubmit;
