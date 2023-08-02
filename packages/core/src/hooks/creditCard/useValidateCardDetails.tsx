import { CreditCardFormResult } from '@core/components/creditCard/AddCreditCardForm';

export const useValidateCardDetails = () => {
  return (card: CreditCardFormResult | undefined) => {
    if (!card) return false;
    return (
      card.firstName &&
      card.firstName.trim() !== '' &&
      card.lastName &&
      card.lastName.trim() !== '' &&
      card.cardNumber &&
      card.cardExpirationDate &&
      card.cardCvx
    );
  };
};
