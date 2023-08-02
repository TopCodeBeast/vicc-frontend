import { defineMessages } from 'react-intl';

import {
  INVALID_PHONE_VERIFICATION_CODE,
  PHONE_VERIFICATION_REQUEST_EXPIRED,
  TOO_MANY_ATTEMPTS,
  WRONG_CODE_PROVIDED_TOO_MANY_TIMES,
} from './useCheckPhoneNumberVerificationCode';
import { PHONE_NUMBER_ALREADY_USED } from './useVerifyPhoneNumber';

export const errorMessages = defineMessages({
  [PHONE_VERIFICATION_REQUEST_EXPIRED]: {
    id: 'VerifyPhoneNumber.expiredRequest',
    defaultMessage: 'The phone verification request has expired. Please retry.',
  },
  [INVALID_PHONE_VERIFICATION_CODE]: {
    id: 'VerifyPhoneNumber.invalidCode',
    defaultMessage: 'Invalid verification code. Please retry.',
  },
  [WRONG_CODE_PROVIDED_TOO_MANY_TIMES]: {
    id: 'VerifyPhoneNumber.wrongCode',
    defaultMessage: 'Wrong code provided too many times. Please retry.',
  },
  [PHONE_NUMBER_ALREADY_USED]: {
    id: 'VerifyPhoneNumber.alreadyUsed',
    defaultMessage: 'This phone number is already used by another user.',
  },
  [TOO_MANY_ATTEMPTS]: {
    id: 'VerifyPhoneNumber.tooManyAttempts',
    defaultMessage:
      'You have made too many attempts. Please try again in an hour.',
  },
});

export default defineMessages({
  title: {
    id: 'VerifyPhoneNumber.title',
    defaultMessage: 'To access this page, please verify your phone number',
  },
});
