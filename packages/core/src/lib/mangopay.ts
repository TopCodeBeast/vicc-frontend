import mangopay from 'mangopay-cardregistration-js-kit';
import { defineMessages } from 'react-intl';

import { FiatWalletKycRefusedReason } from '__generated__/globalTypes';
import { MANGOPAY_BASE_URL, MANGOPAY_CLIENT_ID } from '@core/config';

export type MangopayCardRegistrationParams = {
  id: string;
  accessKey: string;
  cardRegistrationURL: string;
  preregistrationData: any;
};

export type MangopayCardData = {
  cardNumber: string;
  cardExpirationDate: string;
  cardCvx: string;
  cardType?: 'CB_VISA_MASTERCARD' | 'AMEX' | 'MAESTRO';
};

export const shortRefusedReasonsMessages =
  defineMessages<FiatWalletKycRefusedReason>({
    [FiatWalletKycRefusedReason.DOCUMENT_HAS_EXPIRED]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentHasExpiredShort',
      defaultMessage: 'The ID you submitted has expired.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_NOT_ACCEPTED]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentNotAcceptedShort',
      defaultMessage:
        'The document you submitted is not an ID accepted by Vicc.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_UNREADABLE]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentUnreadableShort',
      defaultMessage: 'The ID provided is not clear enough.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_INCOMPLETE]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentIncompleteShort',
      defaultMessage:
        'The ID upload you submitted is incomplete; for example, it may be missing information or images.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_DO_NOT_MATCH_USER_DATA]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentDoNotMatchUserDataShort',
      defaultMessage:
        'There was a problem with the ID you uploaded. The document you submitted appears to contain inconsistent information and/or cannot be authenticated.',
    },
    [FiatWalletKycRefusedReason.UNDERAGE_PERSON]: {
      id: 'createFiatWallet.HandleIdReviewError.error.underagePersonShort',
      defaultMessage:
        'The individual on the document submitted is under 18 years old. Please note Vicc is only accessible to those 18 and older. Please contact the Vicc Support team for assistance.',
    },
  });

export const refusedReasonsMessages =
  defineMessages<FiatWalletKycRefusedReason>({
    [FiatWalletKycRefusedReason.DOCUMENT_HAS_EXPIRED]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentHasExpired',
      defaultMessage:
        'The ID you submitted has expired. Please resubmit a non-expired ID.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_NOT_ACCEPTED]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentNotAccepted',
      defaultMessage:
        'The document you submitted is not an ID accepted by Vicc. Please resubmit an approved ID.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_UNREADABLE]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentUnreadable',
      defaultMessage:
        'The ID provided is not clear enough. Please check the clarity and readability of your file before submitting. Whenever possible, upload high-quality images.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_INCOMPLETE]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentIncomplete',
      defaultMessage:
        'The ID upload you submitted is incomplete; for example, it may be missing information or images. Please resubmit photo(s) of an original, undamaged ID, and ensure the file contains both sides of the ID, if applicable.',
    },
    [FiatWalletKycRefusedReason.DOCUMENT_DO_NOT_MATCH_USER_DATA]: {
      id: 'createFiatWallet.HandleIdReviewError.error.documentDoNotMatchUserData',
      defaultMessage:
        'The individual listed does not correspond to the individual registered with this account. Please check to see if you uploaded the correct file, and resubmit.',
    },
    [FiatWalletKycRefusedReason.UNDERAGE_PERSON]: {
      id: 'createFiatWallet.HandleIdReviewError.error.underagePerson',
      defaultMessage:
        'There was a problem with the ID you uploaded. The individual on the document submitted is under 18 years old. Please note Vicc is only accessible to those 18 and older.',
    },
  });

// Error codes list can be found here: https://mangopay.com/docs/errors/error-codes
export const mangopayErrors = defineMessages({
  '001599': {
    id: 'MangopayErrors.token',
    defaultMessage: "The token for the card wasn't created.",
  },
  '101699': {
    id: 'MangopayErrors.failed',
    defaultMessage: 'The card registration failed.',
  },
  '105202': {
    id: 'MangopayErrors.invalidNumber',
    defaultMessage: 'The card’s number is invalid.',
  },
  '105203': {
    id: 'MangopayErrors.expiry',
    defaultMessage:
      'The card’s expiry date information provided is either invalid or missing.',
  },
  '105204': {
    id: 'MangopayErrors.cvv',
    defaultMessage:
      'The card verification code information provided is either invalid or missing.',
  },
  '105299': {
    id: 'MangopayErrors.bank',
    defaultMessage: 'An error occurred when submitting the token to the bank.',
  },
});

const { cardRegistration } = mangopay;

cardRegistration.baseURL = MANGOPAY_BASE_URL;
cardRegistration.clientId = MANGOPAY_CLIENT_ID;

export const registerCard = async (
  params: MangopayCardRegistrationParams,
  cardData: MangopayCardData
): Promise<{ CardId: string }> => {
  cardRegistration.init({
    cardRegistrationURL: params.cardRegistrationURL,
    preregistrationData: params.preregistrationData,
    accessKey: params.accessKey,
    Id: params.id,
  });

  return new Promise((resolve, reject) => {
    cardRegistration.registerCard(
      cardData,
      (res: any) => resolve(res),
      (res: any) => reject(res)
    );
  });
};
