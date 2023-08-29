import { useIntl } from 'react-intl';

import { CreditCardFormResult } from '@core/components/creditCard/AddCreditCardForm';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { mangopayErrors, registerCard } from '@core/lib/mangopay';

import { useCreateCardRegistration } from './useCreateCardRegistration';
import { useCreatePayer } from './useCreatePayer';

export const useRegisterMangopayCard = () => {
  const [prepareRegistration] = useCreateCardRegistration();
  const { formatMessage } = useIntl();
  const { fiatWalletAccountable } = useCurrentUserContext();
  const [createPayer] = useCreatePayer();
  const registerMangopayCard = async (card: CreditCardFormResult) => {
    if (!fiatWalletAccountable) {
      const { errors: createPayerErrors } = await createPayer({
        variables: {
          input: {
            firstName: card.firstName,
            lastName: card.lastName,
          },
        },
      });
      if (createPayerErrors && createPayerErrors.length > 0)
        return {
          errors: createPayerErrors.map(e => e.message),
        };
    }
    const { data, errors } = await prepareRegistration({
      variables: {
        input: {
          cardType: card.cardType,
        },
      },
    });
    const preRegistrationData =
      data?.createCardRegistration?.preRegistrationData;
    if (preRegistrationData) {
      const { id, accessKey, cardRegistrationUrl } = preRegistrationData;
      try {
        const { CardId } = await registerCard(
          {
            id,
            accessKey,
            cardRegistrationURL: cardRegistrationUrl,
            preregistrationData: preRegistrationData.data,
          },
          card
        );

        return {
          cardId: CardId,
        };
      } catch (e: any) {
        if (
          e.ResultCode &&
          Object.keys(mangopayErrors).includes(e.ResultCode)
        ) {
          return {
            errors: [
              formatMessage(
                mangopayErrors[e.ResultCode as keyof typeof mangopayErrors]
              ),
            ],
          };
        }
        if (e.ResultMessage) {
          return { errors: [e.ResultMessage] };
        }

        return { errors: [formatMessage(mangopayErrors['101699']), ' ', e] };
      }
    } else {
      return {
        errors: errors.map(e => e.message),
      };
    }
  };
  return registerMangopayCard;
};
